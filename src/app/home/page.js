'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import '@/styles/style.css';
import Carousel from '../component/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from '@/app/component/footer';  // if you have a Footer component

export default function Home() {
  useEffect(() => {
    // Initialize Bootstrap components
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  const rules = [
    { icon: "bi-gender-ambiguous", text: "Not allowed to bring other gender to hostel", color: "primary" },
    { icon: "bi-ban", text: "Smoking and drinking are strictly prohibited", color: "danger" },
    { icon: "bi-person-x", text: "Visitors are not allowed in the hostel", color: "warning" },
    { icon: "bi-broom", text: "Rooms must be kept clean at all times", color: "success" },
    { icon: "bi-volume-up", text: "Loud sounds or shouting at late hours is against the rules", color: "secondary" },
    { icon: "bi-house-door", text: "Respect the property and the building structure", color: "success" },
    { icon: "bi-people", text: "Respect the privacy of other residents", color: "warning" },
    { icon: "bi-clipboard-check", text: "Follow the hostel's check-in/check-out policy", color: "info" },
    { icon: "bi-trash", text: "Dispose of trash in designated bins", color: "danger" },
  ];

  return (
    <>
      <main className="flex-grow-1">
        {/* Hero Section */}
        <header className="hero text-center text-white d-flex align-items-center justify-content-center" style={{ height: '60vh', background: '#343a40' }}>
          <div>
            <h1>Welcome to Our Hostel</h1>
            <p className="lead">Find the Room of your choice</p>
            <Link href="/booking" className="btn btn-light btn-lg">Book Now</Link>
          </div>
        </header>

        {/* Image Carousel */}
        <Carousel />

        {/* About Section */}
        <section id="about-us" className="container my-5">
          <h2 className="text-center mb-4">About Us</h2>
          <p className="lead text-center">
            Welcome to the College of Science and Technology.
            The CST Hostel currently accommodates over 1,000 students. You have the option to choose your own room from the list of available hostels. 
            Room bookings are based on a first-come, first-served basis, ensuring a fair and efficient process without the inconvenience of manual room assignments.
            While staying in the hostel, various services are provided for your convenience. However, it is important to note that a set of rules must be followed during your stay. 
            Any violation of these rules will be taken seriously and dealt with accordingly.
          </p>
        </section>

        {/* Services Section */}
        <section id="services" className="container my-5">
          <h2 className="text-center mb-4">Our Services</h2>
          <div className="row">
            <div className="col-md-4 text-center">
              <div className="service-card">
                <h4>🔐 24/7 Security</h4>
                <p>We ensure the safety of our residents with round-the-clock security and surveillance.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="service-card">
                <h4>🛜 Free Wi-Fi</h4>
                <p>Stay connected with high-speed internet throughout the hostel.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="service-card">
                <h4>💰 Affordable Rates</h4>
                <p>The accommodation fee is included as part of the admission process, eliminating the need for any additional payment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hostel Rules Section */}
        <section id="rules" className="container my-5">
          <div className="border border-dark rounded p-4 shadow" style={{ background: 'linear-gradient(135deg, #f8a3d0, #a3c9f7)' }}>
            <h2 className="text-center mb-4 text-dark">Hostel Rules</h2>
            <div className="row g-4">
              {rules.map((rule, i) => (
                <div className="col-md-6" key={i}>
                  <div className="p-3 bg-white rounded shadow-sm d-flex align-items-start">
                    <i className={`bi ${rule.icon} fs-4 text-${rule.color} me-3`} />
                    <span>{rule.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
