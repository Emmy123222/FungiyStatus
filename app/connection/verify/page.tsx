"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PointsSummary from "../point/page";

type Account = {
  id: string;
  label: string;
  icon: string;
  subtitle: string;
  progress: number;
  complete: boolean;
  delayStart: number;
};

export default function VerifyingAccounts() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "evn",
      label: "EVN Wallet",
      icon: "/icons/eth.png",
      subtitle: "Verifying EVN Onchain Transactions...",
      progress: 0,
      complete: false,
      delayStart: 0,
    },
    {
      id: "sol",
      label: "Solana Wallet",
      icon: "/icons/sol.png",
      subtitle: "Verifying SOL Onchain Transactions...",
      progress: 0,
      complete: false,
      delayStart: 5000,
    },
    {
      id: "twitter",
      label: "@Fungily011",
      icon: "/icons/X.png",
      subtitle: "Verifying Twitter Ingenuity...",
      progress: 0,
      complete: false,
      delayStart: 10000,
    },
  ]);
  const [showPointsSummary, setShowPointsSummary] = useState(false);

  const allComplete = accounts.every((acc) => acc.complete);

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    accounts.forEach((acc, index) => {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setAccounts((prev) =>
            prev.map((item) => {
              if (item.id === acc.id && !item.complete) {
                const newProgress = item.progress + 10;
                return {
                  ...item,
                  progress: newProgress,
                  subtitle:
                    newProgress >= 100
                      ? "Verification Complete"
                      : item.subtitle,
                  complete: newProgress >= 100,
                };
              }
              return item;
            })
          );
        }, 1000);
        intervals.push(interval);
      }, acc.delayStart);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, []);

  const renderCard = (account: Account) => (
    <div
      key={account.id}
      className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px]  mx-auto"
    >
      <div className="flex items-center space-x-3">
        <img src={account.icon} alt={account.label} className="w-8 h-8" />
        <div className="flex flex-col items-start text-left">
          <span className="font-medium text-base">{account.label}</span>
          <span className="text-sm text-gray-400">
            {account.complete ? "Verification Complete" : account.subtitle}
          </span>
        </div>
      </div>

      {account.complete ? (
        <img src="/icons/green.png" alt="done" className="w-6 h-6" />
      ) : (
        <svg
          className="w-6 h-6 animate-spin text-purple-400"
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
    </div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white px-6 ">
      {showPointsSummary ? (
        <PointsSummary setShowPointsSummary={setShowPointsSummary} />
      ) : (
        <>
          {/* Error Notification */}
          {!allComplete && (
            <div className="absolute top-4 right-4 bg-[#190202] text-white p-4 rounded-lg w-[380px] h-[120px] space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <img
                  src="/icons/icon.png"
                  alt="error icon"
                  className="w-6 h-6"
                />
                <img
                  src="/icons/close.png"
                  alt="close icon"
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
              <p className="font-semibold text-[16px] leading-[24px] tracking-[-0.0031em] font-[Geist] text-red-500">
                Connection Lost! Error
              </p>
              <p className="font-medium text-[16px] leading-[24px] tracking-[-0.0031em] font-[Geist] text-red-500">
                Error occurred. Kindly re-try again.
              </p>
            </div>
          )}

          <div className="text-center space-y-6">
            <h1 className="font-[Geist] font-semibold text-[49px] leading-[100%] tracking-[-2px] whitespace-nowrap">
              {allComplete
                ? "Verification Complete"
                : "Verification in Progress"}
            </h1>
            <p className="font-[Geist] font-medium text-[16px] leading-[24px] tracking-[-0.05px] mx-auto max-w-[468px]">
              {allComplete
                ? "All your accounts have been verified."
                : "Please wait while we verify all your activities on all your accounts."}
            </p>

            <div className="space-y-4 mt-8">
              {accounts.map((acc) => renderCard(acc))}
            </div>

            {allComplete && (
              <button
                className="mt-6 bg-gradient-to-r from-[#8349FF] to-[#A259FF] text-white px-6 py-3 rounded-[16px] font-semibold text-base w-[468px] cursor-pointer"
                onClick={() => setShowPointsSummary(true)} // Switch to PointsSummary
              >
                View Your Points
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
