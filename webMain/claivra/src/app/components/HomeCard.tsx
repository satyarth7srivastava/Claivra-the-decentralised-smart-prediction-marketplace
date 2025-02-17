"use client"
import { CalendarSearch, Star } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState } from 'react';

interface HomeCardProps {
    question : string;
    starred : boolean;
    comments : number;
    dollar : number;
    rewards : number;
    chance: number;
    image : string;
}

const HomeCard:React.FC<HomeCardProps>= ({question, starred, comments, dollar, rewards, chance, image}) => {
    const router = useRouter();
    const [star, setStar] = useState(starred);

    const handleOnClick = () => {
        router.push("/event");
    };

    return(
        <div className="m-4 max-w-sm flex flex-col justify-center rounded-md" style={{boxShadow :"0px 3px 3px 0px rgb(86,86,86, 0.5)"}} onClick={handleOnClick}>
            <div className=" px-6 flex gap-8 justify-start pt-5 pb-10 items-center">
                <img src={image} alt='image' width={68} className="rounded-full"></img>
                <h1 className="text-secBlack max-w-64 text-base">{question}</h1>
            </div>
            <div className='px-4 pb-4'>

                <div className='flex justify-between items-center'>
                    <button onClick={() => setStar(!star)} className='transition-all duration-300'>
                    <Star size={24} strokeWidth={1.7} className={star ? "text-yellow-400 fill-yellow-400 opacity-80" : "text-grey"} ></Star>
                    </button>

                    <div className='flex flex-col items-start gap-1'>
                        <h6 className='text-grey text-xs'>Volume</h6>
                        <h3 className='text-primaryBlack text-sm'>${dollar}M</h3>
                    </div>

                    <div className='flex flex-col items-satrt gap-1'>
                        <h6 className='text-grey text-xs'>Comment</h6>
                        <h3 className='text-primaryBlack text-sm'>{comments}</h3>
                    </div>

                    <div className='flex flex-col items-start gap-1'>
                        <h6 className='text-grey text-xs'>Rewards</h6>
                        <h3 className='text-primaryBlack text-sm'>{rewards}</h3>
                    </div>

                    <div className='mb-5'>
                        <div className='h-8 w-16 rounded-t-full border-t-4 border-l-4 border-r-4 border-[#4BA15F]'>
                        <div className='flex flex-col items-center pt-2'>
                        <h1 className='text-sm'>{chance}%</h1>
                        <h1 className='text-xs text-grey'>chance</h1>
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeCard;