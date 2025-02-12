    import React, { useState } from 'react';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import { Link } from 'react-router-dom';
    import axios from "axios";

    function Registration() {
        
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");
        const [phoneNo, setPhoneNo] = useState("");
        const [gender, setGender] = useState("");
        const [email, setEmail] = useState("");
        const [DOB, setDOB] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [message, setMessage] = useState("");
        const[status, setStatus] = useState("user");
        
        const handleSubmit = (e) => {
            e.preventDefault();

            // Confirm passwords match
            if (password !== confirmPassword) {
                setMessage("Passwords do not match!");
                return;
            }

            // Check if password length is at least 6 characters
            if (password.length < 6) {
                setMessage("Password should be at least 6 characters long!");
                return;
            }

            axios.post('http://localhost:3000/registration', { 
                firstName, 
                lastName, 
                phoneNo, 
                gender, 
                email, 
                DOB, 
                password, 
                role: status 
            })
                .then(result => {
                    setMessage(result.data); 
                    setMessage("user has been registered successful");
                })
                .catch(err => {
                    setMessage("An error occurred. Please try again.");
                    console.log(err);
                });
        }

        return (
            <div className="container d-flex justify-content-center align-items-center " style={{margin: '100px'}}>
                <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%'}}>
                    <h2 className="text-center mb-4">Create an Account</h2>
                    
                    <form onSubmit={handleSubmit}> 
                        {/* First Name Input */}
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="firstName" 
                                placeholder="Enter your first name"
                                required 
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        {/* Last Name Input */}
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="lastName" 
                                placeholder="Enter your last name" 
                                required 
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="mb-3">
                            <label htmlFor="phoneNo" className="form-label">Phone Number</label>
                            <input 
                                type="tel"
                                className="form-control"
                                id="phoneNo"
                                placeholder="Enter your phone number"
                                required
                                onChange={(e) => setPhoneNo(e.target.value)}
                            />
                        </div>

                        {/* Gender Dropdown */}
                        <div className="mb-3">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <select className="form-select" id="gender" required onChange={(e) => setGender(e.target.value)}>
                                <option value="">Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div className="d-flex flex-column mb-3">
                            <label htmlFor="DOB" className="form-label">Date of Birth</label>
                            <input 
                                type="date"
                                id="DOB"
                                required
                                className="form-control"
                                max={new Date().toISOString().split("T")[0]} // Sets max to today's date
                                onChange={(e) => setDOB(e.target.value)}
                            />
                        </div>

                        {/* Email Input */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                placeholder="Enter your email" 
                                required 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="password" 
                                placeholder="Enter your password" 
                                required 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="confirmPassword" 
                                placeholder="Confirm your password" 
                                required 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* Register Button */}
                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>

                    {/* Feedback Message */}
                    {message && (
                        <div className="alert alert-info mt-3 text-center" role="alert">
                            {message}
                        </div>
                    )}

                    {/* Login Link */}
                    <div className="text-center mt-3">
                        <span>Already have an account? <Link to="/login" className="text-decoration-none">Login</Link></span>
                    </div>
                </div>
            </div>
        );
    }

    export default Registration;
