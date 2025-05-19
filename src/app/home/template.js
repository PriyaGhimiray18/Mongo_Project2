'use client';

export default function HomeTemplate({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      {children}
    </div>
  );
} 