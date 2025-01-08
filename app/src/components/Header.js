'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const createUser = async (userId) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
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

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [userNumber, setUserNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedNumber = getCookie("WikiAI_user_number");
    if (savedNumber) {
      setUserNumber(parseInt(savedNumber));
    }
    setIsReady(true);
  }, []);

  const handleChatClick = async () => {
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

      await router.push("/chat");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleChatClickAndToggleMenu = async () => {
    await handleChatClick();
    toggleMobileMenu();
  };

  return (
    <header className="sticky top-0 flex justify-between items-center py-3 px-8 bg-bg-accent z-20" style={{ backgroundColor: '#001c30' }}>
      <Link href="/">
        <div className="flex items-center gap-4 w-[123px]">
          <Image src="/headerLogo.png" width={60} height={60} alt="WikiAI Logo" />
        </div>
      </Link>

      <nav className="hidden md:flex gap-12 text-xl">
        <Link href="/" className="hover:text-primary-green">Home</Link>
        <Link href="/about" className="hover:text-primary-green">About</Link>
        <button onClick={handleChatClick} className="hover:text-primary-green">Chat</button>
        <Link href="/faq" className="hover:text-primary-green">FAQs</Link>
      </nav>

      <Link href="/signin">
        <button className="bg-primary-green text-xl text-bg-dark py-2 px-5 rounded-md hover:bg-primary-blue hidden md:block w-[123px]">Sign In</button>
      </Link>

      <button 
        className="md:hidden z-50" 
        onClick={toggleMobileMenu} 
        aria-label="Toggle mobile menu"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden z-40 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ backgroundColor: isMobileMenuOpen ? '#001c30' : 'bg-bg-accent' }}>
        <div className="flex flex-col items-center pt-24 h-full">
          <Link href="/" className="w-full py-4 text-center hover:text-primary-green hover:bg-black/5" onClick={toggleMobileMenu}>Home</Link>
          <Link href="/about" className="w-full py-4 text-center hover:text-primary-green hover:bg-black/5" onClick={toggleMobileMenu}>About</Link>
          <button onClick={handleChatClickAndToggleMenu} className="w-full py-4 text-center hover:text-primary-green hover:bg-black/5">Chat</button>
          <Link href="/faq" className="w-full py-4 text-center hover:text-primary-green hover:bg-black/5" onClick={toggleMobileMenu}>FAQs</Link>
          <Link href="/signin">
            <button className="bg-primary-green text-bg-dark py-2 px-5 rounded-md hover:bg-primary-blue mt-8">Sign In</button>
          </Link>
        </div>
      </div>

      {/* Background Dimming Effect */}
      <div className={`fixed inset-0 bg-black/20 z-30 ${isMobileMenuOpen ? 'block' : 'hidden'}`} onClick={toggleMobileMenu} aria-hidden="true" />
    </header>
  );
};

export default Header;