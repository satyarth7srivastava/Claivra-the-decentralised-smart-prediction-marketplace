"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {getContract, connectMetamask} from "@/app/bc-utils/utils"
import { signIn } from "next-auth/react";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
        e.preventDefault();
    }
    const res = await signIn('credentials', {
        email : email,
        password : password,
        redirect: false,
    });
    if (res?.error) {
        setErrorMessage("Login failed: " + res.error);
    } else {
        router.push('/');
    }
  };

  const handleMetaMaskLogin = async () => {
    const contract = getContract();
    connectMetamask(contract, true);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/bg.jpg)" }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl text-gray-800 font-semibold mt-4">Login</h2>
        <button
            className="w-full flex items-center justify-center py-2 bg-blue-500 my-4 text-gray-800 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            <div className="bg-white p-2 rounded-md">
            <img
              src="/google.png"
              alt="Google"
              className="w-6 h-6 "
            />
            </div >
            <div className="flex flex-col justify-start ml-4">
            <p className="text-sm font-bold text-gray-50">Continue with Google</p>
            <p className="text-start text-xs font-normal text-gray-200">Quick sign-in</p>
            </div>
          </button>
                

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
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
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Continue
            </button>
          </form>

          <div className="text-center my-2 text-gray-400 font-medium text-sm">
            — else login directly with —
          </div>

          <button
            onClick={handleMetaMaskLogin}
            className="w-full flex items-center justify-center py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            <img
              src="/metamask.png"
              alt="MetaMask"
              className="w-12 h-6"
            />
            Login with MetaMask
          </button>
        </div>

        <div className="text-center mt-6">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;