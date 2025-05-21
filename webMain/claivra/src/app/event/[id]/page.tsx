"use client";

import { Minus, Plus, Star } from "lucide-react";
import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { predictions } from "../../lib/data";
import { useState } from "react";
import axios from "axios";

import { getContract } from "@/app/bc-utils/utils";

//importing temprary image 
import quizImage from "@/../public/trump.png";

interface QuizOption {
    optionID: number;
    optionText: string;
    totalBet: number;
}

interface Quiz {
    id: string;
    quizID: number;
    quizName: string;
    quizDescription: string;
    minBetAmt: number;
    maxBetAmt: number;
    quizOptions: QuizOption[];
    approvalStatus: 'pending' | 'approved' | 'rejected';
}

const getWinning = async (ID: number, betId: number, betAmount: number) => {
    const contract = await getContract();
    const winning = await contract.getPredictedWinAmount(ID, betId, betAmount);
    return winning;
}

export default function Event({ params }: { params: Promise<{ id: string }> }) {
    const [betAmount, setBetAmount] = useState(0);
    const [quizID, setQuizID] = useState(0);
    const [toWin, setToWin] = useState("");
    const [betId, setBetId] = useState("");
    const [winning, setWinning] = useState("");
    const [event, setEvent] = useState<Quiz>(); // Replace 'any' with your event type
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchQuize = async () => {
            const id = await params;
            const quizID = id.id;
            setQuizID(Number(quizID));
            if (quizID === null) {
                console.error("Quiz ID is null or undefined.");
                return;
            }
            try {
                const response = await axios.post("/api/quizes/getQuizzesByID", {
                    quizID: quizID,
                });
                console.log("Fetched quiz data:", response.data);
                setEvent(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
                setIsLoading(false);
            }
        }
        fetchQuize();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (betId !== "") {
        var betIDNum = Number(betId);
        const win = getWinning(quizID, betIDNum, betAmount);
        win.then((result) => setWinning(result.toString()));
    }

    return (
        <div>
            <Navbar />
            <div className="flex gap-10">
                {/* Left div */}
                <div className="flex flex-col w-8/12 px-16 pt-6">
                    <div className="flex gap-8 justify-start pb-14 items-center">
                        <img src={quizImage.src} alt="event" width={80} className="rounded-full" />
                        <h1 className="text-secBlack text-2xl">{event?.quizName}</h1>
                    </div>
                    <div className="mx-12">
                        <img src="/graph.png" className="rounded-md" />
                        <div className="flex gap-4 w-full mb-20 mt-6">
                            {event?.quizOptions.map((quizeOptions, index) => (
                                <button
                                    key={index}
                                    onClick={() => setBetId(index.toString())}
                                    className="bg-line1 text-primaryBlack w-1/2 py-2 rounded-md"
                                >
                                    {quizeOptions.optionText}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-12 my-20">
                            <input
                                type="text"
                                placeholder="Market Summary"
                                className="drop-shadow-md bg-[#f8f8f8] placeholder-primaryBlack px-4 rounded-md border border-opacity-60 border-secBlack w-full py-3 pointer-events-none"
                            />
                            <button className="bg-primaryBlue text-primaryWhite py-3 px-8 rounded-md">
                                Generate
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-primaryBlue text-3xl font-bold">Rules</h1>
                                <div className="border border-t-line1 w-full mt-2 "></div>
                            </div>
                            <div className="flex flex-col gap-3 mt-4 mb-32">
                                <span>
                                    This market will resolve to “Yes” if the conditions specified in
                                    the event are met.
                                </span>
                                <span>
                                    The resolution source will be a consensus of credible reporting.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right div */}
                <div className="flex flex-col gap-4 my-20 rounded-xl py-10 px-6 bg-line1 h-[615px]">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-line2">Your Bet Amount</label>
                        <input
                            className="py-1.5 bg-primaryWhite px-4 rounded-sm"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-line2">To win</label>
                        <input
                            className="py-1.5 bg-primaryWhite px-4 rounded-sm"
                            value={toWin}
                            onChange={(e) => setToWin(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2 text-line2 mt-10 text-sm">
                        <div className="flex justify-between">
                            <h1>Maximum winning</h1>
                            <h1>${winning}</h1>
                        </div>
                    </div>

                    <button className="bg-primaryBlue text-primaryWhite py-2.5 px-8 rounded-md my-8">
                        Buy Now
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

