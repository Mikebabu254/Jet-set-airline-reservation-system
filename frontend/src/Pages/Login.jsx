// Login.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig'; // Import the configured Axios instance

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/login", { email, password });

            if (response.status === 200 && response.data.status === "login successful") {
                const userData = response.data.user;
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("isLoggedIn", true);

                if (userData.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/home-user");
                }
            } else {
                setMessage(response.data.message);
            }
        } catch (err) {
            setMessage("An error occurred. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Login</h2>
                
                <form onSubmit={handleSubmit}>
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

                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>

                {message && (
                    <div className="alert alert-danger mt-3 text-center" role="alert">
                        {message}
                    </div>
                )}

                <div className="text-center mt-3">
                    <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
                    <br />
                    <span>New user? <Link to="/register" className="text-decoration-none">Register here</Link></span><br></br>
                    <span>Visit our <Link to="/" className="text-decoration-none">webpage</Link> for more</span>
                </div>
            </div>
        </div>
    );
}

export default Login;
