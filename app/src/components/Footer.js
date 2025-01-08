'use client';
import React, { useState } from 'react';

const Footer = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <footer className="bg-bg-accent py-6 text-center">
      <p>© 2025 WikiAI. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
