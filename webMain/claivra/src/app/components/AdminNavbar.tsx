"use client";

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
    <div className="h-screen flex flex-col bg-slate-950 text-white">
      {/* Top Navbar */}
      <nav className="w-full border-b border-gray-500 px-6 py-4 flex justify-between items-center bg-slate-950 sticky top-0 z-10">
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

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 h-0">
        {/* Sidebar (fixed height, no scroll) */}
        <aside className="w-[250px] border-r border-gray-500 bg-slate-950 hidden md:block overflow-hidden">
          <Sidebar />
        </aside>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminNavbar;
