"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { quizzes } from "../../../lib/data"; // Assuming quizzes data is similar to predictions

export default function QuizDetails({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string | null>(null);
    const [correctOption, setCorrectOption] = useState<string | null>(null);
    const [quizClosed, setQuizClosed] = useState(false);

    useEffect(() => {
        params.then((resolvedParams) => setId(resolvedParams.id));
    }, [params]);

    if (id === null) {
        return <div>Loading...</div>;
    }

    const quiz = quizzes[parseInt(id)]; // Fetch quiz data using id

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    const handleSetCorrectOption = (optionIndex: number) => {
        setCorrectOption(optionIndex.toString());
        alert(`Correct option set to: ${quiz.options[optionIndex]}`);
    };

    const handleCloseQuiz = () => {
        setQuizClosed(true);
        alert("Quiz has been closed.");
    };

    return (
        <div>
            <Navbar />
            <div className="flex gap-10">
                {/* Left div */}
                <div className="flex flex-col w-8/12 px-16 pt-6">
                    <div className="flex gap-8 justify-start pb-14 items-center">
                        <img src={quiz.image} alt="quiz" width={80} className="rounded-full" />
                        <h1 className="text-secBlack text-2xl">{quiz.question}</h1>
                    </div>
                    <div className="mx-12">
                        <img src="/graph.png" className="rounded-md" />
                        <div className="flex gap-4 w-full mb-20 mt-6">
                            {quiz.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSetCorrectOption(index)}
                                    className={`${
                                        correctOption === index.toString()
                                            ? "bg-green-500"
                                            : "bg-line1"
                                    } text-primaryBlack w-1/2 py-2 rounded-md`}
                                >
                                    {option}
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
