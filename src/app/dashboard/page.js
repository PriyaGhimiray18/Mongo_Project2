'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../component/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.css';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/');
    } 
    // If admin logged in, fetch bookings
    else if (status === 'authenticated' && session?.user?.isAdmin) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [status, session, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/bookings', { credentials: 'include' });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    alert('You have been logged out!');
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-muted">Loading dashboard...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-danger">You must be logged in to view this page.</p>
      </div>
    );
  }

  const isAdmin = !!session.user.isAdmin;
  const role = isAdmin ? 'ADMIN' : 'USER';

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container flex-grow-1 py-4">
        {/* USER Dashboard */}
        {role === 'USER' && (
          <div className="card shadow-sm p-4" style={{ backgroundColor: '#e0c2a5' }}>
            <h2 className="text-dark">Welcome, {session.user.name || 'User'} 👤</h2>
            <p className="lead">Manage your hostel activities from here.</p>

            <div className="section">
              <h4>📋 Profile</h4>
              <p>
                <strong>Name:</strong> {session.user.name || 'N/A'} <br />
                <strong>Email:</strong> {session.user.email || 'N/A'}
              </p>
            </div>

            <div className="section quick-actions">
              <h4>⚡ Quick Actions</h4>
              <Link href="/booking" className="btn btn-primary me-2">
                Book Room
              </Link>
              <button className="btn btn-secondary me-2">Update Info</button>
              <button className="btn btn-info">Help Desk</button>
            </div>

            <button className="btn btn-danger logout-btn mt-4" onClick={logout}>
              Logout
            </button>
          </div>
        )}

        {/* ADMIN Dashboard */}
        {role === 'ADMIN' && (
          <div  className="card shadow-sm p-4" style={{ backgroundColor: '#e0c2a5' }}>
            <h2 className="text-dark">Welcome, {session.user.name || 'Admin'} 🛠️</h2>
            <p className="lead">Here’s your control panel to manage bookings and hostels.</p>


            <div className="section">
              <h4>👤 Admin Info</h4>
              <p>
                <strong>Name:</strong> {session.user.name || 'N/A'} <br />
                <strong>Email:</strong> {session.user.email || 'N/A'}
              </p>
            </div>

            <div className="section quick-actions mb-4">
              <h4>🛠️ Admin Tools</h4>
              <Link href="/admin/hostel" className="btn btn-success me-2">
                Manage Hostels
              </Link>
              <Link href="/admin/room" className="btn btn-primary">
                Manage Rooms
              </Link>
            </div>

            <div className="section">
              <h4>📋 Room Bookings</h4>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Student ID</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Hostel</th>
                      <th>Room</th>
                      <th>Check-in</th>
                      <th>People</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="text-center">Loading bookings...</td>
                      </tr>
                    ) : bookings.length > 0 ? (
                      bookings.map((b) => (
                        <tr key={b.id}>
                          <td>{b.studentName}</td>
                          <td>{b.studentID}</td>
                          <td>{b.department}</td>
                          <td>{b.email}</td>
                          <td>{b.phone}</td>
                          <td>{b.hostelName}</td>
                          <td>{b.roomNumber}</td>
                          <td>{new Date(b.checkinDate).toLocaleDateString()}</td>
                          <td>{b.numPeople}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center text-muted">No bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <button className="btn btn-danger logout-btn mt-4" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
