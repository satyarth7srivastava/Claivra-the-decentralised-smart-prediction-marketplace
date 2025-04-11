"use client";

import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ethers } from "ethers";

import { getContract } from "@/app/bc-utils/utils";

export default function CreateNewQuiz() {
    const [quizData, setQuizData] = useState({
        quizeName: "",
        quizeDescription: "",
        minBetAmt: 0,
        maxBetAmt: 0,
        quizeOptions: [{ optionID: 1, optionText: "", totalBet: 0 }],
    });

    const handleInputChange = (field: string, value: string) => {
        setQuizData((prev) => ({ ...prev, [field]: value }));
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...quizData.quizeOptions];
        updatedOptions[index].optionText = value;
        setQuizData((prev) => ({ ...prev, quizeOptions: updatedOptions }));
    };

    const addOption = () => {
        setQuizData((prev) => ({
            ...prev,
            quizeOptions: [
                ...prev.quizeOptions,
                { optionID: prev.quizeOptions.length + 1, optionText: "", totalBet: 0 },
            ],
        }));
    };

    const removeOption = (index: number) => {
        const updatedOptions = quizData.quizeOptions.filter((_, i) => i !== index);
        setQuizData((prev) => ({
            ...prev,
            quizeOptions: updatedOptions.map((option, i) => ({
                ...option,
                optionID: i + 1,
            })),
        }));
    };

    const handleSubmit = async () => {
        try {
            //adding the wallet address of the organizer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(0);
            const Address = await signer.getAddress(); // Replace with actual wallet address
            const quizDataWithWallet = { ...quizData, Address };
            const response = await axios.post("/api/quizes/create", quizDataWithWallet); // Replace with your API endpoint
            if (response.status !== 200) {
                throw new Error("Failed to create quiz");
            }
            const quizID = response.data.quizID; // Assuming the API returns the quiz ID
            const contract = await getContract();
            const tx = await contract.createQuiz(
                quizData.minBetAmt,
                quizData.maxBetAmt,
                quizID,
                quizData.quizeOptions.length
            );
            await tx.wait(); // Wait for the transaction to be mined
            
            console.log("Transaction successful:", tx);
            console.log("Quiz created successfully:", response.data);
            alert("Quiz created successfully!");
        } catch (error) {
            console.error("Error creating quiz:", error);
            alert("Failed to create quiz. Please try again.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col px-16 pt-6">
                <h1 className="text-secBlack text-3xl font-bold mb-8">Create New Quiz</h1>
                <div className="flex flex-col gap-6">
                    <div>
                        <label className="text-sm text-line2">Quiz Name</label>
                        <input
                            type="text"
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={quizData.quizeName}
                            onChange={(e) => handleInputChange("quizeName", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Quiz Description</label>
                        <textarea
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={quizData.quizeDescription}
                            onChange={(e) => handleInputChange("quizeDescription", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Minimum Bet Amount</label>
                        <input
                            type="number"
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={quizData.minBetAmt}
                            onChange={(e) => handleInputChange("minBetAmt", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Maximum Bet Amount</label>
                        <input
                            type="number"
                            className="w-full py-2 px-4 rounded-md border border-line1"
                            value={quizData.maxBetAmt}
                            onChange={(e) => handleInputChange("maxBetAmt", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-line2">Options</label>
                        <div className="flex flex-col gap-2">
                            {quizData.quizeOptions.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        className="w-full py-2 px-4 rounded-md border border-line1"
                                        value={option.optionText}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                                    <button
                                        className="text-red-500"
                                        onClick={() => removeOption(index)}
                                        disabled={quizData.quizeOptions.length <= 1}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            className="text-primaryBlue mt-2"
                            onClick={addOption}
                        >
                            Add Option
                        </button>
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
