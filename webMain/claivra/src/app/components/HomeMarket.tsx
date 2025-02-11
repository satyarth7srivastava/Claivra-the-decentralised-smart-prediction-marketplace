"use client"
import { useState, useEffect } from "react";
import {predictions} from "../lib/data.js";
import HomeCard from "./HomeCard";

const HomeMarket : React.FC = () => {
    const [cardsPerRow, setCardsPerRow] = useState(3);
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const updateCardsPerRow = () => {
            let newCardsPerRow = 3;
            if (window.innerWidth >= 1024) {
                newCardsPerRow = 3;
            } else if (window.innerWidth >= 768) {
                newCardsPerRow = 2;
            } else {
                newCardsPerRow = 1;
            }
            setCardsPerRow(newCardsPerRow);
            setVisibleCount(Math.max(4, newCardsPerRow * 2));
        };

        updateCardsPerRow();
        window.addEventListener("resize", updateCardsPerRow);
        return () => window.removeEventListener("resize", updateCardsPerRow);
    }, []);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + cardsPerRow * 2);
    };

    const handleShowLess = () => {
        setVisibleCount((prev) => Math.max(4, prev - cardsPerRow * 2));
    };

    return(
        <div>
            <div className=" flex flex-row flex-wrap justify-center md:justify-around mx-10">
                {predictions.slice(0, visibleCount).map((prediction, index) => (
                    <div key={index} className="my-4">
                        <HomeCard {...prediction}/>
                    </div>
                ))}
            </div>

            {visibleCount < predictions.length && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleShowMore}
                        className="px-6 py-2 bg-primaryBlue text-primaryWhite rounded-md transition"
                    >
                        Show More
                    </button>
                </div>
            )}

            {visibleCount == predictions.length && (
                    <div className="flex justify-center mt-4">
                    <button
                        onClick={handleShowLess}
                        className="px-6 py-2 bg-primaryBlue text-primaryWhite rounded-md transition"
                    >
                        Show Less
                    </button>
                    </div>
                )}

        </div>
    )
}

export default HomeMarket;

