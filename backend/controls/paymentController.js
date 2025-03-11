const Payment = require("../models/paymentModel");
const Reservation = require("../models/reservationModel");

// Initiate Payment (First-time payment setup)
const initiatePayment = async (req, res) => {
    try {
        const { email, totalAmount, method, receiptNumber } = req.body;
        console.log(receiptNumber)
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
const makePayment = async (req, res) => {
    try {
        const { receiptNumber, amountPaid, method } = req.body;
        console.log(receiptNumber)
        if (!receiptNumber || !amountPaid || !method) {
            return res.status(400).json({ error: "Receipt number, amount, and payment method are required" });
        }

        // Find the reservation using the receipt number
        const reservation = await Reservation.findOne({ receiptNumber });

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        const { email, price, flightNumber } = reservation;

        // Find or create payment record
        let payment = await Payment.findOne({ email, flightNumber });

        if (!payment) {
            payment = new Payment({
                email,
                totalAmount: price,
                balance: price,
                method,
                receiptNumber, // Store the flight number
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

        // Add to transaction history
        payment.transactionHistory.push({
            amount: amountPaid,
            method,
            transactionId: `TXN-${Date.now()}`, // Generate a dummy transaction ID
        });

        payment.status = payment.balance === 0 ? "completed" : "partially paid";

        await payment.save();

        res.json({
            message: "Payment successful",
            flightNumber: payment.flightNumber,
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

// Get Ticket Details (Includes Flight Number and Balance)
const getTicketDetails = async (req, res) => {
    try {
        const { email } = req.params;

        // Find the latest payment record for the user
        const payment = await Payment.findOne({ email }).sort({ createdAt: -1 });

        if (!payment) {
            return res.status(404).json({ error: "No payment record found" });
        }

        res.json({
            message: "Ticket details retrieved",
            receiptNumber: payment.receiptNumber,
            totalAmount: payment.totalAmount,
            amountPaid: payment.totalAmount - payment.balance,
            balance: payment.balance,
            status: payment.status,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { initiatePayment, makePayment, getPaymentStatus, getTicketDetails };
