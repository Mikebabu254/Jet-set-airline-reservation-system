const Payment = require("../models/paymentModel");

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
        res.json({ message: "Payment record created", paymentId: payment._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Make Payment (Full or Partial)
const makePayment = async (req, res) => {
    try {
        const { receiptNumber, amountPaid } = req.body;

        if (!receiptNumber || !amountPaid) {
            return res.status(400).json({ error: "Receipt number and amount are required" });
        }

        const payment = await Payment.findOne({ receiptNumber });

        if (!payment) {
            return res.status(404).json({ error: "Payment record not found" });
        }

        if (amountPaid <= 0) {
            return res.status(400).json({ error: "Invalid payment amount" });
        }

        if (amountPaid > payment.balance) {
            return res.status(400).json({ error: "Amount exceeds remaining balance" });
        }

        payment.balance -= amountPaid;
        if (payment.balance === 0) {
            payment.status = "paid"; // Mark as fully paid
        }

        await payment.save();

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
