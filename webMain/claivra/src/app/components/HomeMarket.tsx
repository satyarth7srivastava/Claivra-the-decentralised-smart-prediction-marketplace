"use client";

import { useState, useEffect } from "react";
import HomeCard from "./HomeCard";
import axios from "axios";

interface HomeMarketProps {
  query: string;
}

const HomeMarket: React.FC<HomeMarketProps> = ({ query }) => {
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [visibleCount, setVisibleCount] = useState(4);
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    const updateCardsPerRow = () => {
      let newCardsPerRow = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      setCardsPerRow(newCardsPerRow);
      setVisibleCount(Math.max(4, newCardsPerRow * 2));
    };

    const fetchPredictions = async () => {
      try {
        const response = await axios.get("/api/quizes/getAllApprovedQuizes");
        const quizzes = response.data;

        const quizzesWithImages = await Promise.all(
          quizzes.map(async (quiz: any) => {
            try {
              const imageResponse = await axios.get(
                `https://api.unsplash.com/search/photos`,
                {
                  params: {
                    query: quiz.quizName,
                    page: 1,
                    per_page: 1,
                    orientation: "squarish",
                  },
                  headers: {
                    Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
                  },
                }
              );

              const imageUrl = imageResponse.data.results[0]?.urls?.small ?? "/default.jpg";
              return { ...quiz, imageUrl };
            } catch {
              return { ...quiz, imageUrl: "/default.jpg" };
            }
          })
        );

        setPredictions(quizzesWithImages);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    updateCardsPerRow();
    fetchPredictions();
    window.addEventListener("resize", updateCardsPerRow);
    return () => window.removeEventListener("resize", updateCardsPerRow);
  }, []);

  const filtered = predictions.filter((quiz) =>
    quiz.quizName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-row flex-wrap justify-center md:justify-around mx-10">
        {filtered.slice(0, visibleCount).map((prediction, index) => (
          <div key={index} className="my-4">
            <HomeCard {...prediction} />
          </div>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-16">
          <button onClick={() => setVisibleCount(visibleCount + cardsPerRow * 2)} className="px-6 py-2 bg-primaryBlue text-primaryWhite rounded-md">
            Show More
          </button>
        </div>
      )}

      {visibleCount >= filtered.length && predictions.length > 4 && (
        <div className="flex justify-center mt-16">
          <button onClick={() => setVisibleCount(Math.max(4, visibleCount - cardsPerRow * 2))} className="px-6 py-2 bg-primaryBlue text-primaryWhite rounded-md">
            Show Less
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeMarket;
