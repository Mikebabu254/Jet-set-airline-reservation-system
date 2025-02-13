const mongoose = require("mongoose");

const bookingFlightsSchema = new mongoose.Schema({
    flightNumber: String,
    origin: String,
    destination: String,
    time: String,
    date: String,
    seatNo: [Number], // Array to store multiple selected seats
    price: String,
    firstName: String,
    email: String,
    receiptNumber: String,
});

module.exports = mongoose.model("BookingFlight", bookingFlightsSchema);
