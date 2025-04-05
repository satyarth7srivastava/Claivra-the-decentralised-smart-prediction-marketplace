"use client"

import DashboardCard from "@/app/components/DashboardCard";
import LineChartComponent from "@/app/components/LineChartComponent";
import { UserTable } from "@/app/components/UserTable";

// Sample user data
const users = [
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
    role: "user",
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
]

const AdminDashboard = () => {
  const handleLogout = (userId: string) => {
    console.log(`User with ID ${userId} has been logged out from the parent component`)
  }

  return (
    <div className="h-screen overflow-y-auto p-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardCard title="Total users" value={991} />
        <DashboardCard title="Total predictions" value={1091} />
        <DashboardCard title="Total bets" value={1021} />
      </div>

      <LineChartComponent />

      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <UserTable users={users} onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default AdminDashboard;
