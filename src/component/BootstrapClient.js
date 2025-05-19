'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .then(() => console.log('Bootstrap JS loaded'))
      .catch((err) => console.error('Bootstrap JS load failed', err));
  }, []);

  return null; // no UI output
}
