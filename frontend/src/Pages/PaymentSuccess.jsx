import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsCheckCircle } from "react-icons/bs"; // Bootstrap Icons

function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card text-center shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <BsCheckCircle size={60} className="text-success mx-auto mb-3" />
                <h2 className="text-success">Payment Successful 🎉</h2>
                <p className="text-muted">Your ticket has been paid successfully.</p>
                <button className="btn btn-dark w-100 mt-3" onClick={() => navigate("/booking")}>
                    View My Tickets
                </button>
            </div>
        </div>
    );
}

export default PaymentSuccess;
