import { IoBarChartSharp } from "react-icons/io5";

export default function UserCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      <div className="flex flex-col border border-slate-300 py-6 pl-4 pr-12 rounded-xl gap-1">
        <IoBarChartSharp className="text-xl mb-3 text-gray-600" />
        <h1 className="text-xs text-gray-600">Volume Traded</h1>
        <h1 className="font-semibold text-xl text-gray-800">$23,23,233</h1>
      </div>

      <div className="flex flex-col border border-slate-300 py-6 pl-4 pr-12 rounded-xl gap-1">
        <IoBarChartSharp className="text-xl mb-3 text-gray-600" />
        <h1 className="text-xs text-gray-600">Markets Traded</h1>
        <h1 className="font-semibold text-xl text-gray-800">2,202</h1>
      </div>

      <div className="flex flex-col border border-slate-300 py-6 pl-4 pr-12 rounded-xl gap-1">
        <IoBarChartSharp className="text-xl mb-3 text-gray-600" />
        <h1 className="text-xs text-gray-600">Total Profit</h1>
        <h1 className="font-semibold text-xl text-gray-800">$23,230</h1>
      </div>
    </div>
  );
}
