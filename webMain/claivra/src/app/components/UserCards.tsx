"use client";
import { useEffect, useState } from "react";
import { IoBarChartSharp } from "react-icons/io5";

export default function UserCard() {
  const [stats, setStats] = useState({
    volumeTraded: 0,
    marketsTraded: 0,
    totalProfit: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/tickets/userStats");
        const data = await res.json();

        setStats({
          volumeTraded: data.volumeTraded,
          marketsTraded: data.marketsTraded,
          totalProfit: data.totalProfit,
        });
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      <div className="flex flex-col border border-slate-300 py-6 pl-4 pr-12 rounded-xl gap-1">
        <IoBarChartSharp className="text-xl mb-3 text-gray-600" />
        <h1 className="text-xs text-gray-600">Volume Traded</h1>
        <h1 className="font-semibold text-xl text-gray-800">
          ${stats.volumeTraded}
        </h1>
      </div>

      <div className="flex flex-col border border-slate-300 py-6 pl-4 pr-12 rounded-xl gap-1">
        <IoBarChartSharp className="text-xl mb-3 text-gray-600" />
        <h1 className="text-xs text-gray-600">Markets Traded</h1>
        <h1 className="font-semibold text-xl text-gray-800">{stats.marketsTraded}</h1>
      </div>

      <div className="flex flex-col border border-slate-300 py-6 pl-4 pr-12 rounded-xl gap-1">
        <IoBarChartSharp className="text-xl mb-3 text-gray-600" />
        <h1 className="text-xs text-gray-600">Total Profit</h1>
        <h1 className="font-semibold text-xl text-gray-800">
          ${stats.totalProfit}
        </h1>
      </div>
    </div>
  );
}
