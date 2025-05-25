"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import axios from "axios";

import { getContract } from "@/app/bc-utils/utils";

//importing temprary image
import quizImage from "@/../public/trump.png";
import { toast , ToastContainer} from "react-toastify";

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

export default function QuizDetails({ params }: { params: Promise<{ id: string }> }) {
    const [quiz, setQuiz] = useState<Quiz>() // Replace 'any' with your quiz type
    const [isLoading, setIsLoading] = useState(true);
    const [correctOption, setCorrectOption] = useState<number>(0);
    const [quizClosed, setQuizClosed] = useState(false);

    useEffect(() => {
        const fetchQuize = async () => {
            const id = await params;
            const quizID = id.id;
            console.log("Quiz ID from params:", quizID);
            if (quizID === null) {
                console.error("Quiz ID is null or undefined.");
                return;
            }
            try {
                const response = await axios.post("/api/quizes/getQuizzesByID", {
                    quizID: quizID,
                });
                console.log("Fetched quiz data:", response.data);
                setQuiz(response.data);
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

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    const handleSetCorrectOption = (optionIndex: number) => {
        setCorrectOption(optionIndex);
        toast.success(`Correct option set to: ${quiz.quizOptions[optionIndex - 1].optionText}`);
    };

    const handleCloseQuiz = async () => {
        setIsLoading(true);
        try {
            const contract = await getContract();
            if (!contract) {
                alert("Contract not found. Please try again.");
                return;
            }
            const tx = await contract.endQuiz(quiz.quizID, correctOption);
            await tx.wait();
            setQuizClosed(true);
        } catch (error: any) {
            console.error("Error closing quiz:", error);
            alert("Error closing quiz. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex gap-10">
                {/* Left div */}
                <div className="flex flex-col w-8/12 px-16 pt-6">
                    <ToastContainer aria-label="Notification Toasts" />
                    <div className="flex gap-8 justify-start pb-14 items-center">
                        <img src={quizImage.src} alt="quiz" width={80} className="rounded-full" />
                        <h1 className="text-secBlack text-2xl">{quiz.quizName}</h1>
                    </div>
                    <div className="mx-12">
                        <img src="/graph.png" className="rounded-md" />
                        <div className="flex gap-4 w-full mb-20 mt-6">
                            {Array.isArray(quiz.quizOptions) &&
                                quiz.quizOptions.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSetCorrectOption(index + 1)}
                                    className={`${correctOption === index + 1
                                        ? "bg-primaryBlue text-primaryWhite"
                                        : "bg-line1"
                                        } text-primaryBlack w-1/2 py-2 rounded-md`}
                                >
                                    {option.optionText}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-primaryBlue text-3xl font-bold">Rules</h1>
                                <div className="border border-t-line1 w-full mt-2 "></div>
                            </div>
                            <div className="flex flex-col gap-3 mt-4 mb-32">
                                <span>
                                    This quiz will resolve to the correct option set by the quiz
                                    creator.
                                </span>
                                <span>
                                    Once the quiz is closed, no further changes can be made.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right div */}
                <div className="flex flex-col gap-4 my-20 rounded-xl py-10 px-6 bg-line1 h-[615px]">
                    <button
                        onClick={handleCloseQuiz}
                        className="bg-primaryBlue text-primaryWhite py-2.5 px-8 rounded-md my-8"
                        disabled={quizClosed}
                    >
                        {quizClosed ? "Quiz Closed" : "Close Quiz"}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
