"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ethers } from "ethers";
import { set } from "mongoose";
import { signIn } from "next-auth/react";

import { getContract } from "../bc-utils/utils";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [wallerAddress, setWalletAddress] = useState<string>("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string>("Buyer"); // Default role is Buyer
  const router = useRouter();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/check-auth");
        if (response.data.isAuthenticated) {
          router.push("/");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleGoogleSignup = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleConnect = async () => {
    if (isWalletConnected) {
      return;
    }
    setIsLoading(true);
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        setErrorMessage("Please install MetaMask to use this feature.");
        return;
      }
      // Request account access if needed
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(0);
      const address = await signer.getAddress();
      setIsWalletConnected(true);
      setWalletAddress(address.toLowerCase());
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/signup", {
        email,
        fullName,
        password,
        role, // Include role in the signup payload
        wallerAddress,
      });

      if (response.data.status === "success") {
        const contract = await getContract();
        if (!contract) {
          setErrorMessage("Contract not found. Please try again.");
          return;
        }
        var tx = null;
        if (role === "Organizer") {
          tx = await contract.registerAsSeller();
        } else if(role === "Buyer"){
          tx = await contract.registerAsBuyer();
        }else if(role === "Admin"){
          tx = await contract.registerAsAdmin();
        }else{
          setErrorMessage("Invalid role selected. Please select a valid role.");
          return;
        }
        if (tx == null) {
          setErrorMessage("Transaction failed. Please try again.");
          return;
        }
        await tx.wait();
        if (tx) {
          if (role === "Organizer") {
            router.push("/organizer-dashboard/");
          } else {
            router.push("/");
          }
        }
      } else {
        setErrorMessage(response.data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setErrorMessage((error as any)?.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url(/bg.jpg)" }}>
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl text-gray-800 font-semibold mt-4">Sign Up</h2>

        <button className="w-full flex items-center justify-center py-2 bg-blue-500 my-4 text-gray-800 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleGoogleSignup}>
          <div className="bg-white p-2 rounded-md">
            <img src="/google.png" alt="Google" className="w-6 h-6" />
          </div>
          <div className="flex flex-col justify-start ml-4">
            <p className="text-sm font-bold text-gray-50">Continue with Google</p>
            <p className="text-start text-xs font-normal text-gray-200">Quick sign-up</p>
          </div>
        </button>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Buyer">Buyer</option>
              <option value="Organizer">Organizer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button className="w-full py-2 bg-yellow-600 hover:bg-blue-700 transition duration-200 text-white rounded-lg mb-4"
            onClick={handleConnect}
          >
            {(isWalletConnected) ? (<>Connected</>) : (<>Connect Wallet</>)}
          </button>

          {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

          <button type="submit" className="w-full py-2 bg-gray-500 hover:bg-blue-700 transition duration-200 text-white rounded-lg">
            Continue
          </button> 
        </form>

        <div className="text-center mt-6">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-800">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
