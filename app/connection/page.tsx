"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";

export default function ConnectAccountStatus() {
  const {
    connectedAddress,
    setConnectedAddress,
    connectMetaMask,
    connectWalletConnect,
  } = useWallet();

  const [walletConnecting, setWalletConnecting] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [twitterConnecting, setTwitterConnecting] = useState(false);

  // Fake Set Wallet delay
  useEffect(() => {
    if (walletConnecting) {
      const timer = setTimeout(() => {
        setWalletConnecting(false);
        setWalletConnected(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [walletConnecting]);

  // 🔑 Listen for "openWalletConnectModal" event
  useEffect(() => {
    const handleOpenWalletConnectModal = async () => {
      // You can present a modal here if you want user to choose
      // For now we default to MetaMask
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
  };

  const handleTwitterConnect = () => {
    setTwitterConnecting(true);
    setTimeout(() => {
      setTwitterConnecting(false);
      setTwitterConnected(true);
    }, 2000);
  };

  const handleTwitterDisconnect = () => {
    setTwitterConnected(false);
  };

  const isBlurred = !connectedAddress;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
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

      {/* Main Content (Blurred if not connected) */}
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
            {/* Primary Wallet */}
            <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22]">
              <div className="flex items-center space-x-3">
                <img src="/icons/eth.png" alt="eth" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">
                    {connectedAddress || "No wallet connected"}
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

            {/* Set Wallet (Optional) */}
            <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22]">
              <div className="flex items-center space-x-3">
                <img src="/icons/sol.png" alt="sol" />
                <span className="font-medium">
                  Connect Set Wallet (Optional)
                </span>
              </div>
              {walletConnecting ? (
                <div className="flex items-center text-sm text-blue-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
                  Connecting...
                </div>
              ) : walletConnected ? (
                <div className="flex items-center text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                  Connected
                </div>
              ) : null}
            </div>

            {/* Twitter Connection */}
            <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22]">
              <div className="flex items-center space-x-3">
                <img src="/icons/X.png" alt="X" />
                <span className="font-medium">Sign in with: X (Twitter)</span>
              </div>
              {twitterConnecting ? (
                <div className="flex items-center text-sm text-blue-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
                  Connecting...
                </div>
              ) : twitterConnected ? (
                <button
                  onClick={handleTwitterDisconnect}
                  className="text-sm text-red-600 hover:underline"
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
                  {twitterConnecting ? "Connecting..." : "Sign in"}
                </button>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              className="w-[468px] h-[55px] py-3 px-4 bg-[#171717] text-white rounded-lg hover:bg-[#222] disabled:bg-blue-300 disabled:cursor-not-allowed"
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
