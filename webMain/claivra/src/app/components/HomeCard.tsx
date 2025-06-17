"use client";
import axios from "axios";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PredictionOption {
  optionID: number;
  optionText: string;
  totalBet?: number;
}

interface Prediction {
  _id: string;
  quizID: string;
  quizName: string;
  quizDescription: string;
  minBetAmt: string;
  maxBetAmt: string;
  quizOptions: PredictionOption[];
  owner: string;
  createdAt: string;
  approvalStatus: "approved" | "pending" | "rejected";
  imageUrl?: string;
}

export default function HomeCard({
  quizID,
  quizName,
  minBetAmt,
  maxBetAmt,
  quizOptions,
  imageUrl,
}: Prediction) {
  const router = useRouter();
  const [star, setStar] = useState(false);
   
  useEffect(() => {
    const checkFavourite = async() => {
      try {
        const res = await axios.get("api/users/getUser");
        const favourites : string[] = res.data?.data?.favourites || [];
        setStar(favourites.includes(quizID));
      }catch(error){
        console.log("Failed to fetch user favourites :" + error);
      }
    };

    checkFavourite();
  }, [quizID]);

  const toggleFavourite = async () => {
    try {
      const res = await axios.post("/api/users/setFavourite", { quizID });
      if (res.data?.updated) {
        setStar(res.data.isFavourite);
      }
    } catch (err) {
      console.error("Failed to toggle favourite:", err);
    }
  };

  const totalBet = quizOptions.reduce(
    (sum, option) => sum + (option.totalBet ?? 0),
    0
  );

  const handleOnClick = () => {
    router.push(`/event/${quizID}`);
  };

  return (
    <div
      className="m-4 max-w-sm flex flex-col justify-center rounded-md cursor-pointer"
      style={{ boxShadow: "0px 3px 3px 0px rgb(86,86,86, 0.5)" }}
      onClick={handleOnClick}
    >
      <div className="px-6 flex gap-8 justify-start pt-5 pb-10 items-center">
        <img
          src={imageUrl || "/default.jpg"}
          alt={quizName}
          width={68}
          className="rounded-full"
        />
        <h1 className="text-secBlack max-w-64 text-base">{quizName}</h1>
      </div>

      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mx-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavourite();
            }}
            className="transition-all duration-300"
          >
            <Star
              size={24}
              strokeWidth={1.7}
              className={
                star
                  ? "text-yellow-400 fill-yellow-400 opacity-80"
                  : "text-grey"
              }
            />
          </button>

          <div className="flex flex-col items-start gap-1">
            <h6 className="text-grey text-xs">Total Bet</h6>
            <h3 className="text-primaryBlack text-sm">${totalBet}</h3>
          </div>

          <div className="flex flex-col items-start gap-1">
            <h6 className="text-grey text-xs">Min Bet</h6>
            <h3 className="text-primaryBlack text-sm">${minBetAmt}</h3>
          </div>

          <div className="flex flex-col items-start gap-1">
            <h6 className="text-grey text-xs">Max Bet</h6>
            <h3 className="text-primaryBlack text-sm">{maxBetAmt}</h3>
          </div>

          <div className="mb-5">
            <div className="h-8 w-16 rounded-t-full border-t-4 border-l-4 border-r-4 border-[#4BA15F]">
              <div className="flex flex-col items-center pt-2">
                <h1 className="text-sm">65%</h1>
                <h1 className="text-xs text-grey">chance</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
