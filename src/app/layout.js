// layout.js
import BootstrapClient from '@/component/BootstrapClient';
import './globals.css';
import NavbarWrapper from '@/app/component/NavbarWrapper';
import SessionWrapper from './SessionWrapper';

export const metadata = {
  title: 'Hostel Booking System',
  description: 'A modern hostel booking system',
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
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <BootstrapClient />
        <NavbarWrapper />
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
