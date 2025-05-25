'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '@/app/component/footer';

export default function HostelAdminPage() {
  const [hostels, setHostels] = useState([]);
  const [formData, setFormData] = useState({ name: '', type: '', description: '', accommodation: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch hostels from backend
  const fetchHostels = async () => {
    try {
      const res = await fetch('/api/hostels');
      const data = await res.json();
      setHostels(data.hostels); // <-- Fix here! Access the hostels array inside the response
    } catch (error) {
      console.error('Failed to fetch hostels:', error);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `/api/hostels?id=${editId}` : '/api/hostels';

    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ name: '', type: '', description: '', accommodation: '' });
    setIsEditing(false);
    setEditId(null);
    fetchHostels();
  };

  const handleEdit = (hostel) => {
    setFormData({
      name: hostel.name,
      type: hostel.type,
      description: hostel.description,
      accommodation: hostel.accommodation,
    });
    setIsEditing(true);
    setEditId(hostel.id);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/hostels?id=${id}`, { method: 'DELETE' });
    fetchHostels();
  };

  // Calculate total capacity by summing capacities of all rooms in a hostel
  const getTotalCapacity = (hostel) => {
    if (!hostel.rooms || !Array.isArray(hostel.rooms)) return 0;
    return hostel.rooms.reduce((total, room) => total + room.capacity, 0);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Hostels</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Hostel Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="type"
          placeholder="Type (e.g., boys, girls)"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="accommodation"
          placeholder="Accommodation (e.g., Two people per room)"
          value={formData.accommodation}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEditing ? 'Update Hostel' : 'Add Hostel'}
        </button>
      </form>

      {/* Hostel List */}
      <table className="w-full table-auto bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Accommodation</th>
            <th className="p-3 text-left">Total Capacity</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(hostels) && hostels.length > 0 ? (
            hostels.map((hostel) => (
              <tr key={hostel.id} className="border-t">
                <td className="p-3">{hostel.name}</td>
                <td className="p-3">{hostel.type}</td>
                <td className="p-3">{hostel.description}</td>
                <td className="p-3">{hostel.accommodation}</td>
                <td className="p-3">{getTotalCapacity(hostel)}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(hostel)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hostel.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No hostels available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
