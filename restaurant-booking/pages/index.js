import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast'; // Ensure Toastify styles are included
import '@/styles/global.css';

export default function Home() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);

  // Fetch bookings from the backend
  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    
    fetchBookings();
  }, []);

  // Submit a new booking to the backend
  const handleBooking = async (e) => {
    e.preventDefault();
    const bookingData = {
      name,
      contact,
      guests,
      date,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', bookingData);
      toast('Booking Successful');
      setName('');
      setContact('');
      setGuests(1);
      setDate(new Date());
      fetchBookings(); // Refresh bookings after successful submission
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error || 'Booking already exists');
      } else {
        toast.error('Error creating booking');
      }
    }
  };

  // Delete a booking from the backend
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      toast.success('Booking deleted successfully');
      fetchBookings(); // Refresh bookings after deletion
    } catch (error) {
      toast.error('Error deleting booking');
    }
  };

  return (
    <div className="w-1/3 mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Restaurant Table Booking</h1>
      <form onSubmit={handleBooking} className="mb-5">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Enter your contact number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Number of guests"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="border p-2 mb-2 w-full"
          min="1"
          required
        />
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          showTimeSelect
          className="border p-2 mb-2 w-full"
          required
          placeholderText="Select a date and time"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-3 w-full">
          Book Table
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Existing Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id} className="border-b py-2 flex justify-between items-center">
            <span>
              {booking.name} - {booking.guests} Guests on {new Date(booking.date).toLocaleString()}
            </span>
            <button
              onClick={() => handleDelete(booking._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
