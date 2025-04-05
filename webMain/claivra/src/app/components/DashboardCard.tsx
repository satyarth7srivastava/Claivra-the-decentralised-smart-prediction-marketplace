
const DashboardCard = ({ title, value }: any) => {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-4 border border-gray-600 px-6 py-6 sm:py-8 rounded-xl">
          <h1 className="text-xs sm:text-sm text-gray-400">{title}</h1>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{value}</h1>
        </div>
      </div>
    );
  };
  
  export default DashboardCard;
  