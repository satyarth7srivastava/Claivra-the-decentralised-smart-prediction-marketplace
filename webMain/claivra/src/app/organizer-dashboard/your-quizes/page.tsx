"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Quiz {
  id: string;
  question: string;
  starred: boolean;
  comments: number;
  dollar: number;
  rewards: number;
  chance: number;
  image: string;
}

const YourQuizzes = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      question: "Will the stock market rise tomorrow?",
      starred: true,
      comments: 12,
      dollar: 1.5,
      rewards: 100,
      chance: 75,
      image: "/quiz1.png",
    },
    {
      id: "2",
      question: "Will it rain in New York this weekend?",
      starred: false,
      comments: 8,
      dollar: 0.8,
      rewards: 50,
      chance: 60,
      image: "/quiz2.png",
    },
    // Add more quizzes as needed
  ]);

  const handleQuizClick = (id: string) => {
    router.push(`/quiz/${id}`);
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
              key={quiz.id}
              className="m-4 max-w-sm flex flex-col justify-center rounded-md cursor-pointer"
              style={{ boxShadow: "0px 3px 3px 0px rgb(86,86,86, 0.5)" }}
              onClick={() => handleQuizClick(quiz.id)}
            >
              <div className="px-6 flex gap-8 justify-start pt-5 pb-10 items-center">
                <img
                  src={quiz.image}
                  alt="quiz image"
                  width={68}
                  className="rounded-full"
                />
                <h1 className="text-secBlack max-w-64 text-base">
                  {quiz.question}
                </h1>
              </div>
              <div className="px-4 pb-4">
                <div className="flex justify-between items-center">
                  <button className="transition-all duration-300">
                  </button>

                  <div className="flex flex-col items-start gap-1">
                    <h6 className="text-grey text-xs">Volume</h6>
                    <h3 className="text-primaryBlack text-sm">
                      ${quiz.dollar}M
                    </h3>
                  </div>

                  <div className="flex flex-col items-start gap-1">
                    <h6 className="text-grey text-xs">Comment</h6>
                    <h3 className="text-primaryBlack text-sm">
                      {quiz.comments}
                    </h3>
                  </div>

                  <div className="flex flex-col items-start gap-1">
                    <h6 className="text-grey text-xs">Rewards</h6>
                    <h3 className="text-primaryBlack text-sm">
                      {quiz.rewards}
                    </h3>
                  </div>

                  <div className="mb-5">
                    <div className="h-8 w-16 rounded-t-full border-t-4 border-l-4 border-r-4 border-[#4BA15F]">
                      <div className="flex flex-col items-center pt-2">
                        <h1 className="text-sm">{quiz.chance}%</h1>
                        <h1 className="text-xs text-grey">chance</h1>
                      </div>
                    </div>
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
