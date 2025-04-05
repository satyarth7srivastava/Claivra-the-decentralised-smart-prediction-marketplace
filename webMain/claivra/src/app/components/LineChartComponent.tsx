"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 600 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 800 },
  { name: "May", value: 300 },
];

const LineChartComponent = () => {
  return (
    <div className="w-full h-80 p-4 mt-6 border border-gray-600 rounded-xl flex flex-col">
      <h1 className="text-lg font-bold text-white mb-4">Monthly Statistics</h1>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00FF9D"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;
