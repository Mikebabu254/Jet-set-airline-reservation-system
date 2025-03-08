const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true }, // Total amount due
    amountPaid: { type: Number, default: 0 }, // Amount paid so far
    balance: { type: Number, required: true }, // Remaining balance
    method: { type: String, enum: ["card", "mpesa", "paypal"], required: true },
    status: { type: String, enum: ["pending", "partially paid", "completed"], default: "pending" },
    transactionHistory: [
        {
            amount: Number,
            method: String,
            transactionId: String,
            date: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
