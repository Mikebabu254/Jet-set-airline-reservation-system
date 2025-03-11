const bookingFlights = require("../models/reservationModel");
const Payment = require("../models/paymentModel"); // Import Payment model

const bookFlight = async (req, res) => {
    const { from, to, departureDate, returnDate, price, payed, email } = req.body;

    try {
        // Generate a unique receipt number
        const receiptNumber = "RCPT-" + Math.floor(100000 + Math.random() * 900000);

        const newFlight = await bookingFlights.create({
            from,
            to,
            departureDate,
            returnDate,
            price,
            payed,
            email, // Store the user's email
            receiptNumber, // Store receipt number
        });

        res.status(201).json(newFlight);
    } catch (error) {
        console.error("Error adding flight:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get User Bookings with Payment Details
const getUserBookings = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Fetch reservations for the user
        const userBookings = await bookingFlights.find({ email });

        // Fetch payment details for each reservation
        const enrichedBookings = await Promise.all(
            userBookings.map(async (booking) => {
                const payment = await Payment.findOne({ email, flightNumber: booking.flightNumber });

                return {
                    ...booking.toObject(),
                    paymentStatus: payment ? payment.status : "Unpaid",
                    paidAmount: payment ? payment.totalAmount - payment.balance : 0,
                };
            })
        );

        res.status(200).json(enrichedBookings);
    } catch (err) {
        console.error("Error fetching user bookings:", err);
        res.status(500).json({ message: "Failed to fetch user bookings" });
    }
};

// View all Bookings
const viewBookings = async (req, res) => {
    try {
        const viewBooking = await bookingFlights.find();
        res.json(viewBooking);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

// Count Total Bookings
const countBooking = async (req, res) => {
    try {
        const noOfBooking = await bookingFlights.countDocuments();
        res.json({ noOfBooking });
    } catch (error) {
        console.error("Error counting number of bookings:", error);
        res.status(500).json({ message: "Failed to count bookings" });
    }
};

module.exports = { bookFlight, getUserBookings, viewBookings, countBooking };
