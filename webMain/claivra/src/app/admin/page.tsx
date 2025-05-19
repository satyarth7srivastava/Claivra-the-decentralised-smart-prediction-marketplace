"use client";

import AllPredictionsTable from "@/app/components/AllPredictionsTable";
import DashboardCard from "@/app/components/DashboardCard";
import AdminProfit from "../components/AdminProfit";
import LineChartComponent from "@/app/components/LineChartComponent";
import { PredictionTable } from "@/app/components/PredictionTable";
import { UserTable } from "@/app/components/UserTable";
import { useState, useEffect } from "react";
import axios from "axios";


const AdminDashboard = () => {
  const [predictions, setPredictions] = useState([]);
  const [users, setUsers] =useState([]);
  const [admins, setAdmins] = useState([]);

  const handleLogout = (userId: string)  : any => {
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

  const fetchUsers = async () => {
    try { 
      const response = await axios.get("/api/users/getAllUsers");
      const fetchedUsers = response.data;

      const adminsList = fetchedUsers.filter((user : any) => user.role === "Admin");
      const usersList = fetchedUsers.filter((user:any) => user.role==="Buyer" || user.role === "Organizer");
      
      setAdmins(adminsList);
      setUsers(usersList);

    }catch(error){
      console.log("Error fetching data", error);
    }
  }

  fetchPredictions();
  fetchUsers();
}, []);

  const totalUsers = users.length + admins.length;
  const totalPredictions = predictions.length;
  const totalBets = 10;

  return (
    <div className="min-h-screen overflow-y-auto  p-4 space-y-6" id="top">
      <h1 className="text-3xl font-bold text-primaryBlue mb-6">Admin Dashboard</h1>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Admin Profit</h1>
        <AdminProfit />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardCard title="Total users" value={totalUsers} />
        <DashboardCard title="Total predictions" value={totalPredictions} />
        <DashboardCard title="Total bets" value={totalBets} />
      </div>

      {/* <LineChartComponent /> */}

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
