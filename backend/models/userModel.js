const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNo: String,
    gender: String,
    email: String,
    DOB: String,
    password: String,
    role: String,
    isActive: { type: Boolean, default: true }  // New field for activation status
});

module.exports = mongoose.model("user", registrationSchema);
