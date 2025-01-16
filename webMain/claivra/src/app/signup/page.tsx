"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/verify-signup");
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/bg.jpg)" }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl text-gray-800 font-semibold mt-4">Sign Up</h2>
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
            <p className="text-start text-xs font-normal text-gray-200">Quick sign-up</p>
            </div>
          </button>
          
        <div className="mt-6">
          <form onSubmit={handleSubmit}>
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
      
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-gray-500 hover:bg-blue-700 transition duration-200 text-white rounded-lg "
            >
              Continue
            </button>
          </form>

          <div className="text-center my-2 text-gray-400 font-medium text-sm">
            — else login directly with —
          </div>

          <button
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
