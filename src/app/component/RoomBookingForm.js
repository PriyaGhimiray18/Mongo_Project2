'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import '@/styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RoomBookingForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    hostelName: '',
    checkinDate: '',
    numPeople: '',
    studentName: '',
    studentID: '',
    department: '',
    roomNumber: '',
    email: '',
    phone: ''
  });

  const [roomInfo, setRoomInfo] = useState(null);
  const [error, setError] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Pre-fill form data from session.user once session is loaded
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const user = session.user;
      setFormData(prev => ({
        ...prev,
        studentName: user.name || '',
        studentID: user.studentId || '', // you might need to add custom user fields in NextAuth session
        email: user.email || ''
      }));
    }
  }, [status, session]);

  // Fetch room information when hostel and room number are selected
  useEffect(() => {
    if (formData.hostelName && formData.roomNumber) {
      fetch(`/api/rooms?hostel=${encodeURIComponent(formData.hostelName)}`)
        .then(res => res.json())
        .then(data => {
          const room = data.rooms?.find(r => r.roomNumber === parseInt(formData.roomNumber));
          if (room) {
            setRoomInfo(room);
            setError('');
          } else {
            setRoomInfo(null);
            setError('Room not found');
          }
        })
        .catch(err => {
          console.error('Error fetching room info:', err);
          setRoomInfo(null);
          setError('Failed to fetch room information');
        });
    } else {
      setRoomInfo(null);
      setError('');
    }
  }, [formData.hostelName, formData.roomNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'numPeople') {
      const maxPeople = roomInfo?.capacity || 5;
      let newValue = value;

      if (parseInt(newValue) > maxPeople) {
        newValue = maxPeople.toString();
      }
      if (parseInt(newValue) < 1 || isNaN(parseInt(newValue))) {
        newValue = '1';
      }

      setFormData(prevData => ({
        ...prevData,
        [name]: newValue
      }));
      setError('');
      setSubmitStatus('');
      return;
    }

    if (name === 'hostelName') {
      setFormData(prevData => ({
        ...prevData,
        [name]: value.trim()
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }

    setError('');
    setSubmitStatus('');
  };

  const validateForm = async (e) => {
    e.preventDefault();

    if (status !== 'authenticated' || !session?.user) {
      setError('Please log in to make a booking');
      router.push('/');
      return;
    }

    if (roomInfo && parseInt(formData.numPeople) > roomInfo.capacity) {
      setError(`This room has a maximum capacity of ${roomInfo.capacity} people`);
      return;
    }

    if (roomInfo && roomInfo.status === 'FULLY_BOOKED') {
      setError('This room is fully booked');
      return;
    }

    if (roomInfo && (roomInfo.occupants + parseInt(formData.numPeople)) > roomInfo.capacity) {
      setError(`Only ${roomInfo.capacity - roomInfo.occupants} spaces available in this room`);
      return;
    }

    try {
      setError('');
      setSubmitStatus('submitting');

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostelName: formData.hostelName,
          roomNumber: parseInt(formData.roomNumber),
          studentName: formData.studentName,
          studentId: formData.studentID,
          department: formData.department,
          checkinDate: new Date(formData.checkinDate).toISOString(),
          numPeople: parseInt(formData.numPeople),
          email: formData.email,
          phone: formData.phone,
          userId: session.user.id, // assuming your session user has an id
        }),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to submit booking');
      }

      setFormData({
        hostelName: '',
        checkinDate: '',
        numPeople: '',
        studentName: session.user.name || '',
        studentID: '',
        department: '',
        roomNumber: '',
        email: session.user.email || '',
        phone: ''
      });
      setSubmitStatus('success');
      setError('');

      if (data.room) {
        setRoomInfo({
          ...data.room,
          availableSpaces: data.room.capacity - data.room.occupants
        });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setError(error.message);
      setSubmitStatus('error');
    }
  };

  const getButtonStyle = () => {
    if (!roomInfo) return 'btn-primary';

    switch (roomInfo.status) {
      case 'FULLY_BOOKED':
        return 'btn-danger';
      case 'PARTIALLY_BOOKED':
        return 'btn-warning';
      default:
        return 'btn-primary';
    }
  };

  if (status === 'loading') {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Redirect handled by useEffect
  }

  return (
    <section className="container my-5">
      <h2 className="text-center mb-4">Room Booking Form</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={validateForm}>
            {/* Form inputs same as before */}
            {/* ... (keep all your form fields as you had) */}

            <div className="mb-4">
              <label htmlFor="hostelName" className="form-label fw-bold">Select Hostel</label>
              <select
                className="form-select"
                id="hostelName"
                name="hostelName"
                value={formData.hostelName}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Choose a hostel</option>
                <option value="Hostel A">Hostel A (2 people)</option>
                <option value="Hostel B">Hostel B (2 people)</option>
                <option value="RKA">RKA (4 people)</option>
                <option value="RKB">RKB (4 people)</option>
                <option value="NK">NK (4 people)</option>
                <option value="Lhawang">Lhawang (4 people)</option>
                <option value="Hostel E">Hostel E (2 people)</option>
                <option value="Hostel C">Hostel C (2 people)</option>
                <option value="Hostel D">Hostel D (2 people)</option>
                <option value="Hostel F">Hostel F (3 people)</option>
              </select>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="checkinDate" className="form-label fw-bold">Date of Booking</label>
                <input
                  type="date"
                  className="form-control"
                  id="checkinDate"
                  name="checkinDate"
                  value={formData.checkinDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="numPeople" className="form-label fw-bold">
                  No. of People
                  {roomInfo && (
                    <span className="text-muted ms-2">
                      (Max: {roomInfo.capacity}, Available: {roomInfo.capacity - roomInfo.occupants})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="numPeople"
                  name="numPeople"
                  min="1"
                  max={roomInfo?.capacity || 5}
                  value={formData.numPeople}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="card mb-4 p-3">
              <h5 className="mb-3">Student Details</h5>
              <div className="row g-3">
                <div className="col-md-12 mb-3">
                  <label htmlFor="studentName" className="form-label">Name(s)</label>
                  <textarea
                    className="form-control"
                    id="studentName"
                    name="studentName"
                    rows="3"
                    placeholder="One name per line"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <label htmlFor="studentID" className="form-label">Student ID(s)</label>
                  <textarea
                    className="form-control"
                    id="studentID"
                    name="studentID"
                    rows="3"
                    placeholder="One ID per line"
                    value={formData.studentID}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <label htmlFor="department" className="form-label">Department(s)</label>
                  <textarea
                    className="form-control"
                    id="department"
                    name="department"
                    rows="3"
                    placeholder="One department per line"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="roomNumber" className="form-label fw-bold">Room No.</label>
                <input
                  type="number"
                  className="form-control"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label fw-bold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="alert alert-success" role="alert">
                Booking successful!
              </div>
            )}

            <button
              type="submit"
              className={`btn ${getButtonStyle()} w-100`}
              disabled={submitStatus === 'submitting'}
            >
              {submitStatus === 'submitting' ? 'Booking...' : 'Book Now'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
