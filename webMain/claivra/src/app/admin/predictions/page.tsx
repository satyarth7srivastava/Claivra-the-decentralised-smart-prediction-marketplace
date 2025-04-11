"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getContract } from "@/app/bc-utils/utils";

interface QuizOption {
    optionID: number;
    optionText: string;
    totalBet: number;
}

interface Quiz {
    quizeID: number;
    quizeName: string;
    quizeDescription: string;
    minBetAmt: number;
    maxBetAmt: number;
    quizeOptions: QuizOption[];
    approvalStatus: "pending" | "approved" | "rejected";
}

const AllPredictions = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get("/api/quizes/getAllQuizes");
                if (res.status === 200) {
                    setQuizzes(res.data);
                } else {
                    setError("Failed to fetch quizzes");
                }
            } catch (error: any) {
                console.error("Error fetching quizzes:", error);
                setError("Failed to fetch quizzes");
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const handleApproval = async (quizeID: number, status: "approved" | "rejected") => {
        try {
            const contract = await getContract();
            if (!contract) {
                setError("Failed to get contract instance");
                return;
            }
            var tx;
            if(status === "approved"){
                tx = await contract.appvoreRequest(quizeID);
                await tx.wait();
            }else{
                tx = await contract.rejectRequest(quizeID);
                await tx.wait();
            }
            if (!tx) {
                setError("Transaction failed");
                return;
            }
            const res = await axios.post("/api/quizes/updateStatus", { quizeID, status });
            if (res.status === 200) {
                setQuizzes((prevQuizzes) =>
                    prevQuizzes.map((quiz) =>
                        quiz.quizeID === quizeID ? { ...quiz, approvalStatus: status } : quiz
                    )
                );
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating status");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-full h-full bg-[#f6f6e6] p-6">
            <h1 className="text-3xl font-bold text-primaryBlue mb-6">All Predictions</h1>
            <div className="flex flex-col gap-4">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz.quizeID}
                        className="p-4 bg-white rounded-md shadow-md flex flex-col gap-4"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-primaryBlack">{quiz.quizeName}</h2>
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${quiz.approvalStatus === "pending"
                                        ? "bg-yellow-200 text-yellow-800"
                                        : quiz.approvalStatus === "approved"
                                            ? "bg-green-200 text-green-800"
                                            : "bg-red-200 text-red-800"
                                    }`}
                            >
                                {quiz.approvalStatus}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">{quiz.quizeDescription}</p>
                        <div className="flex justify-between">
                            <div>
                                <h6 className="text-xs text-gray-500">Min Bet</h6>
                                <p className="text-sm text-primaryBlack">${quiz.minBetAmt}</p>
                            </div>
                            <div>
                                <h6 className="text-xs text-gray-500">Max Bet</h6>
                                <p className="text-sm text-primaryBlack">${quiz.maxBetAmt}</p>
                            </div>
                        </div>
                        <div>
                            <h6 className="text-xs text-gray-500">Options</h6>
                            <ul className="list-disc pl-5 text-sm text-gray-700">
                                {quiz.quizeOptions.map((option) => (
                                    <li key={option.optionID}>
                                        {option.optionText} - Total Bet: ${option.totalBet}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {quiz.approvalStatus === "pending" && (
                            <div className="flex gap-4">
                                <button
                                    className="px-4 py-2 bg-green text-white rounded-md hover:bg-emerald-300"
                                    onClick={() => handleApproval(quiz.quizeID, "approved")}
                                >
                                    Approve
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    onClick={() => handleApproval(quiz.quizeID, "rejected")}
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPredictions;