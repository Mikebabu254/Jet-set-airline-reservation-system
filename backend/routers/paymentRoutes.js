const express = require("express");
const { initiatePayment, makePayment, getPaymentStatus } = require("../controls/paymentController");

const router = express.Router();

router.post("/initiate", initiatePayment); // Create payment record
router.post("/pay", makePayment); // Make installment payments
router.get("/:paymentId", getPaymentStatus); // Get payment status

module.exports = router;
