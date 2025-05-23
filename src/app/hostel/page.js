'use client';
import { useEffect, useState } from 'react';
import Footer from '../component/footer'; 
import prisma from '@/lib/prisma';
import RoomCard from '../component/RoomCard';
import '@/styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [newHostels, setNewHostels] = useState([]);
  const [loading, setLoading] = useState(true); // Optional: show loading
  const [error, setError] = useState(null);     // Optional: track error

  const hardcodedHostelNames = [
    'Hostel A',
    'Hostel B',
    'Hostel RKA',
    'Hostel RKB',
    'Hostel NK',
    'Hostel E',
    'Hostel Lhawang',
    'Hostel F',
    'Hostel C',
    'Hostel D'
  ];

  useEffect(() => {
    const fetchNewHostels = async () => {
      try {
        const res = await fetch('/api/hostels');
        const data = await res.json();

        if (!res.ok || !data || !Array.isArray(data.hostels)) {
          console.error('Invalid response from /api/hostels:', data);
          setError('Invalid data from server');
          return;
        }

        const normalize = (name) =>
          name.replace(/^Hostel\s+/i, '').toLowerCase().trim();

        const normalizedHardcoded = hardcodedHostelNames.map(normalize);

        const filtered = data.hostels.filter((h) => {
          const normalizedDbName = normalize(h.name);
          return !normalizedHardcoded.includes(normalizedDbName);
        });

        setNewHostels(filtered);
      } catch (err) {
        console.error('Error fetching hostels:', err);
        setError('Error fetching hostels');
      } finally {
        setLoading(false);
      }
    };

    fetchNewHostels();
  }, []);

  return (
    <div>
      <section id="rooms" className="container my-5">
        <h2 className="text-center mb-5">Available Hostel</h2>

        {/* Boy's Hostels */}
        <h3 className="text-dark mb-4">Boy's Hostels</h3>
        <div className="row">
          <RoomCard hostel="Hostel A" image="/img/hostelA.jpg" description="Boy's Hostel" accommodation="Two people per room" link="/available-room?hostel=Hostel A" />
          <RoomCard hostel="Hostel B" image="/img/hb.jpg" description="Boy's Hostel" accommodation="Two people per room" link="/available-room?hostel=Hostel B" />
          <RoomCard hostel="Hostel RKA" image="/img/RKA.jpg" description="Boy's Hostel" accommodation="Four people per room" link="/available-room?hostel=Hostel RKA" />
          <RoomCard hostel="Hostel RKB" image="/img/RKB.jpg" description="Boy's Hostel" accommodation="Four people per room" link="/available-room?hostel=Hostel RKB" />
          <RoomCard hostel="Hostel NK" image="/img/nk.jpg" description="Boy's Hostel" accommodation="Four people per room" link="/available-room?hostel=Hostel NK" />
          <RoomCard hostel="Hostel E" image="/img/he.jpg" description="Boy's Hostel" accommodation="Two people per room" link="/available-room?hostel=Hostel E" />
          <RoomCard hostel="Hostel Lhawang" image="/img/lhawang.jpg" description="Boy's Hostel" accommodation="Four people per room" link="/available-room?hostel=Hostel Lhawang" />
        </div>

        {/* Girl's Hostels */}
        <h3 className="text-dark mt-5 mb-4">Girl's Hostels</h3>
        <div className="row">
          <RoomCard hostel="Hostel F" image="/img/hf.jpg" description="Girl's Hostel" accommodation="Three people per room" link="/available-room?hostel=Hostel F" />
          <RoomCard hostel="Hostel C" image="/img/hc.jpg" description="Girl's Hostel" accommodation="Two people in a room" link="/available-room?hostel=Hostel C" />
          <RoomCard hostel="Hostel D" image="/img/hd.jpg" description="Girl's Hostel" accommodation="Two people in a room" link="/available-room?hostel=Hostel D" />
        </div>

        {/* Dynamically Fetched New Hostels */}
        {loading && <p className="text-center mt-4">Loading new hostels...</p>}
        {error && <p className="text-danger text-center mt-4">{error}</p>}

        {newHostels.length > 0 && !error && (
          <>
            <h3 className="text-dark mt-5 mb-4">Newly Added Hostels</h3>
            <div className="row">
              {newHostels.map((hostel) => (
                <RoomCard
                  key={hostel.id}
                  hostel={hostel.name}
                  image="/img/default.jpg"
                  description={hostel.description || 'No description'}
                  accommodation={hostel.accommodation || 'Info not available'}
                  link={`/available-room?hostel=${encodeURIComponent(hostel.name)}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
