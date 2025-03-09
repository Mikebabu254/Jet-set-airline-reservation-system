import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <div className="payment-container">
            <h2>Payment Successful 🎉</h2>
            <p>Your ticket has been paid successfully.</p>
            <button className="pay-btn" onClick={() => navigate("/booking")}>View My Tickets</button>
        </div>
    );
}

export default PaymentSuccess;
