import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [formData, setFormData] = useState({ phoneNumber: "", cardNumber: "", expiry: "", cvv: "", email: "" });
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const receiptNumber = searchParams.get("receiptNumber") || "N/A";
    const navigate = useNavigate();

    const handlePayment = async () => {
        if (!paymentMethod) {
            setError("Please select a payment method.");
            return;
        }

        if (paymentMethod === "mpesa" && !formData.phoneNumber) {
            setError("Enter your M-Pesa phone number.");
            return;
        }

        if (paymentMethod === "card" && (!formData.cardNumber || !formData.expiry || !formData.cvv)) {
            setError("Enter complete card details.");
            return;
        }

        if (paymentMethod === "paypal" && !formData.email) {
            setError("Enter your PayPal email.");
            return;
        }

        setError("");
        alert(`Processing ${paymentMethod.toUpperCase()} payment for Receipt No: ${receiptNumber}`);

        // Simulate payment processing and navigate to success page
        setTimeout(() => {
            navigate("/payment-success");
        }, 2000);
    };

    return (
        <div className="payment-container">
            <h2>Complete Your Payment</h2>
            <p>Receipt Number: <strong>{receiptNumber}</strong></p>

            <div className="payment-methods">
                <button className={paymentMethod === "mpesa" ? "selected" : ""} onClick={() => setPaymentMethod("mpesa")}>
                    Pay with M-Pesa
                </button>
                <button className={paymentMethod === "card" ? "selected" : ""} onClick={() => setPaymentMethod("card")}>
                    Pay with Card
                </button>
                <button className={paymentMethod === "paypal" ? "selected" : ""} onClick={() => setPaymentMethod("paypal")}>
                    Pay with PayPal
                </button>
            </div>

            {paymentMethod === "mpesa" && (
                <div className="payment-form">
                    <label>Phone Number:</label>
                    <input type="text" placeholder="07XXXXXXXX" onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </div>
            )}

            {paymentMethod === "card" && (
                <div className="payment-form">
                    <label>Card Number:</label>
                    <input type="text" placeholder="1234 5678 9012 3456" onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} />
                    <label>Expiry Date:</label>
                    <input type="text" placeholder="MM/YY" onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} />
                    <label>CVV:</label>
                    <input type="text" placeholder="123" onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} />
                </div>
            )}

            {paymentMethod === "paypal" && (
                <div className="payment-form">
                    <label>Email:</label>
                    <input type="email" placeholder="your-email@example.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
            )}

            {error && <p className="error">{error}</p>}

            <button className="pay-btn" onClick={handlePayment}>Pay Now</button>
        </div>
    );
}

export default PaymentPage;
