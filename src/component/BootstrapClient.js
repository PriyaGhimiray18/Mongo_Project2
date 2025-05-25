'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Load Bootstrap JS
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .then(() => console.log('Bootstrap JS loaded'))
      .catch((err) => console.error('Bootstrap JS load failed', err));

    // Add Bootstrap CSS link if not already present
    if (!document.querySelector('link[href*="bootstrap.min.css"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
      link.rel = 'stylesheet';
      link.integrity = 'sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }

    // Add Bootstrap Icons CSS link if not already present
    if (!document.querySelector('link[href*="bootstrap-icons.min.css"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  return null; // no UI output
}
