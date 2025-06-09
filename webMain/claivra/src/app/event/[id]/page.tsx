"use client";

import { Minus, Plus, Star } from "lucide-react";
import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";
import axios from "axios";
import { ErrorDecoder } from 'ethers-decode-error';

import { getContract } from "@/app/bc-utils/utils";

//importing temprary image 
import quizImage from "@/../public/trump.png";
import { ethers } from "ethers";
import { toast } from "sonner";

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




export default function Event({ params }: { params: Promise<{ id: string }> }) {
    const [betAmount, setBetAmount] = useState(0);
    const [quizID, setQuizID] = useState(0);
    const [betId, setBetId] = useState("");
    const [winning, setWinning] = useState(0);
    const [event, setEvent] = useState<Quiz>(); // Replace 'any' with your event type
    const [isLoading, setIsLoading] = useState(true);


    const getWinning = async (ID: number, betId: number, betAmount: number) => {
        try {
            const contract = await getContract();
            const winning = await contract.getPredictedWinAmount(ID, betId, betAmount);
            return winning;
        } catch (err) {
            const errorDecoder = ErrorDecoder.create();
            const decodedError = await errorDecoder.decode(err);
            if (decodedError) {
                console.error("Decoded error:", decodedError);
                const { reason } = decodedError;
                toast.error(`Error: ${reason}`);
            } else {
                console.error("Error during transaction:", err);
                toast.error("An error occurred while calculating the winning amount.");
            }
        } finally{
            setWinning(0); // Reset winning amount in case of error
        }
    }

    const handleBuyNow = async (betAmount: number, quizID: number, betId: number) => {
        try {
            const contract = await getContract();
            let ticketID = "";
            try {
                const tx = await contract.buyTicket(quizID, betId, { value: betAmount });
                const receipt = await tx.wait();
                const myEvent = await contract.queryFilter(
                    contract.filters.TicketBought(),
                    receipt?.blockNumber,
                    receipt?.blockNumber
                );
                const ticket = await myEvent[0].args[0]; // this is the ticket ID
                ticketID = ticket.toString();
            } catch (txError) {
                const errorDecoder = ErrorDecoder.create()
                const decodedError = await errorDecoder.decode(txError);
                if (decodedError) {
                    console.error("Decoded error:", decodedError);
                    const { reason } = decodedError;
                    toast.error(`Transaction failed: ${reason}`);
                } else {
                    console.error("Transaction error:", txError);
                    toast.error("Transaction failed. Please try again.");
                }
                console.error("Error during transaction:", txError);
                return;
            }

            const signerAddress = await window.ethereum.request({ method: 'eth_requestAccounts' })
                .then((accounts: string[]) => accounts[0])
                .catch((error: any) => {
                    console.error("Error fetching signer address:", error);
                    return "";
                });

            console.log("Hello from handleBuyNow");

            const res = await axios.post('../api/tickets/create', {
                ticketID: ticketID,
                quizID: quizID,
                walletID: signerAddress,
                betId: betId,
                betAmount: betAmount,
                winning: winning
            });
            if (res.status === 201) {
                toast.success("Ticket purchased successfully!");
            } else {
                toast.error("Failed to purchase ticket.");
            }
        } catch (error) {
            console.error("Error in handleBuyNow:", error);
            toast.error("An error occurred while purchasing the ticket.");
        }
    }


    const generatePredictedWinAmount = async () => {
        if (betAmount <= 0 || quizID <= 0 || betId === "") {
            console.error("Invalid input values.");
            return;
        }
        try {
            const winAmount = await getWinning(quizID, Number(betId), betAmount);
            console.log("Predicted winning amount:", winAmount);
            ethers.parseEther(winAmount.toString());
            setWinning(Number(ethers.formatEther(winAmount)));
        } catch (error) {
            console.error("Error fetching winning amount:", error);
        }
    };

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


    return (
        <div>
            <Navbar />
            <div className="flex">
                {/* Left div */}
                <div className="flex flex-col w-9/12 pl-24 pt-10">
                    <div className="flex gap-6 justify-start pb-14 items-center">
                        <img src={quizImage.src} alt="event" width={90} className="rounded-full" />
                        <h1 className="text-secBlack text-2xl">{event?.quizName}</h1>
                    </div>
                    <div className="mx-14 ">
                        <img src="/graph.png" className=" border-2 rounded-md" />
                        <div className="flex gap-4 w-full  mb-14 mt-10">
                            {event?.quizOptions.map((quizOptions, index) => (
                                <button
                                    key={index}
                                    onClick={() => setBetId(index.toString())}
                                    className={(betId === index.toString() ? "bg-primaryBlue text-primaryWhite" : "bg-primaryWhite text-primaryBlack") + " flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-secBlack hover:bg-primaryBlue hover:text-primaryWhite transition-all duration-300 w-1/2 "}
                                >
                                    {quizOptions.optionText}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-12 mb-16">
                            <input
                                type="text"
                                placeholder="Market Summary"
                                className="drop-shadow-md bg-[#f8f8f8] placeholder-primaryBlack px-4 rounded-md border border-opacity-60 border-secBlack w-full py-3 pointer-events-none"
                            />
                            <button className="bg-primaryBlue text-primaryWhite py-3 px-8 rounded-md"
                                onClick={generatePredictedWinAmount}>
                                Generate
                            </button>
                        </div>

                        <div className="flex flex-col gap-6 ">
                            <div>
                                <h1 className="text-primaryBlue text-3xl font-bold">Rules</h1>
                                <div className="border border-t-line1 w-full mt-2 "></div>
                            </div>
                            <div className="flex flex-col gap-3 mt-4 mb-24">
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
                <div className="flex flex-col justify-between rounded-2xl p-6 bg-line1 shadow-lg h-fit min-w-[300px] max-w-[340px] mt-10">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-line2">Your Bet Amount</label>
                        <input
                            className="py-2 bg-primaryWhite px-4 rounded-md border border-line2"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                        />
                    </div>

                    <div className="flex flex-col gap-2 text-line2 mt-10 text-sm">
                        <div className="flex justify-between">
                            <h1>Maximum winning</h1>
                            <h1>${winning}</h1>
                        </div>
                    </div>

                    <button
                        onClick={() => handleBuyNow(betAmount, quizID, Number(betId))}
                        disabled={betAmount <= 0}
                        className="bg-primaryBlue text-primaryWhite py-2.5 px-8 rounded-md mt-10">
                        Buy Now
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

