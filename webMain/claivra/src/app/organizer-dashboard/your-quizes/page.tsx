"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
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

const YourQuizzes = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    //getting data from the mongoDB
    const fetchQuizzes = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(0);
      const Address = await signer.getAddress();
      try {
        const response = await axios.post("/api/quizes/getQuizzes", {
          walletAddress: Address});
        console.log(response.data);
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, [])

  const handleQuizClick = (id: number) => {
    console.log("Quiz ID:", id);
    router.push(`/organizer-dashboard/your-quizes/${id}`);
  };

  return (
    <div className="w-full h-full bg-[#f6f6e6]">
      <div className="flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold text-primaryBlue mb-6">
          Your Quizzes
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.quizID}
              className="m-4 max-w-sm flex flex-col justify-center rounded-md cursor-pointer"
              style={{ boxShadow: "0px 3px 3px 0px rgb(86,86,86, 0.5)" }}
              onClick={() => handleQuizClick(quiz.quizID)}
            >
              <div className="px-6 flex gap-8 justify-start pt-5 pb-10 items-center">
                <img
                  src={quizImage.src}
                  alt="quiz image"
                  width={68}
                  className="rounded-full"
                />
                <h1 className="text-secBlack max-w-64 text-base">
                  {quiz.quizName}
                </h1>
              </div>
              <div className="px-4 pb-4">
                <div className="flex justify-between items-center">
                  <button className="transition-all duration-300">
                  </button>
                  <div className="flex flex-col items-start gap-1">
                    <h6 className="text-grey text-xs">Min Bet</h6>
                    <h3 className="text-primaryBlack text-sm">
                      ${quiz.minBetAmt}M
                    </h3>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <h6 className="text-grey text-xs">Max Bet</h6>
                    <h3 className="text-primaryBlack text-sm">
                      {quiz.maxBetAmt}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YourQuizzes;
