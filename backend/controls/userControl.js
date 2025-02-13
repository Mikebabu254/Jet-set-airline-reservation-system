const express = require("express")
const userModel = require("../models/userModel")
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JWT library


// Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, phoneNo, gender, email, DOB, password, role } = req.body;

    try {
        // Check if the email or phone number already exists
        const existingUser = await userModel.findOne({
            $or: [{ email: email }, { phoneNo: phoneNo }]
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'Email or phone number is already registered.' 
            });
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create the user
        const UserModel = await userModel.create({ 
            firstName, 
            lastName, 
            phoneNo, 
            gender, 
            email, 
            DOB, 
            password: hashedPassword, // Save the hashed password
            role: "user" 
        });

        res.status(201).json(UserModel);
        console.log({ userModel: email });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated. Contact support." });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }

        // Create a JWT
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

        // Return user details and token
        res.status(200).json({
            status: "login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Toggle user activation
const toggleUserStatus = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Toggle activation status
        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, user });
    } catch (error) {
        console.error("Error toggling user status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const changePassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the current password matches the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // 10 is the salt rounds

        // Update the user's password in the database
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const viewProfile = (req, res)=>{
    try{
        res.json({msg : "view profile"})
    }catch(Error){

    }
}

const allUser = async (req, res) =>{
    try{
        const getUser = await userModel.find()
        res.json(getUser)
    }catch(Error){
        console.log("Error fetching user", Error)
    }
}

const countUsers = async(req, res)=>{
    try{
        const userCount = await userModel.countDocuments();
        res.json({userCount})
    }catch(Error){
        console.log("error encounter while counting")
    }
}

module.exports = {registerUser, loginUser, allUser, countUsers, changePassword, toggleUserStatus}