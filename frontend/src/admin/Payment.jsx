import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch all payments from the backend
        const fetchPayments = async () => {
            try {
                const response = await fetch("http://localhost:3000/payments");
                const data = await response.json();
                setPayments(data);
            } catch (error) {
                console.error("Error fetching payments:", error);
            }
        };

        fetchPayments();
    }, []);

    // Filter payments based on search input
    const filteredPayments = payments.filter(payment =>
        payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Admin - All Payments</h2>

            {/* Search Bar */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by Email or Receipt Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Payment Table */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Receipt No</th>
                            <th>Amount</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Method</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment, index) => (
                                <tr key={payment._id}>
                                    <td>{index + 1}</td>
                                    <td>{payment.email}</td>
                                    <td>{payment.receiptNumber}</td>
                                    <td>Ksh {payment.totalAmount.toFixed(2)}</td>
                                    <td>Ksh {(payment.totalAmount - payment.balance).toFixed(2)}</td>
                                    <td>Ksh {payment.balance.toFixed(2)}</td>
                                    <td>{payment.method}</td>
                                    <td>
                                        <span className={`badge ${payment.balance === 0 ? "bg-success" : "bg-warning"}`}>
                                            {payment.balance === 0 ? "Completed" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">No payments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPayments;
