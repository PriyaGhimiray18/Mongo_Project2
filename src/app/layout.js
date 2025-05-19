// layout.js
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import NavbarWrapper from '@/app/component/NavbarWrapper'; // ✅ New wrapper
import BootstrapClient from '@/component/BootstrapClient';
import SessionWrapper from './SessionWrapper';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'CST Hostel Booking System',
  description: 'Book your hostel room at CST',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <BootstrapClient />
        <NavbarWrapper /> {/* ✅ Conditional rendering is handled here */}
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
