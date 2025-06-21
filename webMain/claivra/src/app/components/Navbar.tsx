"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signOut } from "next-auth/react";
import { isWallet } from "../bc-utils/utils";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { toast } from "sonner";
import { getContract } from "../bc-utils/utils";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  const handleConnect = async () => {
    try {
      // if not logged in push to login page
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Logic to connect wallet
      if (typeof window.ethereum === "undefined") {
        alert("Please install a wallet extension like MetaMask to connect.");
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(0);
        const address = await signer.getAddress();
        try {
          const contract = await getContract();
          const tx = await contract.registerAsBuyer();
          await tx.wait();
          toast.success("Successfully registered as a buyer.");

          const res = await axios.post("api/auth/walletConnect", {
            walletID: address.toLowerCase(),
          });
          setIsWalletConnected(true);
        } catch (error) {
          const decoder = ErrorDecoder.create();
          const decodedError = await decoder.decode(error);
          const { reason } = decodedError;
          console.log("Decoded error:", reason);
          if (reason === "User rejected the request.") {
            toast.error("Wallet connection request was rejected by the user.");
            return;
          } else if (reason == "Already registered as Buyer") {
            toast.error("Wallet is connected...");
            setIsWalletConnected(true);
            return;
          } else {
            toast.error(
              "An error occurred while registering to the wallet: " + reason
            );
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/check-auth");
        console.log("Auth check response:", response.data);
        setIsAuthenticated(response.data.isAuthenticated);
        const walletRes = await isWallet();
        const isWalletConnected = response.data.isWalletConnected && walletRes;
        setIsWalletConnected(isWalletConnected);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/getUser", {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    <nav className="border-[#6f6f6b] border-b">
      {!isWalletConnected && isAuthenticated && (
        <div className="flex justify-center">
          <div className="fixed top-6 z-50 transform -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%] 3xl:w-[25%] bg-white border border-blue-300 shadow-xl rounded-xl px-6 py-4 animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <p className="text-primaryBlue font-semibold text-base">
                  Connect Your Wallet
                </p>
                <p className="text-sm text-gray-600">
                  To start betting, please connect your wallet.
                </p>
              </div>
              <button
                onClick={() => {
                  handleConnect();
                  setIsOpen(false);
                }}
                className="mt-2 bg-primaryBlue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center px-6 py-4">
        <img
          src="/logo-dark.png"
          className="object-scale-down"
          height={16}
          width={120}
        />

        <div className="hidden lg:flex text-primaryBlue gap-10">
          <a href="#">Marketplace</a>
          <a href="#">About</a>
          <a href="#">Create Prediction</a>
          <a href="#">Contact Us</a>
        </div>

        {isAuthenticated ? (
          <div className="hidden lg:flex gap-6 relative">
            <div className="relative" ref={dropdownRef}>
              <img
                src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(user?.username || "User")}`}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-dropdownFade">
                  <button
                    className="flex items-center w-full text-left px-4 py-3 gap-2 text-sm hover:bg-gray-100 transition"
                    onClick={() => {
                      if (user?.role === "Organizer")
                        router.push("/organizer-dashboard");
                      else if (user?.role?.toLowerCase() === "buyer") router.push("/buyer");
                      else if (user?.role === "Admin") router.push("/admin");
                      setShowDropdown(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A7.97 7.97 0 0012 20a7.97 7.97 0 006.879-2.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Profile
                  </button>
                  <button
                    className="flex items-center w-full text-left px-4 py-3 gap-2 text-sm hover:bg-gray-100 transition"
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex gap-6">
            <button
              className="bg-line1 text-primaryBlue px-6 py-2 rounded-md"
              onClick={() => router.push("/signup")}
            >
              Signup
            </button>
            <button
              className="bg-primaryBlue text-line1 px-6 py-2 rounded-md"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </div>
        )}

        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden md:text-sm flex flex-col items-center gap-6 py-4">
          <a href="#">Marketplace</a>
          <a href="#">About</a>
          <a href="#">Create Prediction</a>
          <a href="#">Contact Us</a>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  if (user?.role === "Organizer")
                    router.push("/organizer-dashboard");
                  else if (user?.role?.toLowerCase() === "buyer") router.push("/buyer");
                  else if (user?.role === "Admin") router.push("/admin");
                }}
              >
                Profile
              </button>
              <button
                className="text-primaryBlack rounded-md w-full underline"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="text-primaryBlack rounded-md w-full underline"
                onClick={() => router.push("/signup")}
              >
                Signup
              </button>
              <button
                className="text-primaryBlack rounded-md w-full underline"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
