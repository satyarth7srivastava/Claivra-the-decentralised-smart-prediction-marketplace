"use client";
import { Copyright } from "lucide-react";
import { useState, useEffect } from "react";

const truncateText = (text: string, limit: number) => {
    const words = text.split(" ").slice(0, limit);
    let truncated = words.join(" ");

    if (!truncated.endsWith(".")) {
        truncated += ".";
    }

    return truncated;
};

const Footer: React.FC = () => {
    const description = "Clairva is a decentralized smart prediction marketplace that empowers users with accurate forecasts and insights. Harness the power of blockchain and innovation to explore limitless possibilities for the future.";

    const [wordLimit, setWordLimit] = useState<number>(description.split(" ").length);

    useEffect(() => {
        const updateWordLimit = () => {
            if (window.innerWidth < 410) {
                setWordLimit(7);
            } else if (window.innerWidth < 768) {
                setWordLimit(15);
            } else {
                setWordLimit(description.split(" ").length);
            }
        };

        updateWordLimit();
        window.addEventListener("resize", updateWordLimit);
        
        return () => window.removeEventListener("resize", updateWordLimit);
    }, []);

    return (
        <div className="bg-primaryBlue text-footer h-auto pt-10 pb-2 flex flex-col overflow-hidden mt-5">
            <div className="px-12">
                <img src="/logo-light.png" width={96} />
            </div>
            <div className="flex items-center justify-between w-full gap-16 mt-6 mb-10 px-12">
                <p className="text-sm md:text-sm w-[500px]">
                    {truncateText(description, wordLimit)}
                </p>
                <div className="flex gap-6 md:gap-32">
                    <div className="flex flex-col text-sm md:text-sm gap-2">
                        <a>Market</a>
                        <a>Politics</a>
                        <a>Sports</a>
                        <a>Bitcoin</a>
                        <a>India</a>
                    </div>
                    <div className="flex flex-col text-sm md:text-sm gap-2">
                        <a>Contact us</a>
                        <a>Marketplace</a>
                        <a>About</a>
                        <a>Create Prediction</a>
                        <a>T&C</a>
                    </div>
                </div>
            </div>
            <div className="border-t-2 border-footer w-[90%] md:w-[96%] mx-auto"></div>
            <h1 className="mx-12 flex gap-1 text-xs mt-6">
                Clairva <Copyright width={14} className="pb-[8px]" /> 2025
            </h1>
        </div>
    );
};

export default Footer;
