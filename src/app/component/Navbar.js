'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <nav className="navbar bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="navbar-brand flex flex-col items-center space-y-1 text-white no-underline hover:text-blue-400 transition flex-shrink-0">
          <Image src="/img/logo.jpg" alt="Hostel Logo" width={40} height={40} />
          <span className="text-xl font-semibold whitespace-nowrap">Hostel Booking</span>
        </Link>

        {/* Desktop Menu (md and up) */}
        <div className={`navbar-collapse ${menuOpen ? 'block' : 'hidden'} md:flex items-center space-x-6 flex-grow justify-end min-w-0`}>
          <nav className="navbar-nav flex flex-col md:flex-row md:space-x-3">
            <Link href="/home" className="nav-link text-white no-underline hover:text-blue-400 transition focus:outline-none focus:ring-0 border-0">Home</Link>
            <Link href="/hostel" className="nav-link text-white no-underline hover:text-blue-400 transition focus:outline-none focus:ring-0 border-0">Hostel</Link>
            <Link href="/booking" className="nav-link text-white no-underline hover:text-blue-400 transition focus:outline-none focus:ring-0 border-0">Booking</Link>
            <Link href="/contact" className="nav-link text-white no-underline hover:text-blue-400 transition focus:outline-none focus:ring-0 border-0">Contact</Link>
            <Link href="/dashboard" className="nav-link text-white no-underline hover:text-blue-400 transition focus:outline-none focus:ring-0 border-0">Dashboard</Link>
          </nav>

          <form className="form-control flex flex-col sm:flex-row items-center sm:space-x-2 mt-4 md:mt-0 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="w-full sm:w-48 px-3 py-1 rounded-md bg-gray-100 text-black placeholder-gray-500 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 md:w-48"
            />
            <button
              type="submit"
              className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-white"
            >
              Search
            </button>
          </form>
        </div>

        {/* Hamburger Menu (sm screens only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
}
