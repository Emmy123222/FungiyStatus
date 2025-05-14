"use client";

interface PointsSummaryProps {
  setShowPointsSummary: (value: boolean) => void;
}

export default function PointsSummary({
  setShowPointsSummary,
}: PointsSummaryProps) {
  const totalPoints = 100000;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white px-6 ">
      <div className="text-center space-y-6">
        <h2 className="text-lg font-medium text-gray-400">
          Your Fungily Points
        </h2>
        <h1 className="font-[Geist] font-semibold text-[72px] leading-[100%] tracking-[-2px] whitespace-nowrap">
          {totalPoints.toLocaleString()}
        </h1>
        <p className="font-[Geist] font-medium text-[16px] leading-[24px] tracking-[-0.05px] mx-auto max-w-[468px] text-gray-400">
          Here's a summary of your verified points from all accounts.
        </p>

        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22] mx-auto">
            <div className="flex items-center space-x-3">
              <img src="/icons/eth.png" alt="eth" className="w-8 h-8" />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium text-base text-white">
                  EVM Onchain Activity
                </span>
                <span className="text-sm text-gray-400">Verified</span>
              </div>
            </div>
            <div className="flex items-center gap-4 ">
              <span className="font-medium text-base text-green-400">
                +20,000pts
              </span>
              <img src="/icons/arrows.png" alt="" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22] mx-auto">
            <div className="flex items-center space-x-3">
              <img src="/icons/sol.png" alt="sol" className="w-8 h-8" />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium text-base text-white">
                  SOL Onchain Activity
                </span>
                <span className="text-sm text-gray-400">Not Connected</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium text-base text-gray-400">0pts</span>
              <button className="px-4 py-2 bg-[#1A1230] text-white rounded-lg text-sm hover:bg-[#2A1B40]">
                Connect wallet
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22] mx-auto">
            <div className="flex items-center space-x-3">
              <img src="/icons/X.png" alt="X" className="w-8 h-8" />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium text-base text-white">
                  X Points
                </span>
                <span className="text-sm text-gray-400">Verified</span>
              </div>
            </div>
            <div className="flex items-center gap-4 ">
              <span className="font-medium text-base text-green-400">
                +20,000pts
              </span>
              <img src="/icons/arrows.png" alt="" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22] mx-auto">
          <div className="flex items-center space-x-3">
            <img src="/icons/fungily.png" alt="" />
            <div className="flex flex-col items-start text-left">
              <span className="font-medium text-base text-white">
                Fungily NFT Points
              </span>
              <span className="text-sm text-gray-400">Verified</span>
            </div>
          </div>
          <span className="font-medium text-base text-green-400">+200pts</span>
        </div>

        <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22] mx-auto">
          <div className="flex items-center space-x-3">
            <img src="/icons/fungily.png" alt="" />
            <div className="flex flex-col items-start text-left">
              <span className="font-medium text-base text-white">
                Fungily Testnet Points
              </span>
              <span className="text-sm text-gray-400">Verified</span>
            </div>
          </div>
          <span className="font-medium text-base text-green-400">+20pts</span>
        </div>

        <div className="flex items-center justify-between p-4 border border-[#130B22] w-[468px] h-[92px] rounded-[24px] bg-[#130B22] mx-auto">
          <div className="flex items-center space-x-3">
            <img src="/icons/fungily.png" alt="" />
            <div className="flex flex-col items-start text-left">
              <span className="font-medium text-base text-white">
                Fungily Mainnet Points
              </span>
              <span className="text-sm text-gray-400">Verified</span>
            </div>
          </div>
          <span className="font-medium text-base text-green-400">+200pts</span>
        </div>
      </div>
    </div>
  );
}
