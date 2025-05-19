'use client';

import Head from 'next/head';
import Image from 'next/image';
import Footer from '@/app/component/footer';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.css';

export default function ContactPage() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <>
      <Head>
        <title>Contact Us - Hostel Booking</title>
        <link rel="icon" href="/img/favicon.jpeg" type="image/jpeg" />
        <link rel="stylesheet" href="/Style.css" />
      </Head>

      {/* Hero Section */}
      <header
        className="hero text-center text-white d-flex align-items-center justify-content-center flex-column"
        style={{ height: '50vh', backgroundColor: '#648eb8' }}
      >
        <h1>Contact Us</h1>
        <p className="lead">
          Have any questions? Reach out to us, and we'll get back to you as soon
          as possible.
        </p>
      </header>

      {/* Contact Info */}
      <section className="container my-5 add">
        <div className="row">
          <div className="col-md-6">
            <h4>📍Our Address</h4>
            <p>
              College of Science and Technology, Rinchending, Phuentsholing,
              <br />
              Chukkha: Bhutan,
              <br />
              Post-Box No: 450
              <br />
              Postal Code: 21101
            </p>
          </div>

          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.6915309776086!2d89.39171453756305!3d26.84976187678176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e3cb2c19b08be7%3A0xb656aaecd3d877ca!2sCST%2C%20College%20Library!5e0!3m2!1sen!2sbt!4v1744118575056!5m2!1sen!2sbt"
              width="400"
              height="300"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="container my-5">
        <h3 className="text-center mb-4">Contact Us</h3>
        <div className="row text-center">
          <div className="col-md-6 mb-4 contact-card">
            <Image
              src="/img/ssom.jpeg"
              alt="SSO 1"
              width={200}
              height={200}
              className="rounded-circle mb-3"
            />
            <h5>Mr. Purna Bdr Mongar</h5>
            <p>Student Service Officer Male</p>
            <p>
              Email:{' '}
              <a href="mailto:purnabdrmongar.cst@rub.edu.bt">
                purnabdrmongar.cst@rub.edu.bt
              </a>
            </p>
            <p>📞 Phone: +975 17123456</p>
          </div>

          <div className="col-md-6 mb-4 contact-card">
            <Image
              src="/img/ssof.jpeg"
              alt="SSO 2"
              width={200}
              height={200}
              className="rounded-circle mb-3"
            />
            <h5>Ms. Chimi Dem</h5>
            <p>Student Service Officer Female</p>
            <p>
              Email:{' '}
              <a href="mailto:chimidem.cst@rub.edu.bt">chimidem.cst@rub.edu.bt</a>
            </p>
            <p>📞 Phone: +975 17234567</p>
          </div>
        </div>
      </section>

      {/* Question Form */}
      <section className="container my-5">
        <h3 className="text-center mb-4">Ask Us Anything</h3>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input type="text" className="form-control" id="name" required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input type="email" className="form-control" id="email" required />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
