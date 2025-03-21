"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signOut } from "next-auth/react";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get("/api/auth/check-auth");
          setIsAuthenticated(response.data.isAuthenticated);
        } catch (error) {
          console.error("Error checking auth:", error);
        } finally {
          setIsLoading(false);
        }
      };
      checkAuth();
    }, []);

    const handleLogout = async () => {
      signOut();
      await axios.post("/api/auth/logout");
      setIsAuthenticated(false);
    };

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
        <nav className=" border-[#6f6f6b] border-b ">
            <div className="flex justify-between items-center px-6 py-4">
                {/* Logo */}
                <img src="/logo-dark.png" className="object-scale-down" height={16} width={120} />

                {/* Desktop Links */}
                <div className="hidden lg:flex text-primaryBlue gap-10">
                    <a href="#">Marketplace</a>
                    <a href="#">About</a>
                    <a href="#">Create Prediction</a>
                    <a href="#">Contact Us</a>
                </div>

                {/* Desktop Buttons */}
                {isAuthenticated ? (
                  <div className="hidden lg:flex gap-6">
                  <button
                    className="text-primaryBlue px-6 py-2 rounded-md"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </button>
              </div>
                ) : (
                  <div className="hidden lg:flex gap-6">
                    <button className="bg-line1 text-primaryBlue px-6 py-2 rounded-md" onClick={()=> router.push("/signup")}>Signup</button>
                    <button className="bg-primaryBlue text-line1 px-6 py-2 rounded-md" onClick={()=> router.push("/login")}>Login</button>
                </div>
                )}

                {/* Mobile Menu Icon */}
                <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden md:text-sm flex flex-col items-center gap-6 py-4">
                    <a href="#">Marketplace</a>
                    <a href="#">About</a>
                    <a href="#">Create Prediction</a>
                    <a href="#">Contact Us</a>
                    {isAuthenticated ? (
                      <button
                      className="text-primaryBlack rounded-md w-full underline"
                      onClick={() => handleLogout()}
                    >
                      Logout
                    </button>
                    ) : (
                      <>
                      <button 
                      className="text-primaryBlack rounded-md w-full underline" onClick={()=> router.push("/signup")}>Signup</button>
                    <button className="text-primaryBlack rounded-md w-full underline" onClick={()=> router.push("/login")}>Login</button>
                      </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
