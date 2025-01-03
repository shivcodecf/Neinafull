import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast';


export default function Home() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [errors, setErrors] = useState({});

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

  // Validate fields
  const validateFields = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (/\d/.test(name)) {
      newErrors.name = 'Name should not contain numbers.';
    }

    if (!contact.trim() || !/^\d{10}$/.test(contact)) {
      newErrors.contact = 'Valid contact number is required (10 digits).';
    }

    if (guests <= 0) {
      newErrors.guests = 'Number of guests must be at least 1.';
    }

    if (!date || new Date(date) < new Date()) {
      newErrors.date = 'Date and time must be in the future.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit a new booking to the backend
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const bookingData = {
      name,
      contact,
      guests,
      date,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', bookingData);
      toast.success('Booking Successful');
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

  // Delete a booking
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Error deleting booking');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50

 flex flex-col items-center py-10 px-5">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-center">Restaurant Table Booking</h1>
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-5">
        <form onSubmit={handleBooking} className="mb-5">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`border p-3 w-full rounded-md focus:ring focus:ring-blue-300 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your contact number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={`border p-3 w-full rounded-md focus:ring focus:ring-blue-300 ${
                errors.contact ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Number of guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={`border p-3 w-full rounded-md focus:ring focus:ring-blue-300 ${
                errors.guests ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
            />
            {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
          </div>
          <div className="mb-4">
            <DatePicker
              selected={date}
              onChange={(selectedDate) => setDate(selectedDate)}
              showTimeSelect
              className={`border p-3 w-full rounded-md focus:ring focus:ring-blue-300 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholderText="Select a date and time"
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
          >
            Book Table
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg mt-10 p-5">
        <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
        <ul>
          {bookings
            .filter((booking) => new Date(booking.date) >= new Date())
            .map((booking) => (
              <li
                key={booking._id}
                className="border-b py-4 flex justify-between items-center last:border-b-0"
              >
                <span className="text-gray-700">
                  <span className='font-bold'>{booking.name}</span> - {booking.guests} Guests on{' '}
                  {new Date(booking.date).toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
