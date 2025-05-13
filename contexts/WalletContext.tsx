// context/WalletContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

type WalletContextType = {
  connectedAddress: string | null;
  setConnectedAddress: (address: string | null) => void;
  connectMetaMask: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [connector, setConnector] = useState<WalletConnect | null>(null);

  useEffect(() => {
    const newConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    setConnector(newConnector);

    return () => {
      if (newConnector?.connected) {
        newConnector.killSession();
      }
    };
  }, []);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectedAddress(accounts[0]);
    } catch (err) {
      console.error("MetaMask connection error:", err);
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
      });

      connector.on("disconnect", (error) => {
        if (error) throw error;
        setConnectedAddress(null);
      });
    } catch (error) {
      console.error("WalletConnect error:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connectedAddress,
        setConnectedAddress,
        connectMetaMask,
        connectWalletConnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
