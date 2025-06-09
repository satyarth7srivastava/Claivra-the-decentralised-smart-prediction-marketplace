"use client"
import quizImage from "@/../public/trump.png";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserInfo() {

    const [user, setUser] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    
    useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/getUser", { withCredentials: true });
        setUser(res.data.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

    const handleCopy = () => {
    if (user?.walletID) {
      navigator.clipboard.writeText(user.walletID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Hide "Copied!" after 1.5s
    }
  };


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
            {user?.username || ""}
          </h2>
          <div className="relative group flex justify-center">
            <button
              onClick={handleCopy}
              className="text-primaryWhite text-xs bg-primaryBlue rounded-xl px-2 py-1 hover:bg-grey"
            >
              {user?.walletID?.slice(0, 6)}.....{user?.walletID?.slice(-4) || ""}
            </button>
            <div className="absolute bottom-[110%] z-10 px-2 py-1 rounded bg-primaryBlack text-primaryWhite text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {copied ? "Copied!" : "Copy ID"}
            </div>
          </div>
        </div>
        <div>
          <div className="border border-slate-300 mt-6 w-full bg-[#eaeaea] py-[6px] px-4 rounded-lg text-[#767676]">
            <div className="text-xs ">Name</div>
            <div className="text-sm font-semibold ">{user?.fullName || ""}</div>
          </div>
          <div className="border border-slate-300 my-4 w-full bg-[#eaeaea] py-[6px] px-4 rounded-lg text-[#767676]">
            <div className="text-xs ">Email</div>
            <div className="text-sm font-semibold ">
              {user?.email || ""}
            </div>
          </div>
          <div className="border border-slate-300 my-4 w-full bg-[#eaeaea] py-[6px] px-4 rounded-lg text-[#767676]">
            <div className="text-xs ">Role</div>
            <div className="text-sm font-semibold ">{user?.role || ""}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
