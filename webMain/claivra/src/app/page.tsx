"use client";

import { useState, useEffect } from "react";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import GetInTouch from "./components/GetInTouch";
import HomeMarket from "./components/HomeMarket";
import Navbar from "./components/Navbar";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-[#f6f6e6]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primaryBlue border-opacity-50" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      {/* Navbar and Hero Section */}
      <div className="h-full w-full bg-[#f6f6e6]">
        <Navbar />
        <div className="relative h-[80vh] w-full">
          <img src="element.png" className="h-full w-full object-contain" />
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <div className="text-center max-w-6xl px-6">
              <h1 className="text-3xl font-bold text-primaryBlue">
                Smart Predictions, Limitless Possibilities.
              </h1>
              <p className="mt-6 text-lg text-[#565656] leading-snug">
                Clairva is a decentralized smart prediction marketplace that empowers users with accurate forecasts and insights.
                Harness the power of blockchain and innovation to explore limitless possibilities.
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-2 font-light text-primaryWhite bg-primaryBlue rounded-full mt-10">
              Discover Now <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="w-full">
        <div className="flex flex-col justify-center px-4 mt-16 mb-10">
          <input 
            type="text" 
            placeholder="Search Markets" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="drop-shadow-md bg-[#f8f8f8] placeholder-secBlack px-5 rounded-md border border-opacity-60 border-secBlack mx-16 h-12"
          />
        </div>

        <HomeMarket query={query} />
      </div>

      <ContactUs />
      <GetInTouch />
      <Footer />
    </div>
  );
}
