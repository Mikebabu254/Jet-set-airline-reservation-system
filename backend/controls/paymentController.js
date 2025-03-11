const Payment = require("../models/paymentModel");
const Reservation = require("../models/reservationModel")

// Initiate Payment (First-time payment setup)
const initiatePayment = async (req, res) => {
    try {
        const { email, totalAmount, method } = req.body;
        if (!email || !totalAmount || !method) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const payment = new Payment({
            email,
            totalAmount,
            balance: totalAmount, // Initially, balance is the total amount
            method,
        });

        await payment.save();
        res.json({ message: "Payment record created", paymentId: payment._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Make Payment (Full or Partial)
// const Reservation = require("../models/reservationModel"); // Import reservation model
// const Payment = require("../models/paymentModel"); // Import payment model

const makePayment = async (req, res) => {
    try {
        const { receiptNumber, amountPaid, method } = req.body;
        console.log(method)

        if (!receiptNumber || !amountPaid || !method) {
            return res.status(400).json({ error: "Receipt number, amount, and payment method are required" });
        }

        // Find the reservation using the receipt number
        const reservation = await Reservation.findOne({ receiptNumber });

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        const { email, price } = reservation; // Extract email and price

        // Check if a payment record already exists for this user
        let payment = await Payment.findOne({ email });

        if (!payment) {
            // If no payment exists, create a new one
            payment = new Payment({
                email,
                totalAmount: price, // Set total amount as the reservation price
                balance: price, // Initial balance is the full price
                method,
            });
        }

        if (amountPaid <= 0) {
            return res.status(400).json({ error: "Invalid payment amount" });
        }

        if (amountPaid > payment.balance) {
            return res.status(400).json({ error: "Amount exceeds remaining balance" });
        }

        // Deduct payment amount
        payment.balance -= amountPaid;

        if (payment.balance === 0) {
            payment.status = "paid"; // Mark as fully paid
        }

        await payment.save(); // Save the updated payment record

        res.json({
            message: "Payment successful",
            newBalance: payment.balance,
            status: payment.status,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Get Payment Status
const getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { initiatePayment, makePayment, getPaymentStatus };
