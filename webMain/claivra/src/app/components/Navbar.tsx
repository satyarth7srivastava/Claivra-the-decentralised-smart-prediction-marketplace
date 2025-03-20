"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

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
                <div className="hidden lg:flex gap-6">
                    <button className="bg-line1 text-primaryBlue px-6 py-2 rounded-md" onClick={()=> router.push("/signup")}>Signup</button>
                    <button className="bg-primaryBlue text-line1 px-6 py-2 rounded-md" onClick={()=> router.push("/login")}>Login</button>
                    <button
                      className="bg-red-500 text-white px-6 py-2 rounded-md"
                      onClick={() => signOut()}
                    >
                      Logout
                    </button>
                </div>

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
                    <button 
                      className="text-primaryBlack rounded-md w-full underline" onClick={()=> router.push("/signup")}>Signup</button>
                    <button className="text-primaryBlack rounded-md w-full underline" onClick={()=> router.push("/login")}>Login</button>
                    <button
                      className="text-primaryBlack rounded-md w-full underline"
                      onClick={() => signOut()}
                    >
                      Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
