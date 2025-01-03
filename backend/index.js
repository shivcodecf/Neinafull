const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Configure CORS with explicit options
app.use(cors({
    origin: 'https://neinafull-fro1.onrender.com', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // If using cookies or authentication headers
}));

app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://shivamyadav2113128:9o67AjZt72AKXHun@intern.iq67n.mongodb.net/restaurant_booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connection successfully established");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Schema & Model
const bookingSchema = new mongoose.Schema({
    name: String,
    contact: String,
    guests: Number,
    date: String, // Ensure consistent format (e.g., YYYY-MM-DD)
    time: String, // Add time for precise slot management
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes
// Create a new booking
app.post('/api/bookings', async (req, res) => {
    const { name, contact, guests, date, time } = req.body;

    // Validate input fields
    if (!name || !contact || !guests || !date || !time) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        // Check if a booking with the same date and time already exists
        const existingBooking = await Booking.findOne({ date, time });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: 'Time slot already booked' });
        }

        // If no existing booking, create a new one
        const booking = new Booking({ name, contact, guests, date, time });
        await booking.save();
        return res.status(201).json({ success: true, message: 'Booking successfully created', booking });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error saving booking' });
    }
});

// Fetch all bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        return res.status(200).json(bookings);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
});

// Delete a booking by ID
app.delete('/api/bookings/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        return res.status(200).json({ success: true, message: 'Booking successfully deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error deleting booking' });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
