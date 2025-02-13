import { useState, useEffect } from "react";
import UserNavBar from "../Components/UserNavBar";
import Footer from "../Components/Footer";

function UserBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const email = user?.email;

            if (!email) {
                setError("User email not found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/user-bookings?email=${email}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch bookings");
                }

                const data = await response.json();
                const expandedBookings = data.flatMap((booking) =>
                    booking.seatNo.map((seat) => ({
                        passengerName: user.firstName + " " + user.lastName || "Passenger",
                        flightNumber: booking.flightNumber,
                        origin: booking.origin,
                        destination: booking.destination,
                        date: booking.date,
                        seatNo: seat,
                        gate: "18",
                        time: booking.time,
                        price: booking.price,
                        receiptNumber: booking.receiptNumber, // ✅ Added receipt number
                    }))
                );
                setBookings(expandedBookings);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <UserNavBar />
            <div className="tickets-container">
                {bookings.map((booking, index) => (
                    <div key={index} className="ticket">
                        <div className="ticket-left">
                            <div className="ticket-logo">
                                <h2>Jet Set Airline</h2>
                            </div>
                            <div className="ticket-info">
                                <p>Passenger Name: <strong>{booking.passengerName}</strong></p>
                                <p>From: <strong>{booking.origin}</strong></p>
                                <p>To: <strong>{booking.destination}</strong></p>
                                <p>Date: <strong>{new Date(booking.date).toLocaleDateString()}</strong></p>
                                <p>Flight: <strong>{booking.flightNumber}</strong></p>
                                <p>Gate: <strong>{booking.gate}</strong></p>
                            </div>
                        </div>
                        <div className="ticket-right">
                            <p>Receipt No: <strong>{booking.receiptNumber || "N/A"}</strong></p> {/* ✅ Display receipt number */}
                            <p>Seat: <strong>{booking.seatNo}</strong></p>
                            <p>Time: <strong>{booking.time}</strong></p>
                            <p>Board Till: <strong>{booking.time}</strong></p>
                            <p className="price">Price: <strong>{"ksh. " + booking.price + ".00"}</strong></p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default UserBookings;
