"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CreateNewQuiz() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [starred, setStarred] = useState(false);
    const [comments, setComments] = useState(0);
    const [dollar, setDollar] = useState(0);
    const [rewards, setRewards] = useState(0);
    const [chance, setChance] = useState(0);
    const [image, setImage] = useState("");

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const handleSubmit = () => {
        const newQuiz = {
            question,
            options,
            starred,
            comments,
            dollar,
            rewards,
            chance,
            image,
        };
        console.log("New Quiz Data:", newQuiz);
        // Add logic to save the quiz
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col px-16 pt-6">
                <h1 className="text-secBlack text-3xl font-bold mb-8">Create New Quiz</h1>
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="text-sm text-line2">Question</label>
                        <input
                            type="text"
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Options</label>
                        <div className="flex flex-col gap-2">
                            {options.map((option, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    placeholder={`Option ${index + 1}`}
                                    className="w-full py-2 px-4 rounded-md border border-line1"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-sm text-line2">Starred</label>
                        <input
                            type="checkbox"
                            checked={starred}
                            onChange={(e) => setStarred(e.target.checked)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Comments</label>
                        <input
                            type="number"
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={comments}
                            onChange={(e) => setComments(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Dollar (in million)</label>
                        <input
                            type="number"
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={dollar}
                            onChange={(e) => setDollar(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Rewards</label>
                        <input
                            type="number"
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={rewards}
                            onChange={(e) => setRewards(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Chance (%)</label>
                        <input
                            type="number"
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={chance}
                            onChange={(e) => setChance(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Image URL</label>
                        <input
                            type="text"
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-primaryBlue text-primaryWhite py-3 px-8 rounded-md mt-6"
                        onClick={handleSubmit}
                    >
                        Create Quiz
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
