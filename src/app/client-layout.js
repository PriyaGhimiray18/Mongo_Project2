'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';

export default function ClientLayout({ children }) {
  const [isBootstrapLoaded, setIsBootstrapLoaded] = useState(false);

  useEffect(() => {
    // Check if Bootstrap is already loaded
    if (typeof window !== 'undefined' && window.bootstrap) {
      setIsBootstrapLoaded(true);
    }
  }, []);

  const handleBootstrapLoad = () => {
    setIsBootstrapLoaded(true);
  };

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
        onLoad={handleBootstrapLoad}
      />
      {!isBootstrapLoaded && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div style={{ opacity: isBootstrapLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
        {children}
      </div>
    </>
  );
} 