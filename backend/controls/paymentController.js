const Payment = require("../models/paymentModel");
const Booking = require("../models/reservationModel")

// Initiate Payment (First-time payment setup)
const initiatePayment = async (req, res) => {
    try {
        const { userId, totalAmount, method } = req.body;
        if (!userId || !totalAmount || !method) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const payment = new Payment({
            userId,
            totalAmount,
            balance: totalAmount, // Initially, balance is the total amount
            method,
        });

        await payment.save();
        res.json({ message: "Payment record created", paymentId: payment._id, balance: totalAmount });
    } catch (error) {
        res.status(500).json({ error: "Payment initiation failed" });
    }
};

// Make an Installment Payment
const makePayment = async (req, res) => {
    try {
        const { receiptNumber, amount, method, details } = req.body;

        if (!receiptNumber || !amount || !method) {
            return res.status(400).json({ error: "Receipt Number, amount, and method are required" });
        }

        const booking = await Booking.findOne({ receiptNumber });
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if (booking.status === "paid") {
            return res.status(400).json({ error: "Booking is already paid" });
        }

        // Simulate successful payment (you can integrate actual payment gateway logic here)
        booking.status = "paid";
        await booking.save();

        res.json({ message: "Payment successful", status: "paid" });
    } catch (error) {
        res.status(500).json({ error: "Error processing payment", details: error.message });
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

        res.json({ 
            totalAmount: payment.totalAmount,
            amountPaid: payment.amountPaid,
            balance: payment.balance,
            status: payment.status,
            transactionHistory: payment.transactionHistory,
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching payment status" });
    }
};

module.exports = { initiatePayment, makePayment, getPaymentStatus };
