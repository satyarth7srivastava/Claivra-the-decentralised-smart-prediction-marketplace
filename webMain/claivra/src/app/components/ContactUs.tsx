"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

const ContactUs: React.FC = () => {
  return (
    <div className="flex flex-col justify-center bg-[#f6f6e6] items-center py-10 md:py-20 my-20 md:my-24">
      <h1 className="text-3xl font-bold text-primaryBlue mb-14">Contact Us</h1>
      <div className="w-full px-10 sm:px-16 md:px-28 flex flex-col md:flex-row gap-10">
        {/* Left side */}
        <div className="flex flex-col gap-32 w-full md:w-1/2">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-grey">Address</label>
              <h1 className="text-sm text-primaryBlack">
                Patna University Campus, Patna, Bihar 800005
              </h1>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-grey">Phone number</label>
              <h1 className="text-sm text-primaryBlack">+91 92582 69833</h1>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-grey">Email address</label>
              <h1 className="text-sm text-primaryBlack">prishagarg06@gmail.com</h1>
            </div>
          </div>
          {/* Icons */}
          <div className="flex gap-8 pl-1">
            <img src="/github.png" width={18} />
            <img src="/facebook.png" width={18} />
            <img src="/linkedin.png" width={18} />
            <img src="/twitter.png" width={18} />
          </div>
        </div>

        {/* Map */}
        <div className="w-full md:w-1/2 z-0"> 
          <Map />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;