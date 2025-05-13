"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Jazzicon from "react-jazzicon";
import { useWallet } from "@/contexts/WalletContext";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      isMetaMask?: boolean;
    };
  }
}

export default function Navbar() {
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isWalletConnectAvailable, setIsWalletConnectAvailable] =
    useState(true);
  const [connector, setConnector] = useState<WalletConnect | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { connectedAddress, setConnectedAddress } = useWallet();

  useEffect(() => {
    setIsMetamaskInstalled(typeof window.ethereum !== "undefined");
    setIsWalletConnectAvailable(typeof WalletConnect !== "undefined");
  }, []);

  useEffect(() => {
    if (connector || !isWalletConnectAvailable) return;

    const newConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    setConnector(newConnector);

    return () => {
      if (newConnector?.connected) newConnector.killSession();
    };
  }, [connector, isWalletConnectAvailable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowWalletPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const connectMetaMask = async () => {
    if (!isMetamaskInstalled) {
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    try {
      const accounts = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });
      setConnectedAddress(accounts[0]);
      setShowWalletPopup(false);
    } catch (error) {
      console.error("MetaMask connection error:", error);
    }
  };

  const connectWalletConnect = async () => {
    if (!connector) return;

    try {
      if (!connector.connected) {
        await connector.createSession();
      }

      connector.on("connect", (error, payload) => {
        if (error) throw error;
        const address = payload.params[0].accounts[0];
        setConnectedAddress(address);
        setShowWalletPopup(false);
      });

      connector.on("disconnect", (error) => {
        if (error) throw error;
        setConnectedAddress(null);
      });
    } catch (error) {
      console.error("WalletConnect error:", error);
    }
  };

  const handleDisconnect = () => {
    if (connector?.connected) {
      connector.killSession();
    }
    setConnectedAddress(null);
    setShowWalletPopup(false);
  };

  const formatAddress = (address: string) =>
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  const jsNumberForAddress = (address: string) =>
    parseInt(address.slice(2, 10), 16);

  return (
    <header className="w-full bg-[#140D23] py-4 px-4 sm:px-6 h-[74px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/icons/fungily.png" alt="Logo" width={28} height={28} />
          <span className="text-white font-semibold text-lg">Fungily</span>
        </div>

        {/* Mobile only: wallet & hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {connectedAddress ? (
            <button
              onClick={() => setShowWalletPopup(!showWalletPopup)}
              className="flex items-center gap-2 bg-[#211438] text-white px-4 py-2 rounded-full text-sm"
            >
              <Jazzicon
                diameter={24}
                seed={jsNumberForAddress(connectedAddress)}
              />
              <span>{formatAddress(connectedAddress)}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setShowWalletPopup(true);
                setMobileMenuOpen(false); // Prevent opening nav
              }}
              className="bg-gradient-to-r from-[#7B42FF] to-[#B01EFF] text-white px-4 py-2 rounded-full text-sm"
            >
              Connect wallet
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            <Image
              src={mobileMenuOpen ? "/icons/menu1.png" : "/icons/menu1.png"}
              alt="Toggle"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/" className="text-white hover:opacity-80">
            Swap
          </Link>
          <Link href="/connect" className="text-[#00A3FF]">
            Check Status
          </Link>
        </nav>

        {/* Desktop wallet button */}
        <div className="relative hidden md:block" ref={popupRef}>
          {connectedAddress ? (
            <button
              onClick={() => setShowWalletPopup(!showWalletPopup)}
              className="flex items-center gap-2 bg-[#211438] text-white px-4 py-2 rounded-full text-sm"
            >
              <Jazzicon
                diameter={24}
                seed={jsNumberForAddress(connectedAddress)}
              />
              <div className="text-left">
                <div className="text-xs text-gray-400">Connected</div>
                <div>{formatAddress(connectedAddress)}</div>
              </div>
              <Image
                src="/icons/arrow1.png"
                className={`w-4 h-4 ml-2 transition-transform ${
                  showWalletPopup ? "rotate-180" : ""
                }`}
                alt="arrow"
              />
            </button>
          ) : (
            <button
              onClick={() => setShowWalletPopup(true)}
              className="bg-gradient-to-r from-[#7B42FF] to-[#B01EFF] text-white px-5 py-2 rounded-full text-sm font-medium cursor-pointer"
            >
              Connect wallet
            </button>
          )}

          {showWalletPopup && (
            <div className="absolute right-0 top-12 bg-[#0F0A1A] rounded-[26px] p-6 w-[300px] shadow-xl border border-[#211438] z-50">
              <h3 className="text-white font-semibold text-lg mb-4">
                Connect a wallet
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center hover:bg-[#211438] p-3 rounded-md transition">
                  <span className="text-white">WalletConnect</span>
                  <button
                    onClick={
                      connectedAddress && connector?.connected
                        ? handleDisconnect
                        : connectWalletConnect
                    }
                    className={`text-xs font-medium cursor-pointer ${
                      connectedAddress && connector?.connected
                        ? "text-red-400"
                        : "text-green-400 hover:underline"
                    }`}
                  >
                    {connectedAddress && connector?.connected
                      ? "Disconnect"
                      : "Available"}
                  </button>
                </div>
                <div className="flex justify-between items-center hover:bg-[#211438] p-3 rounded-md transition">
                  <span className="text-white">MetaMask</span>
                  <button
                    onClick={
                      connectedAddress && !connector?.connected
                        ? handleDisconnect
                        : connectMetaMask
                    }
                    className={`text-xs font-medium cursor-pointer ${
                      connectedAddress && !connector?.connected
                        ? "text-red-400"
                        : "text-green-400 hover:underline"
                    }`}
                  >
                    {connectedAddress && !connector?.connected
                      ? "Disconnect"
                      : isMetamaskInstalled
                      ? "Detected"
                      : "Not Installed"}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                By connecting a wallet, you agree to Fungily Terms of Service.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 text-sm text-white space-y-4">
          <Link href="#" className="block hover:opacity-80">
            Swap
          </Link>
          <Link
            href="/connect"
            className="block text-[#00A3FF] hover:underline"
          >
            Check Status
          </Link>
        </div>
      )}

      {/* Mobile wallet popup shown globally, not inside mobile menu */}
      {showWalletPopup && (
        <div
          ref={popupRef}
          className="md:hidden mt-4 bg-[#0F0A1A] rounded-[26px] p-6 border border-[#211438]"
        >
          <h3 className="text-white font-semibold text-lg mb-4">
            Connect a wallet
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center hover:bg-[#211438] p-3 rounded-md transition">
              <span className="text-white">WalletConnect</span>
              <button
                onClick={
                  connectedAddress && connector?.connected
                    ? handleDisconnect
                    : connectWalletConnect
                }
                className={`text-xs font-medium ${
                  connectedAddress && connector?.connected
                    ? "text-red-400"
                    : "text-green-400 hover:underline"
                }`}
              >
                {connectedAddress && connector?.connected
                  ? "Disconnect"
                  : "Available"}
              </button>
            </div>
            <div className="flex justify-between items-center hover:bg-[#211438] p-3 rounded-md transition">
              <span className="text-white">MetaMask</span>
              <button
                onClick={
                  connectedAddress && !connector?.connected
                    ? handleDisconnect
                    : connectMetaMask
                }
                className={`text-xs font-medium ${
                  connectedAddress && !connector?.connected
                    ? "text-red-400"
                    : "text-green-400 hover:underline"
                }`}
              >
                {connectedAddress && !connector?.connected
                  ? "Disconnect"
                  : isMetamaskInstalled
                  ? "Detected"
                  : "Not Installed"}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            By connecting a wallet, you agree to Fungilys Terms of Service.
          </p>
        </div>
      )}
    </header>
  );
}
