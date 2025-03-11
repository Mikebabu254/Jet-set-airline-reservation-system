import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [formData, setFormData] = useState({ phoneNumber: "", cardNumber: "", expiry: "", cvv: "", email: "", amount: "" });
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const receiptNumber = searchParams.get("receiptNumber") || "N/A";
    const navigate = useNavigate();

    const handlePayment = async () => {
        if (!paymentMethod) {
            setError("Please select a payment method.");
            return;
        }

        const amountPaid = parseFloat(formData.amount);

        if (isNaN(amountPaid) || amountPaid <= 0) {
            setError("Enter a valid amount.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/pay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiptNumber,
                    amountPaid,
                    email: formData.email,
                    method: paymentMethod,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Payment failed");
            }

            alert("Payment successful! Remaining balance: " + result.newBalance);
            navigate("/payment-success");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center">Complete Your Payment</h3>
                <p className="text-center text-muted">
                    Receipt Number: <strong>{receiptNumber}</strong>
                </p>

                {/* Payment Method Selection */}
                <div className="d-flex justify-content-between mb-3">
                    <button 
                        className={`btn ${paymentMethod === "mpesa" ? "btn-success" : "btn-outline-success"} flex-grow-1 me-2`} 
                        onClick={() => setPaymentMethod("mpesa")}>
                        M-Pesa
                    </button>
                    <button 
                        className={`btn ${paymentMethod === "card" ? "btn-primary" : "btn-outline-primary"} flex-grow-1 me-2`} 
                        onClick={() => setPaymentMethod("card")}>
                        Card
                    </button>
                    <button 
                        className={`btn ${paymentMethod === "paypal" ? "btn-warning" : "btn-outline-warning"} flex-grow-1`} 
                        onClick={() => setPaymentMethod("paypal")}>
                        PayPal
                    </button>
                </div>

                {/* Payment Form */}
                <div>
                    <div className="mb-3">
                        <label className="form-label">Amount to Pay</label>
                        <input type="number" className="form-control" placeholder="Enter amount"
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                    </div>

                    {paymentMethod === "mpesa" && (
                        <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-control" placeholder="07XXXXXXXX"
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                        </div>
                    )}

                    {paymentMethod === "card" && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Card Number</label>
                                <input type="text" className="form-control" placeholder="1234 5678 9012 3456"
                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Expiry Date</label>
                                    <input type="text" className="form-control" placeholder="MM/YY"
                                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">CVV</label>
                                    <input type="text" className="form-control" placeholder="123"
                                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} />
                                </div>
                            </div>
                        </>
                    )}

                    {paymentMethod === "paypal" && (
                        <div className="mb-3">
                            <label className="form-label">PayPal Email</label>
                            <input type="email" className="form-control" placeholder="your-email@example.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Pay Button */}
                <button className="btn btn-dark w-100" onClick={handlePayment}>Pay Now</button>
            </div>
        </div>
    );
}

export default PaymentPage;
