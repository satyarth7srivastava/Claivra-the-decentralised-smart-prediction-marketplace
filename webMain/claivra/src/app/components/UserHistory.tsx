"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type QuizTicket = {
  quizID: string;
  quizName: string;
  option: string;
  betAmount: number;
  winAmount: number;
  createdAt: string;
  isWithdrawn: boolean;
};

export default function UserHistory() {
  const [data, setData] = useState<QuizTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchTicketsAndImages() {
      try {
        const userRes = await fetch("/api/users/getUser", { method: "GET" });
        const userData = await userRes.json();
        const email = userData.data.email;

        const ticketsRes = await fetch("/api/tickets/getTicket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const tickets = await ticketsRes.json();
        setData(tickets);

        // Fetch images for each quiz
        const imageMap: Record<string, string> = {};

        await Promise.all(
          tickets.map(async (ticket: QuizTicket) => {
            try {
              const res = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(ticket.quizName)}&orientation=squarish&per_page=1`,
                {
                  headers: {
                    Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
                  },
                }
              );
              const imgData = await res.json();
              if (imgData.results?.[0]?.urls?.small) {
                imageMap[ticket.quizName] = imgData.results[0].urls.small;
              }
            } catch (err) {
              console.error("Image fetch failed for:", ticket.quizName, err);
            }
          })
        );

        setImages(imageMap);
      } catch (err) {
        console.error("Error fetching user tickets:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTicketsAndImages();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!data.length)
    return (
      <div className="p-4 text-center text-gray-600 font-medium">
        No participation history found.
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-300 w-full px-2 mb-10">
      <h1 className="font-semibold text-xl text-gray-800 px-6 pt-8 pb-2">
        Activity
      </h1>
      <table className="min-w-full table-auto text-sm">
        <thead className="text-gray-500 text-xs">
          <tr>
            <th className="font-light px-6 pt-6 pb-1 text-left">Quiz Name</th>
            <th className="font-light px-6 pt-6 pb-1 text-center">Bet Option</th>
            <th className="font-light px-6 pt-6 pb-1 text-center">Bet Amount</th>
            <th className="font-light px-6 pt-6 pb-1 text-center">Win Amount</th>
            <th className="font-light px-6 pt-6 pb-1 text-center">Withdrawn</th>
            <th className="font-light px-6 pt-6 pb-1 text-center">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800">
          {data.map((item, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4 font-medium text-left flex items-center gap-3">
                <Link href={`/event/${item.quizID}`} className="flex items-center gap-3">
                  <img
                    src={images[item.quizName] || "/fallback.png"}
                    alt="quiz"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="">{item.quizName}</span>
                </Link>
              </td>
              <td className="px-6 py-4 text-center">{item.option}</td>
              <td className="px-6 py-4 text-center">${item.betAmount}</td>
              <td className="px-6 py-4 text-center">${item.winAmount}</td>
              <td className="px-6 py-4 text-center">
                {item.isWithdrawn ? "Yes" : "No"}
              </td>
              <td className="px-6 py-4 text-center">
                {new Date(item.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
