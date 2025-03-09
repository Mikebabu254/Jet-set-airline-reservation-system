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
        res.json({ message: "Payment record created", paymentId: payment._id, balance: totalAmount });
    } catch (error) {
        res.status(500).json({ error: "Payment initiation failed" });
    }
};

// Make an Installment Payment
const makePayment = async (req, res) => {
    try {
        const { paymentId, amount, method, transactionId } = req.body;
        if (!paymentId || !amount || !method || !transactionId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ error: "Payment record not found" });
        }

        if (amount > payment.balance) {
            return res.status(400).json({ error: "Payment exceeds the remaining balance" });
        }

        // Update the payment record
        payment.amountPaid += amount;
        payment.balance -= amount;
        payment.transactionHistory.push({ amount, method, transactionId });

        // Update status
        if (payment.balance === 0) {
            payment.status = "completed";
        } else {
            payment.status = "partially paid";
        }

        await payment.save();
        res.json({ message: "Payment successful", newBalance: payment.balance, status: payment.status });
    } catch (error) {
        res.status(500).json({ error: "Payment processing failed" });
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
