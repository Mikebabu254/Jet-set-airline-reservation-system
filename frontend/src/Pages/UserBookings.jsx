import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import JsBarcode from "jsbarcode";
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
                        receiptNumber: booking.receiptNumber,
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

    useEffect(() => {
        bookings.forEach((booking) => {
            if (booking.receiptNumber) {
                const barcodeCanvas = document.getElementById(`barcode-${booking.receiptNumber}`);
                if (barcodeCanvas) {
                    JsBarcode(barcodeCanvas, booking.receiptNumber, {
                        format: "CODE128",
                        width: 1.5,
                        height: 30,
                        displayValue: false,
                    });
                }
            }
        });
    }, [bookings]);

    const generatePDF = async (booking) => {
        const ticketElement = document.getElementById(`ticket-${booking.receiptNumber}`);
        if (!ticketElement) return;

        const canvas = await html2canvas(ticketElement, { scale: 2, backgroundColor: null });
        const ticketImgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("l", "in", [8.5, 3.5]);
        pdf.addImage(ticketImgData, "PNG", 0, 0, 8.5, 3.5);
        pdf.save(`Ticket_${booking.receiptNumber || "unknown"}.pdf`);
    };

    const cancelBooking = async (receiptNumber) => {
        try {
            const response = await fetch(`http://localhost:3000/cancel-booking`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiptNumber }),
            });

            if (!response.ok) {
                throw new Error("Failed to cancel booking");
            }

            setBookings((prevBookings) => prevBookings.filter(booking => booking.receiptNumber !== receiptNumber));
            alert("Booking canceled successfully");
        } catch (error) {
            alert("Error canceling booking: " + error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <UserNavBar />
            <div className="tickets-container">
                {bookings.map((booking, index) => (
                    <div key={index} className="ticket-wrapper">
                        <div id={`ticket-${booking.receiptNumber}`} className="ticket">
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
                                <p>Receipt No: <strong>{booking.receiptNumber || "N/A"}</strong></p>
                                <p>Seat: <strong>{booking.seatNo}</strong></p>
                                <p>Time: <strong>{booking.time}</strong></p>
                                <p>Board Till: <strong>{booking.time}</strong></p>
                                <p className="price">Price: <strong>{"ksh. " + booking.price + ".00"}</strong></p>
                                <div className="barcode-container">
                                    <canvas id={`barcode-${booking.receiptNumber}`} />
                                </div>
                            </div>
                        </div>
                        <button onClick={() => generatePDF(booking)} className="download-btn">
                            Download Ticket as PDF
                        </button>
                        <button onClick={() => cancelBooking(booking.receiptNumber)} className="cancel-btn">
                            Cancel Booking
                        </button>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default UserBookings;
