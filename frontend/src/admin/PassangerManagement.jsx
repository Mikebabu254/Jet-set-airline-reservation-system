import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Import icons

const PassangerManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/all-users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const toggleUserStatus = async (userId) => {
        try {
            await axios.put(`http://localhost:3000/toggle-user/${userId}`);
            fetchUsers();  // Refresh user list
        } catch (error) {
            console.error("Error toggling user status:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Passenger Management</h1>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone No</th>
                        <th>Gender</th>
                        <th>Email</th>
                        <th>DOB</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users
                            .filter(user => user.role !== "admin")  // Exclude admins
                            .map((user) => (
                                <tr key={user._id}>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.phoneNo}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.DOB).toLocaleDateString()}</td>
                                    <td className="text-center">
                                        <button 
                                            className={`btn ${user.isActive ? 'btn-danger' : 'btn-success'}`} 
                                            onClick={() => toggleUserStatus(user._id)}
                                        >
                                            {user.isActive ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No users available.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
};

export default PassangerManagement;
