const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Configure CORS with explicit options
app.use(cors({
    origin: 'https://neinafull-front1.onrender.com', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // If using cookies or authentication headers
}));



// Apply CORS middleware



// app.use(
// 	cors({
// 		origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
// 		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// 		credentials:true,
// 	})
// )
// ;
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://shivamyadav2113128:9o67AjZt72AKXHun@intern.iq67n.mongodb.net/?retryWrites=true&w=majority&appName=intern/restaurant-booking').then(
  console.log("Database connection successfully established")
).catch((err)=>{
  console.log("Error connecting to Mongo");
  console.error(err);});

// Schema & Model
const bookingSchema = new mongoose.Schema({
  name: String,
  contact: String,
  guests: Number,
  date: Date,
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes
app.post('/api/bookings', async (req, res) => {
  const { name, contact, guests, date } = req.body;

  // Validate input fields
  if (!name || !contact || !guests || !date) {
    return res.status(400).send('Missing required fields');
  }

  try {
    // Check if a booking with the same name and contact already exists
    const existingBooking = await Booking.findOne({date});

    if (existingBooking) {
      return res.status(400).send('Booking already exists with the same name and contact');
    }

    // If no existing booking, create a new one
    const booking = new Booking(req.body);
    await booking.save();
    return res.status(201).json({
      success:true ,
      message:"booking successfully",

     });
  } catch (err) {
     return res.status(500).send('Error Saving Booking');
  }
});

app.get('/api/bookings', async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

// DELETE Route to remove a booking based on contact and name
// Assuming API_URL is set to 'https://neinafull-bac.onrender.com'
const API_URL = 'https://neinafull-bac.onrender.com';

// Function to delete a booking
const deleteBooking = (id) => {
  axios.delete(`${API_URL}/api/bookings/${id}`)
    .then(response => {
      console.log('Booking successfully deleted:', response.data);
      // Update your UI accordingly
    })
    .catch(error => {
      console.error('Error deleting booking:', error);
      // Handle the error in the UI
    });
};


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Server running on http://localhost:5000');
});
