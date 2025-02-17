import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const ViewBooking = () => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState(null);

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    // Handle update logic here
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      // Handle delete logic here
      console.log(`Deleted booking with ID: ${id}`);
    }
  };

  const [allBooking, setAllBooking] = useState([]);

  useEffect (()=>{
    const fetchBooking = async()=>{
      try{
        const response = await axios.get("http://localhost:3000/view-bookings")
        setAllBooking(response.data)
      }catch(error){
        console.log("Error fetching booking", error)
      }
    }
    fetchBooking();
  }, [])

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Manage Bookings</h2>
      <Table striped bordered hover className="shadow-sm">
        <thead className="bg-primary text-white">
          <tr>
            <th>Flight No</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Time</th>
            <th>Date</th>
            <th>Seat(s)</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allBooking.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.flightNumber}</td>
              <td>{booking.origin}</td>
              <td>{booking.destination}</td>
              <td>{booking.time}</td>
              <td>{booking.date}</td>
              <td>{Array.isArray(booking.seatNo) ? booking.seatNo.join(', '): booking.seatNo}</td>
              <td>{booking.firstName}</td>
              <td>{booking.email}</td>              
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(booking)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(booking.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Passenger Name</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedBooking.name}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Flight</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedBooking.flight}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select defaultValue={selectedBooking.status}>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Canceled">Canceled</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewBooking;
