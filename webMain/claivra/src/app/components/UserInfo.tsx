import quizImage from "@/../public/trump.png";

export default function UserInfo() {
  return (
    <div className="border border-slate-300 py-6 px-4 rounded-3xl w-full">
      <div>
        <div className="h-auto px-4 md:px-20 pb-4 flex flex-col justify-center items-center gap-1">
          <img
            src={quizImage.src}
            alt="event"
            width={65}
            className="rounded-full my-4"
          />
          <h2 className="font-semibold text-lg text-[#383838]">
            manyagupta1212736
          </h2>
          <div className="relative group flex justify-center">
            <button className="text-primaryWhite text-xs bg-primaryBlue rounded-xl px-2 py-1 hover:bg-grey">
              0x236.....6c99
            </button>
            <div className="absolute bottom-[110%] z-10 px-2 py-1 rounded bg-primaryBlack text-primaryWhite text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Copy ID
            </div>
          </div>
        </div>
        <div>
          <div className="border border-slate-300 mt-6 w-full bg-[#eaeaea] py-[6px] px-4 rounded-lg text-[#767676]">
            <div className="text-xs ">Name</div>
            <div className="text-sm font-semibold ">Manya Gupta</div>
          </div>
          <div className="border border-slate-300 my-4 w-full bg-[#eaeaea] py-[6px] px-4 rounded-lg text-[#767676]">
            <div className="text-xs ">Email</div>
            <div className="text-sm font-semibold ">
              manyagupta.123@gmail.com
            </div>
          </div>
          <div className="border border-slate-300 my-4 w-full bg-[#eaeaea] py-[6px] px-4 rounded-lg text-[#767676]">
            <div className="text-xs ">Role</div>
            <div className="text-sm font-semibold ">Buyer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
