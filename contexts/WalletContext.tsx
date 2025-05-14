"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

type WalletType = "metamask" | "walletconnect" | null;

type WalletContextType = {
  connectedAddress: string | null;
  connectedWalletType: WalletType;
  setConnectedAddress: (address: string | null) => void;
  setConnectedWalletType: (type: WalletType) => void;
  connectMetaMask: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [connectedWalletType, setConnectedWalletType] =
    useState<WalletType>(null);
  const [error, setError] = useState<string | null>(null);
  const walletConnectRef = useRef<WalletConnect | null>(null);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      setError("MetaMask not installed");
      window.open("https://metamask.io/download.html", "_blank");
      return;
    }
    try {
      window.ethereum.removeAllListeners("accountsChanged");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setConnectedAddress(accounts[0]);
        setConnectedWalletType("metamask");
        setError(null);
      }
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setConnectedAddress(accounts[0]);
          setConnectedWalletType("metamask");
        }
      });
    } catch (err) {
      setError("Failed to connect MetaMask");
      console.error("MetaMask connection error:", err);
    }
  };

  const connectWalletConnect = async () => {
    try {
      const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal,
      });
      walletConnectRef.current = connector;
      if (!connector.connected) {
        await connector.createSession();
      }
      connector.off("connect");
      connector.off("disconnect");
      connector.on("connect", (error, payload) => {
        if (error) {
          setError("WalletConnect connection failed");
          console.error("WalletConnect connect error:", error);
          return;
        }
        const address = payload.params[0].accounts[0];
        setConnectedAddress(address);
        setConnectedWalletType("walletconnect");
        setError(null);
      });
      connector.on("disconnect", () => {
        disconnectWallet();
      });
    } catch (err) {
      setError("Failed to connect WalletConnect");
      console.error("WalletConnect connection error:", err);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (connectedWalletType === "walletconnect" && walletConnectRef.current) {
        await walletConnectRef.current.killSession();
        QRCodeModal.close();
        walletConnectRef.current = null;
      }
      if (window.ethereum?.removeAllListeners) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
      setConnectedAddress(null);
      setConnectedWalletType(null);
      setError(null);
    } catch (err) {
      setError("Failed to disconnect");
      console.error("Disconnect error:", err);
    }
  };

  useEffect(() => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    if (connector.connected) {
      const accounts = connector.accounts;
      if (accounts.length > 0) {
        setConnectedAddress(accounts[0]);
        setConnectedWalletType("walletconnect");
        walletConnectRef.current = connector;
      }

      connector.off("connect");
      connector.off("disconnect");

      connector.on("connect", (error, payload) => {
        if (error) {
          setError("WalletConnect restore connect error");
          console.error("WalletConnect restore connect error:", error);
          return;
        }
        const address = payload.params[0].accounts[0];
        setConnectedAddress(address);
        setConnectedWalletType("walletconnect");
        setError(null);
      });

      connector.on("disconnect", () => {
        disconnectWallet();
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connectedAddress,
        connectedWalletType,
        setConnectedAddress,
        setConnectedWalletType,
        connectMetaMask,
        connectWalletConnect,
        disconnectWallet,
        error,
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
