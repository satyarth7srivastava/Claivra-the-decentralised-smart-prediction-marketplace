const GetInTouch : React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center my-20 md:my-24">
            <h1 className="text-3xl font-bold text-primaryBlue">Get in Touch</h1>
            <div className="flex w-full mt-20 px-10 sm:px-16 md:px-28 gap-6 md:gap-28"> 
                <input placeholder="Your Name" className="w-1/2 bg-[#f8f8f8] placeholder-grey text-sm sm:text-base px-4 rounded-md border border-opacity-60 border-grey h-12 pointer-events-none"></input>
                <input placeholder="Email address" className="w-1/2 bg-[#f8f8f8] text-sm sm:text-base placeholder-grey px-4 rounded-md border border-opacity-60 border-grey h-12 pointer-events-none"></input>
            </div>
            <div className="flex w-full mt-10 px-10 sm:px-16 md:px-28 gap-6 md:gap-28"> 
                <input placeholder="Mobile Number" className="w-1/2 bg-[#f8f8f8] text-sm sm:text-base placeholder-grey px-4 rounded-md border border-opacity-60 border-grey h-12 pointer-events-none"></input>
                <input placeholder="Topic" className="w-1/2 bg-[#f8f8f8] placeholder-grey text-sm sm:text-base px-4 rounded-md border border-opacity-60 border-grey h-12 pointer-events-none"></input>
            </div>
            <div className="relative flex w-full sm:px-16 mt-10 px-10 md:px-28 ">
                <label className="absolute top-3 left-14 sm:left-20 md:top-2 md:left-32 text-sm sm:text-base text-grey">Message</label>
                <input className="w-full bg-[#f8f8f8] placeholder-grey px-4 rounded-md border text-sm sm:text-base border-opacity-60 border-grey h-24 pointer-events-none"></input>
            </div>
            <div className="flex justify-center mt-16">
                    <button className="px-6 py-2 bg-primaryBlue text-primaryWhite rounded-md transition">Send Request</button>
            </div>
        </div>
    )
}

export default GetInTouch;