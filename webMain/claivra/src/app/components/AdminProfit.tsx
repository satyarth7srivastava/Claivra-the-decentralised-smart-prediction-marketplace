"use client";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Wallet } from "lucide-react";
import axios from "axios";
import { getContract } from "../bc-utils/utils";
import { isError } from "ethers";
import { toast } from "sonner";

export default function AdminProfit() {
    const [profit, setProfit] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");

    const fetchProfit = async () => {
        setLoading(true);
        setError(null);
        try {
            const contract = await getContract();
            if (!contract) {
                setError("Failed to get contract instance");
                return;
            }
            const profit = await contract.getProfit();
            console.log("Profit fetched:", profit);
            setProfit(profit);
        } catch (err) {
            setError("Failed to fetch profit");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfit();
    }, []);

    const handleWithdraw = async (amount?: number) => {
        if (!amount && !withdrawAmount) return;
        try {
            // Replace with your actual withdraw API endpoint and logic
            const contract = await getContract();
            if (!contract) {
                alert("Failed to get contract instance");
                return;
            }
            const withdrawAmount = Number(amount);
            if (withdrawAmount <= 0) {
                alert("Invalid withdraw amount");
                return;
            }
            const tx = await contract.withdraw(withdrawAmount);

            alert("Withdrawal successful!");
            setShowWithdraw(false);
            setWithdrawAmount("");
            fetchProfit();
        } catch (err) {
            if (isError(err, "CALL_EXCEPTION")) {
                toast.error("Withdrawal failed. Due to " + err.reason);
            } else {
                toast.error("Withdrawal failed. Please try again.");
            }
        }
    };

    return (
        <div className="bg-transparent text-white rounded-lg shadow-lg mb-8 max-w-md mx-auto p-6 border-2 border-white">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Admin Profit</h2>
                <button
                    className="p-2 rounded hover:bg-[#232323] transition"
                    onClick={fetchProfit}
                    title="Refresh"
                >
                    <RefreshCw className={loading ? "animate-spin" : ""} />
                </button>
            </div>
            <div>
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" /> Loading...
                    </div>
                ) : error ? (
                    <div className="text-red-400">{error}</div>
                ) : (
                    <div className="text-4xl font-semibold text-emerald-400 mb-4">
                        ${profit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    onClick={() => setShowWithdraw((v) => !v)}
                >
                    <Wallet size={18} /> Withdraw
                </button>
                {showWithdraw && (
                    <div className="mt-4 bg-[#232323] p-4 rounded">
                        <label className="block mb-2 text-sm">Amount to withdraw</label>
                        <input
                            type="number"
                            min={1}
                            max={profit ?? undefined}
                            value={withdrawAmount}
                            onChange={e => setWithdrawAmount(e.target.value)}
                            className="w-full p-2 rounded bg-[#1f1f1f] border border-gray-700 text-white mb-3"
                            placeholder="Enter amount"
                        />
                        <div className="flex gap-2">
                            <button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition"
                                onClick={() => handleWithdraw(Number(withdrawAmount))}
                                disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
                            >
                                Withdraw
                            </button>
                            <button
                                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded transition"
                                onClick={() => handleWithdraw(profit ?? 0)}
                                disabled={!profit || profit <= 0}
                            >
                                Withdraw All
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}