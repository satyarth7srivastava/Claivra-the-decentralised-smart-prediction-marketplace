import { Minus, Plus, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Event : React.FC = () => {
    return(
        <div>
            <Navbar />
            <div className="flex gap-10">
                {/* Left div */}
                <div className="flex flex-col w-8/12 px-16 pt-6">
                    <div className="flex gap-8 justify-start pb-14 items-center">
                        <img src="trump.png" alt='image' width={80} className="rounded-full" />
                        <h1 className="text-secBlack text-2xl">Will Trump create Bitcoin reserve in first 100 days?</h1>
                        <Star width={40} height={30} strokeWidth={1.7} className="ml-28 text-grey" />
                    </div>
                    <div className="mx-12">
                        <img src="/graph.png" className="rounded-md" />
                        <div className="flex gap-4 w-full mb-20 mt-6">
                            <button className="bg-line1 text-primaryBlack w-1/2 py-2 rounded-md">Lower Bound</button>
                            <button className="bg-line1 text-primaryBlack w-1/2 py-2 rounded-md">Upper Bound</button>
                        </div>
                        <div className="flex gap-12 my-20">
                            <input type="text" placeholder="Market Summary" className="drop-shadow-md bg-[#f8f8f8] placeholder-primaryBlack px-4 rounded-md border border-opacity-60 border-secBlack w-full py-3 pointer-events-none" />
                            <button className="bg-primaryBlue text-primaryWhite py-3 px-8 rounded-md">Generate</button>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-primaryBlue text-3xl font-bold">Rules</h1>
                                <div className="border border-t-line1 w-full mt-2 "></div>
                            </div>
                            <div className="flex flex-col gap-3 mt-4 mb-32">
                                <span>This market will resolve to “Yes” if active regular US military personnel physically enter Gaza at any point between February 4, 2025, and June 30, 2025, 11:59 PM ET.</span>
                                <span>US military personnel must physically enter the terrestrial territory of the Gaza Strip to qualify. Entering the maritime territory as occurred during the US’s attempt to construct a floating pier in 2024, or entering the airspace will not qualify.</span>
                                <span>US military personnel entering buffer zones under control of Israel will not qualify.</span>
                                <span>High ranking U.S. service members entering Gaza for diplomatic purposes (and their accompanying entourage), military contractors, military advisors, and special operation forces will not qualify.</span>
                                <span>The resolution source will be a consensus of credible reporting.</span>
                            </div>

                        </div>
                    </div>

                </div>
                {/* Right div */}
                <div className="flex flex-col gap-4 my-20 rounded-xl py-10 px-6 bg-line1 h-[615px]">
                    <div className="flex w-full mb-6">
                        <button className="bg-green w-1/2 text-primaryWhite px-16 rounded-l-md ">Buy</button>
                        <button className="text-line2 border w-1/2 border-grey px-16 border-1 rounded-r-md">Sell</button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-line2 ">Amount</label>
                        <input className="py-1.5 bg-primaryWhite pointer-events-none px-4 rounded-sm"></input>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-line2 ">To win</label>
                        <input className="py-1.5 bg-primaryWhite pointer-events-none px-4 rounded-sm"></input>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                        <label className="text-sm text-line2 ">Shares</label>
                        <div className="flex gap-1">
                            <Plus className="text-line2" width={12} strokeWidth={1.7}/>
                            <button className="text-xs text-line2 border-2 border-line2 rounded-lg px-1 border-opacity-60">1%</button>
                            <Minus className="text-line2" width={12} strokeWidth={1.7}/>
                        </div>
                        </div>
                        <input className="py-1.5 bg-primaryWhite pointer-events-none px-4 rounded-sm"></input>
                    </div>

                    <div className="flex flex-col gap-2 text-line2 mt-10 text-sm">
                        <div className="flex justify-between">
                            <h1>Your avg. price </h1>
                            <h1>$2000</h1>
                        </div>

                        <div className="flex justify-between">
                            <h1>Estimated shares bought </h1>
                            <h1>$2000</h1>
                        </div>

                        <div className="flex justify-between">
                            <h1>Maximum return </h1>
                            <h1>$2000</h1>
                        </div>

                        <div className="flex justify-between">
                            <h1>Maximum winning</h1>
                            <h1>$2000</h1>
                        </div>
                    </div>

                    <button className="bg-primaryBlue text-primaryWhite py-2.5 px-8 rounded-md my-8">Buy Now</button>

                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Event;
