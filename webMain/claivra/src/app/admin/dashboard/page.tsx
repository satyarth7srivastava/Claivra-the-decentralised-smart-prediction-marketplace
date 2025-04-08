"use client";

import AllPredictionsTable from "@/app/components/AllPredictionsTable";
import DashboardCard from "@/app/components/DashboardCard";
import LineChartComponent from "@/app/components/LineChartComponent";
import { PredictionTable } from "@/app/components/PredictionTable";
import { UserTable } from "@/app/components/UserTable";

// Sample user data
const users = [
  {
    userId: "u123",
    email: "john@example.com",
    fullName: "John Doe",
    username: "johnny",
    role: "user",
    walletId: "wallet_abc123",
  },
  {
    userId: "u124",
    email: "sarah@example.com",
    fullName: "Sarah Smith",
    username: "sarahs",
    role: "user",
    walletId: "wallet_def456",
  },
  {
    userId: "u125",
    email: "mike@example.com",
    fullName: "Mike Johnson",
    username: "mikej",
    role: "user",
    walletId: "wallet_ghi789",
  },
  {
    userId: "u126",
    email: "lisa@example.com",
    fullName: "Lisa Brown",
    username: "lisab",
    role: "user",
    walletId: "wallet_jkl012",
  },
  {
    userId: "u127",
    email: "david@example.com",
    fullName: "David Wilson",
    username: "davidw",
    role: "user",
    walletId: "wallet_mno345",
  },
];

const admins = [
  {
    userId: "u123",
    email: "john@example.com",
    fullName: "John Doe",
    username: "johnny",
    role: "admin",
    walletId: "wallet_abc123",
  },
  {
    userId: "u124",
    email: "sarah@example.com",
    fullName: "Sarah Smith",
    username: "sarahs",
    role: "admin",
    walletId: "wallet_def456",
  },
  {
    userId: "u125",
    email: "mike@example.com",
    fullName: "Mike Johnson",
    username: "mikej",
    role: "admin",
    walletId: "wallet_ghi789",
  },
  {
    userId: "u126",
    email: "lisa@example.com",
    fullName: "Lisa Brown",
    username: "lisab",
    role: "admin",
    walletId: "wallet_jkl012",
  },
  {
    userId: "u127",
    email: "david@example.com",
    fullName: "David Wilson",
    username: "davidw",
    role: "admin",
    walletId: "wallet_mno345",
  },
];

const predictions = [
  {
    id: "p101",
    title: "Bitcoin to hit $70K",
    userId: "u001",
    user: "Alice Johnson",
    date: "2025-04-08",
    time: "14:30",
    description: "With recent ETF approvals, Bitcoin could surge past $70,000.",
  },
  {
    id: "p102",
    title: "Ethereum gas fees to drop",
    userId: "u002",
    user: "Bob Smith",
    date: "2025-04-07",
    time: "11:15",
    description:
      "Upcoming updates to Ethereum's L2 should significantly reduce gas fees.",
  },
  {
    id: "p103",
    title: "Dogecoin back in top 10",
    userId: "u003",
    user: "Charlie Davis",
    date: "2025-04-06",
    time: "09:45",
    description: "With Elon Musk's recent support, DOGE could make a comeback.",
  },
  {
    id: "p104",
    title: "Solana to outperform ETH",
    userId: "u004",
    user: "Diana Patel",
    date: "2025-04-05",
    time: "16:00",
    description: "Solana’s throughput and recent adoption could push it ahead.",
  },
  {
    id: "p105",
    title: "Polygon will partner with Meta",
    userId: "u005",
    user: "Edward Lee",
    date: "2025-04-04",
    time: "18:10",
    description:
      "Speculation rises around a potential NFT integration with Meta.",
  },
  {
    id: "p106",
    title: "Cardano launches new update",
    userId: "u006",
    user: "Fiona Thomas",
    date: "2025-04-03",
    time: "08:50",
    description:
      "The Hydra protocol launch might significantly increase Cardano's scalability.",
  },
  {
    id: "p107",
    title: "XRP wins major lawsuit",
    userId: "u007",
    user: "George Martin",
    date: "2025-04-02",
    time: "12:20",
    description:
      "A favorable ruling in Ripple’s case could boost XRP's price by 30%.",
  },
  {
    id: "p108",
    title: "Litecoin to double in value",
    userId: "u008",
    user: "Hannah White",
    date: "2025-04-01",
    time: "19:40",
    description: "Historical halving patterns indicate a bullish run for LTC.",
  },
  {
    id: "p109",
    title: "Avalanche becomes top DeFi chain",
    userId: "u009",
    user: "Isaac Brown",
    date: "2025-03-31",
    time: "10:00",
    description: "AVAX shows promise with increasing TVL and ecosystem growth.",
  },
  {
    id: "p110",
    title: "Regulations to hit crypto hard",
    userId: "u010",
    user: "Julia Green",
    date: "2025-03-30",
    time: "15:25",
    description:
      "New global crypto regulations may cause short-term market corrections.",
  },
];

const AdminDashboard = () => {
  const handleLogout = (userId: string) => {
    console.log(
      `User with ID ${userId} has been logged out from the parent component`
    );
  };

  return (
    <div className="min-h-screen overflow-y-auto  p-4 space-y-6" id="top">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardCard title="Total users" value={991} />
        <DashboardCard title="Total predictions" value={1091} />
        <DashboardCard title="Total bets" value={1021} />
      </div>

      <LineChartComponent />

      <div className="container mx-auto py-10" id="user-management">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <UserTable users={users} onLogout={handleLogout} />
      </div>

      <div className="container mx-auto pt-6" id="admin-management">
        <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
        <UserTable users={admins} onLogout={handleLogout} />
      </div>

      <div className="container mx-auto pt-6" id="verify-prediction">
        <PredictionTable predictions={predictions} />
      </div>

      <div className="container mx-auto pt-6" id="all-predictions">
        <AllPredictionsTable predictions={predictions} />
      </div>
    </div>
  );
};

export default AdminDashboard;
