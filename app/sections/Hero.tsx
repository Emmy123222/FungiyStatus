// components/Hero.tsx
"use client";

import { useWallet } from "@/contexts/WalletContext";
import Link from "next/link";

export default function Hero() {
  const { connectedAddress, connectMetaMask } = useWallet();

  const handleClick = () => {
    if (!connectedAddress) {
      connectMetaMask();
    } else {
      document.getElementById("status")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className=" text-white text-center py-16 md:py-32 relative overflow-hidden">
      {/* Gradient background elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#7B42FF]/20 rounded-full filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#B01EFF]/20 rounded-full filter blur-3xl opacity-70"></div>
      </div> */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 md:space-y-8 relative z-10">
        <h1 className="font-geist font-bold text-4xl sm:text-5xl md:text-[72px] leading-[100%] tracking-[-0.02em] md:whitespace-nowrap">
          Build Your Fungily Score
        </h1>

        <p className="font-geist font-medium text-sm sm:text-base leading-6 tracking-[-0.05px] max-w-2xl mx-auto px-4">
          Connect your wallets and social accounts to verify
          <span className="hidden sm:inline">
            <br />
          </span>
          your on-chain activity and build your Fungily Score.
        </p>

        <div className="pt-2">
          <Link
            href="/connect"
            onClick={handleClick}
            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#7B42FF] to-[#B01EFF] text-white rounded-full font-semibold text-sm hover:opacity-90 transition cursor-pointer w-full max-w-[304px] h-[55px]"
          >
            {connectedAddress ? "Check Status" : "Connect Wallet"}
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#120B26] to-transparent pointer-events-none" /> */}
    </section>
  );
}
