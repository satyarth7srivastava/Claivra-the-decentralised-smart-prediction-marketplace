"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useEffect } from "react"

interface User {
  _id: string
  email: string
  fullName : string
  username: string
  role: string
  walletID: string
}

interface UserTableProps {
  users: User[]
  onLogout?: (userId: string) => void
}

export function UserTable({ users = [], onLogout }: UserTableProps) {

  useEffect(() => {
    const shouldScroll = localStorage.getItem("scrollToUsersTable");
    if (shouldScroll) {
      const el = document.getElementById("usersTable");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      localStorage.removeItem("scrollToUsersTable"); 
    }
  }, []);


  const handleLogout = async (userId: string) => {
    try{
      const res = await axios.delete(`/api/users/deleteUser?id=${userId}`);
      if (res.status !== 200) throw new Error("Logout failed");
      localStorage.setItem("scrollToUsersTable", "true");
      window.location.reload();
      toast.success("User logged out");
    } catch (error) {
      toast.error("Failed to logout user");
    }
  };

  return (
    <div className="w-full overflow-auto" id="usersTable">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">User ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead className="hidden md:table-cell">Username</TableHead>
            <TableHead className="hidden md:table-cell">Role</TableHead>
            <TableHead className="hidden lg:table-cell">Wallet ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user._id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell className="hidden md:table-cell">{user.username}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell font-mono text-xs">{user.walletID}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleLogout(user._id)} className="h-8 w-8 p-0">
                    <span className="sr-only">Log out {user.username}</span>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
