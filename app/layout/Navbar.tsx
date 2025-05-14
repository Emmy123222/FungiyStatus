"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Jazzicon from "react-jazzicon";
import { useWallet } from "@/contexts/WalletContext";

export default function Navbar() {
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  type MobileMenuProps = {
    setIsMobileMenuOpen: (open: boolean) => void;
  };
  const {
    connectedAddress,
    connectedWalletType,
    connectMetaMask,
    connectWalletConnect,
    disconnectWallet,
    error,
  } = useWallet();

  // Debug state changes
  useEffect(() => {
    console.log("Navbar state:", {
      connectedAddress,
      connectedWalletType,
      error,
    });
  }, [connectedAddress, connectedWalletType, error]);

  // Check for MetaMask
  useEffect(() => {
    const isMetaMask =
      typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
    setIsMetamaskInstalled(isMetaMask);
    if (!isMetaMask) console.log("MetaMask not detected");
  }, []);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsWalletPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Wallet action handlers
  const handleConnectMetaMask = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting MetaMask connection");
      await connectMetaMask();
    } catch (err) {
      console.error("MetaMask connection failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWalletConnect = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting WalletConnect connection");
      await connectWalletConnect();
    } catch (err) {
      console.error("WalletConnect connection failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting disconnect");
      await disconnectWallet();
      setIsWalletPopupOpen(false);
    } catch (err) {
      console.error("Disconnect failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Address formatting
  const formatAddress = (address: string) =>
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  const jsNumberForAddress = (address: string) =>
    parseInt(address.slice(2, 10), 16);

  // Wallet Popup Component
  const WalletPopup = () => (
    <div
      ref={popupRef}
      className="fixed md:absolute top-20 md:top-16 right-4 md:right-0 w-[90%] max-w-[320px] bg-[#1A1429] rounded-2xl p-6 border border-[#2A1F4A] shadow-lg z-50 md:z-40"
    >
      <h3 className="text-white font-semibold text-lg mb-4">
        {connectedAddress ? "Wallet Options" : "Connect a Wallet"}
      </h3>
      <div className="space-y-3">
        <button
          onClick={
            connectedAddress && connectedWalletType === "walletconnect"
              ? handleDisconnect
              : handleConnectWalletConnect
          }
          disabled={isLoading}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2A1F4A]"
          } bg-[#211438]`}
        >
          <img
            src="/icons/walletconnect.png"
            alt="WalletConnect"
            className="w-6 h-6"
          />
          <span className="text-white flex-1 text-left">WalletConnect</span>
          <span
            className={`text-xs font-medium ${
              connectedAddress && connectedWalletType === "walletconnect"
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {connectedAddress && connectedWalletType === "walletconnect"
              ? "Disconnect"
              : "Connect"}
          </span>
        </button>
        <button
          onClick={
            connectedAddress && connectedWalletType === "metamask"
              ? handleDisconnect
              : handleConnectMetaMask
          }
          disabled={isLoading || !isMetamaskInstalled}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
            isLoading || !isMetamaskInstalled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#2A1F4A]"
          } bg-[#211438]`}
        >
          <img src="/icons/metamask.png" alt="MetaMask" className="w-6 h-6" />
          <span className="text-white flex-1 text-left">MetaMask</span>
          <span
            className={`text-xs font-medium ${
              connectedAddress && connectedWalletType === "metamask"
                ? "text-red-400"
                : isMetamaskInstalled
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {connectedAddress && connectedWalletType === "metamask"
              ? "Disconnect"
              : isMetamaskInstalled
              ? "Connect"
              : "Not Installed"}
          </span>
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-3 bg-[#2A1F4A] p-2 rounded">
          Error: {error}
        </p>
      )}
      {isLoading && <p className="text-blue-400 text-xs mt-3">Connecting...</p>}
      <p className="text-xs text-gray-400 mt-4">
        By connecting a wallet, you agree to Fungily’s Terms of Service.
      </p>
    </div>
  );

  // Mobile Menu Component
  const MobileMenu = ({ setIsMobileMenuOpen }: MobileMenuProps) => (
    <div className="md:hidden fixed inset-0 bg-[#0B0713] z-40 pt-16 px-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-6 text-lg text-white">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2 hover:bg-[#2A1F4A] rounded-md transition"
          >
            SWAP
          </Link>
          <Link
            href="/presale"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2 hover:bg-[#2A1F4A] rounded-md transition"
          >
            PRESALE
          </Link>
          <Link
            href="/marketplace"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2 hover:bg-[#2A1F4A] rounded-md transition"
          >
            MARKETPLACE
          </Link>
          <Link
            href="/connect"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-2 text-[#00A3FF] hover:bg-[#2A1F4A] rounded-md transition"
          >
            CHECK STATUS
          </Link>
        </div>
        <div className="top-6 right-4 absolute">
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/icons/close.png" alt="Close" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <header className="w-full bg-[#140D23] py-4 px-4 sm:px-6 h-[74px] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/icons/fungily.png" alt="Fungily Logo" className="h-8" />
          <span className="text-white font-semibold text-lg">Fungily</span>
        </Link>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => {
              setIsWalletPopupOpen(!isWalletPopupOpen);
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm relative ${
              connectedAddress
                ? "bg-[#2A1F4A] text-white"
                : "bg-gradient-to-r from-[#7B42FF] to-[#B01EFF] text-white"
            }`}
          >
            {connectedAddress ? (
              <>
                <Jazzicon
                  diameter={24}
                  seed={jsNumberForAddress(connectedAddress)}
                />
                <span>{formatAddress(connectedAddress)}</span>
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  {connectedWalletType === "metamask" ? (
                    <img
                      src="/icons/metamask.png"
                      alt="MetaMask"
                      className="w-4 h-4"
                    />
                  ) : (
                    <img
                      src="/icons/walletconnect.png"
                      alt="WalletConnect"
                      className="w-4 h-4"
                    />
                  )}
                </span>
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white"
          >
            <Image src="/icons/menu1.png" alt="Menu" width={24} height={24} />
          </button>
          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white absolute top-4 right-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm ">
          <Link
            href="/"
            className="text-white px-3 py-1 rounded-md hover:bg-[#2A1F4A] transition"
          >
            Swap
          </Link>
          <Link
            href="/connect"
            className="text-[#00A3FF] px-3 py-1 rounded-md hover:bg-[#2A1F4A] transition"
          >
            Check Status
          </Link>
        </nav>
        <button
          onClick={() => setIsWalletPopupOpen(!isWalletPopupOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm relative max-sm:hidden ${
            connectedAddress
              ? "bg-[#2A1F4A] text-white"
              : "bg-gradient-to-r from-[#7B42FF] to-[#B01EFF] text-white"
          }`}
        >
          {connectedAddress ? (
            <>
              <Jazzicon
                diameter={24}
                seed={jsNumberForAddress(connectedAddress)}
              />
              <span>{formatAddress(connectedAddress)}</span>
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                {connectedWalletType === "metamask" ? (
                  <img
                    src="/icons/metamask.png"
                    alt="MetaMask"
                    className="w-4 h-4"
                  />
                ) : (
                  <img
                    src="/icons/walletconnect.png"
                    alt="WalletConnect"
                    className="w-4 h-4"
                  />
                )}
              </span>
              <img
                src="/icons/arrow1.png"
                alt="Arrow"
                className={`w-4 h-4 ml-2 transition-transform ${
                  isWalletPopupOpen ? "rotate-180" : ""
                }`}
              />
            </>
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} />
      )}

      {/* Wallet Popup */}
      {isWalletPopupOpen && <WalletPopup />}
    </header>
  );
}
