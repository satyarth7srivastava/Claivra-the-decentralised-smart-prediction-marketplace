import Navbar from "@/app/components/Navbar";
import UserCard from "@/app/components/UserCards";
import UserHistory from "@/app/components/UserHistory";
import UserInfo from "@/app/components/UserInfo";
import UserFavourites from "../components/UserFavourites";

export default function Buyer() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row px-4 md:px-8 lg:gap-x-10 xl:gap-x-16">
        <div className="py-6 md:py-10 lg:py-14 lg:pl-16 w-full lg:w-1/3 mt-1">
          <UserInfo />
        </div>
        <div className="flex flex-col w-full lg:w-2/3">
          <div className="py-6 md:py-12 lg:py-16">
            <UserCard />
          </div>
          <div>
            <UserHistory />
          </div>
          <div className="py-2 md:py-4 lg:py-8">
            <UserFavourites/> 
          </div>
        </div>
      </div>
    </div>
  );
}
