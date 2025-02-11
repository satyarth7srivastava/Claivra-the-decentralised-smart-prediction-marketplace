import Footer from "./components/Footer";
import HomeMarket from "./components/HomeMarket";
import Navbar from "./components/Navbar";
import { ArrowRight, Star } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-full">
      {/* Navbar and Hero Section */}
      <div className="h-full w-full bg-[#f6f6e6]">
        <Navbar />

        {/* Background Image with Centered Text */}
        <div className="relative h-[80vh] w-full">
          <img src="element.png" className="h-full w-full object-contain" />

          {/* Centered Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <div className="text-center max-w-6xl px-6">
              <h1 className="text-3xl font-bold text-primaryBlue">
                Smart Predictions, Limitless Possibilities.
              </h1>
              <p className="mt-6 text-lg text-[#565656] leading-snug ">
                Clairva is a decentralized smart prediction marketplace that empowers users with accurate forecasts and insights.
                Harness the power of blockchain and innovation to explore limitless possibilities.
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-2 font-light text-primaryWhite bg-primaryBlue rounded-full mt-10 ">Discover Now <ArrowRight size={20}></ArrowRight></button>
          </div>
        </div>
      </div>

      {/* Body Section */}
    <div className="w-full">
    <div className="flex flex-col justify-center px-4 mt-16 mb-10">
    <input 
      type="text" 
      placeholder="Search Markets" 
      className="drop-shadow-md bg-[#f8f8f8] placeholder-secBlack px-5 rounded-md border border-opacity-60 border-secBlack mx-16 h-14 pointer-events-none"
    />
    <div className=" mx-28  mt-6 h-14 flex gap-44">
      <div className="flex flex-row gap-2 justify-start items-center">
        <h6 className="text-secBlack">Category: </h6>
        <button className="flex flex-row text-primaryBlue ">All <ChevronDown className="text-primaryBlue"></ChevronDown></button>
      </div>

      <div className="flex flex-row gap-2 justify-start items-center">
        <h6 className="text-secBlack">Sort by: </h6>
        <button className="flex flex-row text-primaryBlue ">Latest <ChevronDown className="text-primaryBlue"></ChevronDown></button>
      </div>

      <div className="flex flex-row gap-2 justify-start items-center">
      <button><Star size={24} strokeWidth={1.7} className ="text-grey"></Star></button>
        <h6 className="text-secBlack">Show favourite </h6>
      </div>
    </div>
  </div>
  <HomeMarket/>
</div>


      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
