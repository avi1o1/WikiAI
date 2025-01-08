"use client";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const createUser = async (userId) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    console.log("Base URL:", baseUrl);
    const response = await fetch(`${baseUrl}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        name: `User ${userId}`,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const data = await response.json();
    console.log("User created:", data);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

// Cookie utility functions
const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

// Generate random number between min and max (inclusive)
const generateRandomNumber = (min = 1000, max = 9999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function Home() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [userNumber, setUserNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user has already started and router is ready
  useEffect(() => {
    const savedNumber = getCookie("WikiAI_user_number");
    if (savedNumber) {
      setUserNumber(parseInt(savedNumber));
      setHasStarted(true);
    }
    setIsReady(true);
  }, []);

  const handleGetStarted = async () => {
    if (!isReady || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!userNumber) {
        const randomNum = generateRandomNumber();
        setUserNumber(randomNum);
        setCookie("WikiAI_user_number", randomNum.toString(), 30);

        await createUser(randomNum.toString());
      }

      setCookie("WikiAI_started", "true", 30);
      setHasStarted(true);

      await router.push("/chat");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-dark text-text-light min-h-screen flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Main Section */}
      <main className="flex-grow flex flex-col md:flex-row items-center px-4 py-4 sm:px-8 sm:py-8 md:px-12 md:py-16 lg:px-20 lg:py-20">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-snug page-heading">
            Enhance Your Knowledge Journey
          </h2>
          <p
            className="text-xl sm:text-2xl text-text-muted text-justify page-subheadings"
            style={{ width: "100%" }}
          >
            At WikiAI, we provide a comprehensive platform for exploring, learning, and
            understanding a wide range of topics. Join us in revolutionizing the way you
            access and engage with information, making your knowledge journey more
            insightful and enjoyable.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleGetStarted}
              disabled={!isReady || isLoading}
              className={`mt-6 py-3 px-8 rounded-full gradient-border transition-all duration-300 ${!isReady || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : hasStarted
                    ? "bg-primary-blue text-bg-dark hover:bg-primary-green"
                    : "bg-primary-green text-bg-dark hover:bg-primary-blue"
                }`}
            >
              {isLoading
                ? "Loading..."
                : hasStarted
                  ? "Continue Journey"
                  : "Get Started"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {userNumber && (
              <p className="text-sm text-text-muted">
                Your unique number: {userNumber}
              </p>
            )}
          </div>
        </div>

        {/* Right Content*/}
        <div className="w-full md:w-auto mt-10 md:mt-0 flex justify-center ml-0 sm:ml-8 md:ml-12 lg:ml-16 xl:ml-20">
          <Image
            src="/logo.png"
            width={600}
            height={420}
            alt="Mental Well-being Illustration"
            className="w-[80vw] md:w-[37vw] md:h-[23vw]"
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
