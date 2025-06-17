"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface FavouriteQuiz {
  _id: string;
  quizID: string;
  quizName: string;
  quizDescription: string;
  minBetAmt: number;
  maxBetAmt: number;
  quizOptions: string[];
  approvalStatus: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export default function UserFavourites() {
  const [favourites, setFavourites] = useState<FavouriteQuiz[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFavourites() {
      try {
        const userRes = await axios.get("/api/users/getUser");
        const favIDs: string[] = userRes.data.data.favourites;

        const quizzesRes = await axios.get("/api/quizes/getAllQuizes");
        const allQuizzes: FavouriteQuiz[] = quizzesRes.data;

        const matched = allQuizzes.filter((q: FavouriteQuiz) =>
          favIDs.includes(q.quizID)
        );
        setFavourites(matched);

        // Fetch Unsplash images
        const imageMap: Record<string, string> = {};

        await Promise.all(
          matched.map(async (quiz: FavouriteQuiz) => {
            try {
              const imgRes = await axios.get(
                `https://api.unsplash.com/search/photos`,
                {
                  params: {
                    query: quiz.quizName,
                    orientation: "squarish",
                    per_page: 1,
                  },
                  headers: {
                    Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
                  },
                }
              );
              const result = imgRes.data.results?.[0]?.urls?.small;
              if (result) {
                imageMap[quiz.quizName] = result;
              }
            } catch (err) {
              console.error("Image fetch failed:", quiz.quizName, err);
            }
          })
        );

        setImages(imageMap);
      } catch (err) {
        console.error("Failed to fetch favourites:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavourites();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!favourites.length)
    return (
      <div className="p-4 text-center text-gray-600 font-medium">
        No favourites found.
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 w-full px-2 mb-10">
      <h1 className="font-semibold text-xl text-gray-800 px-6 pt-8 pb-2">
        Your Favourites
      </h1>
      <table className="min-w-full table-auto text-sm">
        <thead className="text-gray-500 text-xs">
          <tr>
            <th className="font-light px-6 pt-6 pb-1 text-left">Quiz Name</th>
            <th className="font-light px-6 pt-6 pb-1 text-left">Description</th>
            <th className="font-light px-6 pt-6 pb-1 text-center">Min Bet</th>
            <th className="font-light px-6 pt-6 pb-1 text-center">Max Bet</th>
            <th className="font-light px-6 pt-6 pb-1 text-center">Created On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800">
          {favourites.map((quiz, idx) => (
            <tr
              key={idx}
              onClick={() => router.push(`/event/${quiz.quizID}`)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 font-medium text-left flex items-center gap-3">
                <img
                  src={images[quiz.quizName] || "/fallback.png"}
                  alt="quiz"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>{quiz.quizName}</span>
              </td>
              <td className="px-6 py-4 text-left">{quiz.quizDescription}</td>
              <td className="px-6 py-4 text-center">${quiz.minBetAmt}</td>
              <td className="px-6 py-4 text-center">${quiz.maxBetAmt}</td>
              <td className="px-6 py-4 text-center">
                {new Date(quiz.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
