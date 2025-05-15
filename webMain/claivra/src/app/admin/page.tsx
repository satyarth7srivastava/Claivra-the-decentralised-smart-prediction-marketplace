"use client";

import AllPredictionsTable from "@/app/components/AllPredictionsTable";
import DashboardCard from "@/app/components/DashboardCard";
import LineChartComponent from "@/app/components/LineChartComponent";
import { PredictionTable } from "@/app/components/PredictionTable";
import { UserTable } from "@/app/components/UserTable";
import { useState, useEffect } from "react";
import axios from "axios";


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

const AdminDashboard = () => {
  const [predictions, setPredictions] = useState([]);

  const handleLogout = (userId: string) => {
    console.log(
      `User with ID ${userId} has been logged out from the parent component`
    );
  };

  useEffect(() => {
  const fetchPredictions = async () => {
    try {
      const response = await axios.get("/api/quizes/getAllQuizes");
      setPredictions(response.data);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  fetchPredictions();
}, []);


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
