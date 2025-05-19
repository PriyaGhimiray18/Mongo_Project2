'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();

  // List of routes where Navbar should be hidden
  const hiddenRoutes = ['/', '/signup'];

  if (hiddenRoutes.includes(pathname)) {
    return null; // Don't render navbar
  }

  return <Navbar />;
}
