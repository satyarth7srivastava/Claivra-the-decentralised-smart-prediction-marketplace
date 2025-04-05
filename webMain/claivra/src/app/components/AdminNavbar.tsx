"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { signOut } from "next-auth/react";
import Sidebar from "../components/Sidebar";

const AdminNavbar = ({ children }: { children: React.ReactNode }) => {
  const handleLogout = async () => {
    try {
      await signOut();
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 z-10 fixed w-full">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="border-gray-500 border-b flex justify-between items-center px-6 py-4">
          <img
            src="/logo-light.png"
            className="object-scale-down"
            height={16}
            width={120}
            alt="Logo"
          />

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar>
                <AvatarImage src="" alt="User Avatar" />
                <AvatarFallback className="text-black">MG</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button onClick={handleLogout}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Injected Page Content */}
        <div className="flex">
            <Sidebar/>
            <div className="h-full w-[0.4px] bg-gray-500"></div>
            <main className="p-6 text-white overflow-y-auto flex-1 h-full">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
