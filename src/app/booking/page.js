'use client';
import Footer from '@/app/component/footer'; // ✅ Make sure Footer is default-exported
import RoomBookingForm from '../component/RoomBookingForm';
import '@/styles/style.css';

export default function RoomBooking() {
  return (
    <div>
      <header
        className="hero text-center text-white d-flex align-items-center justify-content-center"
        style={{ height: '50vh', backgroundColor: '#648eb8' }}
      >
        <div>
          <h1>Book Your Room</h1>
          <p className="lead">Reserve a comfortable space for yourself</p>
        </div>
      </header>
      <RoomBookingForm />
      <Footer />
    </div>
  );
}
