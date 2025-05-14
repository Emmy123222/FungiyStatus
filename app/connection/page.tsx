"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import Image from "next/image";

export default function ConnectAccountStatus() {
  const { connectedAddress, setConnectedAddress, connectMetaMask } =
    useWallet();

  const [walletConnecting, setWalletConnecting] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [solConnecting, setSolConnecting] = useState(false);
  const [solConnected, setSolConnected] = useState(false);
  const [solAddress, setSolAddress] = useState("0xda5F0...6g56"); 
  const [solConnectionFailed, setSolConnectionFailed] = useState(false);
  const [twitterConnecting, setTwitterConnecting] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState("@Fungily011"); 
  const [twitterConnectionFailed, setTwitterConnectionFailed] = useState(false);

 
  useEffect(() => {
    if (walletConnecting) {
      const timer = setTimeout(() => {
        setWalletConnecting(false);
        setWalletConnected(true);
        setConnectedAddress("0xd6DG...s45"); 
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [walletConnecting]);

  
  useEffect(() => {
    const handleOpenWalletConnectModal = async () => {
      try {
        await connectMetaMask();
      } catch (err) {
        console.error("Failed to connect wallet:", err);
      }
    };

    window.addEventListener(
      "openWalletConnectModal",
      handleOpenWalletConnectModal
    );
    return () => {
      window.removeEventListener(
        "openWalletConnectModal",
        handleOpenWalletConnectModal
      );
    };
  }, [connectMetaMask]);

  const handleDisconnectWallet = () => {
    setConnectedAddress(null);
    setWalletConnected(false);
  };

  const handleSolConnect = () => {
    if (!solConnected && !solConnecting) {
      setSolConnecting(true);
      setSolConnectionFailed(false);

      // Simulate wallet popup
      const walletSelected = window.confirm(
        "Select a wallet (e.g., Phantom or Solflare) to connect?"
      );
      if (walletSelected) {
        setTimeout(() => {
          const success = Math.random() > 0.3; 
          setSolConnecting(false);
          if (success) {
            setSolConnected(true);
          } else {
            setSolConnectionFailed(true);
          }
        }, 2000);
      } else {
        setSolConnecting(false);
      }
    }
  };

  const handleSolDisconnect = () => {
    setSolConnected(false);
    setSolConnectionFailed(false);
  };

  const handleTwitterConnect = () => {
    if (!twitterConnected && !twitterConnecting) {
      setTwitterConnecting(true);
      setTwitterConnectionFailed(false);

      // Simulate redirect to Twitter OAuth
      const twitterWindow = window.open(
        "https://twitter.com/login",
        "_blank",
        "width=500,height=600"
      );
      if (twitterWindow) {
        setTimeout(() => {
          const success = Math.random() > 0.3; // 70% success rate
          twitterWindow.close();
          setTwitterConnecting(false);
          if (success) {
            setTwitterConnected(true);
          } else {
            setTwitterConnectionFailed(true);
          }
        }, 2000);
      } else {
        setTwitterConnecting(false);
        setTwitterConnectionFailed(true);
      }
    }
  };

  const handleTwitterDisconnect = () => {
    setTwitterConnected(false);
    setTwitterConnectionFailed(false);
  };

  const isBlurred = !connectedAddress;
  const formatAddress = (address: string) =>
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white px-4">
      {/* Blur Overlay */}
      {isBlurred && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-4">
            You must connect your wallet to access this page.
          </p>
          <button
            className="bg-gradient-to-r from-[#7B42FF] to-[#B01EFF] text-white px-5 py-2 rounded-full text-sm font-medium"
            onClick={() => {
              const event = new CustomEvent("openWalletConnectModal");
              window.dispatchEvent(event);
            }}
          >
            Connect Wallet
          </button>
        </div>
      )}

      
      <div
        className={`relative z-10 transition-all ${
          isBlurred ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <div className="max-w-md w-full mx-auto p-6 text-white space-y-4 rounded-lg text-center">
          <h1 className="font-[Geist] font-semibold text-[49px] leading-[100%] tracking-[-2px]">
            Connect Account
          </h1>
          <p className="font-[Geist] font-medium text-[16px] leading-[24px] tracking-[-0.05px]">
            Connect your wallets and social accounts to verify your on-chain
            activity and build your Fungily Score.
          </p>

          <div className="space-y-4 mb-8 flex flex-col items-center">
           
            <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22]">
              <div className="flex items-center space-x-3">
                <img src="/icons/eth.png" alt="eth" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">
                    {connectedAddress
                      ? formatAddress(connectedAddress)
                      : "No wallet connected"}
                  </span>
                  {connectedAddress && (
                    <div className="flex items-center text-sm text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                      Connected
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleDisconnectWallet}
                disabled={!connectedAddress}
                className={`w-[115px] h-[36px] py-2 px-4 rounded-lg border text-sm font-medium ${
                  connectedAddress
                    ? "text-white border-[#665880] bg-[#665880] hover:bg-[#7a6b99]"
                    : "text-white border-[#665880] cursor-not-allowed opacity-50"
                }`}
              >
                Disconnect
              </button>
            </div>
            {/* Solana Wallet (Optional) */}
            <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22]">
              <div className="flex items-center space-x-3">
                <img src="/icons/sol.png" alt="sol" />
                <div className="flex flex-col items-start">
                  {solConnected ? (
                    <>
                      <span className="font-medium">{solAddress}</span>
                      <div className="flex items-center text-sm text-green-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                        Connected
                      </div>
                    </>
                  ) : (
                    <span className="font-medium">
                      Connect Sol Wallet (Optional)
                    </span>
                  )}
                </div>
              </div>
              {solConnecting ? (
                <div className="flex items-center text-sm text-blue-600">
                  <svg
                    className="w-4 h-4 mr-1 animate-spin text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Connecting...
                </div>
              ) : solConnected ? (
                <button
                  onClick={handleSolDisconnect}
                  className="w-[115px] h-[36px] py-2 px-4 rounded-lg border text-sm font-medium text-white border-[#665880] bg-[#665880] hover:bg-[#7a6b99]"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleSolConnect}
                  disabled={solConnecting || solConnected}
                  className={`w-[115px] h-[36px] bg-gradient-to-r from-[#7B42FF] to-[#B01EFF] text-white px-5 py-2 rounded-full text-sm font-medium ${
                    solConnecting || solConnected
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                >
                  Connect
                </button>
              )}
            </div>
            {solConnectionFailed && (
              <div className="flex items-center text-sm text-red-600 mt-2">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                Connection Failed. Retry
              </div>
            )}

            {/* Twitter Connection */}
            <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22]">
              <div className="flex items-center space-x-3">
                <img src="/icons/X.png" alt="X" />
                <div className="flex flex-col items-start">
                  {twitterConnected ? (
                    <>
                      <span className="font-medium">{twitterUsername}</span>
                      <div className="flex items-center text-sm text-green-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                        Connected
                      </div>
                    </>
                  ) : (
                    <span className="font-medium">
                      Sign in with: X (Twitter)
                    </span>
                  )}
                </div>
              </div>
              {twitterConnecting ? (
                <div className="flex items-center text-sm text-blue-600">
                  <svg
                    className="w-4 h-4 mr-1 animate-spin text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Connecting...
                </div>
              ) : twitterConnected ? (
                <button
                  onClick={handleTwitterDisconnect}
                  className="w-[115px] h-[36px] py-2 px-4 rounded-lg border text-sm font-medium text-white border-[#665880] bg-[#665880] hover:bg-[#7a6b99]"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleTwitterConnect}
                  disabled={twitterConnected || twitterConnecting}
                  className={`w-[115px] h-[36px] bg-gradient-to-r from-[#7B42FF] to-[#B01EFF] text-white px-5 py-2 rounded-full text-sm font-medium ${
                    twitterConnected || twitterConnecting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                >
                  Sign in
                </button>
              )}
            </div>
            {twitterConnectionFailed && (
              <div className="flex items-center text-sm text-red-600 mt-2">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                Connection Failed. Retry
              </div>
            )}
          </div>

         
          <div className="flex justify-center">
            <button
              className="w-[468px] h-[55px] py-3 px-4 bg-[#7B42FF] text-white rounded-lg hover:bg-[#9953FF] disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={!connectedAddress}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
