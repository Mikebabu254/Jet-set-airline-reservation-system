    import { useState } from "react";
    import { useSearchParams, useNavigate } from "react-router-dom";

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
                        method: paymentMethod, // Include the selected payment method
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

                <div className="payment-form">
                    <label>Amount to Pay:</label>
                    <input type="number" placeholder="Enter amount" onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />

                    {paymentMethod === "mpesa" && (
                        <>
                            <label>Phone Number:</label>
                            <input type="text" placeholder="07XXXXXXXX" onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                        </>
                    )}

                    {paymentMethod === "card" && (
                        <>
                            <label>Card Number:</label>
                            <input type="text" placeholder="1234 5678 9012 3456" onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} />
                            <label>Expiry Date:</label>
                            <input type="text" placeholder="MM/YY" onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} />
                            <label>CVV:</label>
                            <input type="text" placeholder="123" onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} />
                        </>
                    )}

                    {paymentMethod === "paypal" && (
                        <>
                            <label>Email:</label>
                            <input type="email" placeholder="your-email@example.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </>
                    )}
                </div>

                {error && <p className="error">{error}</p>}

                <button className="pay-btn" onClick={handlePayment}>Pay Now</button>
            </div>
        );
    }

    export default PaymentPage;
