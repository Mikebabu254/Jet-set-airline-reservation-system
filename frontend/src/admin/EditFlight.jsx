import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EditFlight = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!isLoggedIn || !user || user.role !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    const [flightNumber, setFlightNumber] = useState("");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [noOfSeats, setNoOfSeats] = useState("");
    const [price, setPrice] = useState("");
    const [cities, setCities] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (origin && destination && date && time) {
            const originLetter = origin.charAt(0).toUpperCase();
            const destinationLetter = destination.charAt(0).toUpperCase();

            // Extract hour (HH) from the selected time (e.g., "06:30")
            const timeHour = time.split(":")[0];

            // Date formatted as MMDDYY
            const dateObj = new Date(date);
            const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Get month and pad to 2 digits
            const day = String(dateObj.getDate()).padStart(2, "0"); // Get day and pad to 2 digits
            const year = String(dateObj.getFullYear()).slice(-2); // Get last 2 digits of the year

            const dateFormatted = `${month}${day}${year}`;

            setFlightNumber(`${originLetter}${destinationLetter}${timeHour}${dateFormatted}`);
        } else {
            // setFlightNumber(flightData.flightNumber); // Reset flight number if inputs are incomplete
        }
    }, [origin, destination, date, time]);

    useEffect(() => {
        const fetchFlightDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/view-flight/${id}`);
                const flightData = response.data;
                setFlightNumber(flightData.flightNumber);
                setOrigin(flightData.origin);
                setDestination(flightData.destination);
                setTime(flightData.time);
                setDate(flightData.date);
                setNoOfSeats(flightData.noOfSeats);
                setPrice(flightData.price);
            } catch (error) {
                console.error("Error fetching flight details:", error);
            }
        };
        fetchFlightDetails();
    }, [id]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get("http://localhost:3000/get-cities");
                setCities(response.data);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };
        fetchCities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (origin === destination) {
            setError("Origin and destination cannot be the same.");
            return;
        }
        setError("");
        try {
            await axios.put(`http://localhost:3000/modifyFlight/${id}`, {
                flightNumber,
                origin,
                destination,
                time,
                date,
                noOfSeats,
                price,
            });
            alert("Flight updated successfully");
            navigate("/Admin");
        } catch (error) {
            console.error("Error updating flight:", error);
            alert("Failed to update flight");
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Edit Flight</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="flightNumber">Flight Number</label>
                    <input type="text" className="form-control" id="flightNumber" value={flightNumber} disabled />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="noOfSeats">No of Seats</label>
                    <select className="form-control" id="noOfSeats" value={noOfSeats} onChange={(e) => setNoOfSeats(e.target.value)} required>
                        <option value="">Select Number of Seats</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="78">78</option>
                        <option value="84">84</option>
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="origin">Origin</label>
                    <select className="form-control" id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} required>
                        <option value="">Select Origin City</option>
                        {cities.map((city) => (
                            <option key={city._id.$oid} value={city.cityName}>{city.cityName}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="destination">Destination</label>
                    <select className="form-control" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} required>
                        <option value="">Select Destination City</option>
                        {cities.map((city) => (
                            <option key={city._id.$oid} value={city.cityName}>{city.cityName}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="time">Time</label>
                    <select className="form-control" id="time" value={time} onChange={(e) => setTime(e.target.value)} required>
                        <option value="" disabled>Select a time</option>
                        <option value="06:30">6:30 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="15:30">3:30 PM</option>
                        <option value="18:30">6:30 PM</option>
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="date">Date</label>
                    <input type="date" className="form-control" id="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="price">Price</label>
                    <input type="number" className="form-control" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success">Update Flight</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/Admin")}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditFlight;
