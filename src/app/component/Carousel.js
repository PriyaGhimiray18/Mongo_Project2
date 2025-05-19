'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Carousel() {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const initCarousel = async () => {
      setIsLoading(true);
      try {
        const bootstrap = await import('bootstrap');
        const carousel = document.getElementById('heroCarousel');
        if (carousel) {
          new bootstrap.Carousel(carousel, {
            interval: 3000,
            ride: 'carousel'
          });
        }
      } catch (error) {
        console.error('Error initializing carousel:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    initCarousel();

    // Cleanup function
    return () => {
      const carousel = document.getElementById('heroCarousel');
      if (carousel) {
        const bsCarousel = bootstrap.Carousel.getInstance(carousel);
        if (bsCarousel) {
          bsCarousel.dispose();
        }
      }
    };
  }, []);

  const carouselItems = [
    {
      src: '/img/RKA.jpg',
      alt: 'Hostel 1',
      title: 'RKA Hostel',
      description: 'Modern accommodation for students'
    },
    {
      src: '/img/he.jpg',
      alt: 'Hostel 2',
      title: 'Hostel E',
      description: 'Comfortable living spaces'
    },
    {
      src: '/img/hc.jpg',
      alt: 'Hostel 3',
      title: 'Hostel C',
      description: 'Quality student accommodation'
    }
  ];

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading carousel. Please refresh the page.
      </div>
    );
  }

  if (isLoading && !isClient) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div 
        id="heroCarousel" 
        className="carousel slide" 
        style={{ 
          opacity: isClient ? 1 : 0, 
          transition: 'opacity 0.3s ease-in',
          visibility: isClient ? 'visible' : 'hidden'
        }}
      >
        <div className="carousel-indicators">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : 'false'}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="carousel-inner">
          {carouselItems.map((item, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <Image 
                src={item.src}
                className="d-block w-100"
                alt={item.alt}
                width={900}
                height={500}
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                style={{ 
                  objectFit: 'cover', 
                  height: '500px',
                  opacity: isClient ? 1 : 0,
                  transition: 'opacity 0.3s ease-in'
                }}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
} 