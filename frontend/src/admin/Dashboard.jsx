import React, { useEffect, useState } from "react";
import { Card, Row, Col, ProgressBar, Table, Spinner } from "react-bootstrap";
import { FaUsers, FaPlane, FaCity, FaClipboardList } from "react-icons/fa";
import axios from "axios";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(null);
  const [flightCount, setFlightCount] = useState(null);
  const [cityCount, setCityCount] = useState(null);
  const [bookingCount, setBookingCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewBooking, setViewBooking] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {

        const usersRes = await axios.get("http://localhost:3000/users-total");
        setUserCount(usersRes.data.userCount);

        const flightsRes = await axios.get("http://localhost:3000/count-flight");
        setFlightCount(flightsRes.data.flightCount);

        const citiesRes = await axios.get("http://localhost:3000/number-of-cities");
        setCityCount(citiesRes.data.numberOfCities);

        const bookingsRes = await axios.get("http://localhost:3000/count-booking");
        setBookingCount(bookingsRes.data.noOfBooking);

        const veiewBookingRes = await axios.get("http://localhost:3000/view-bookings");
        setViewBooking(veiewBookingRes.data);

      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Unable to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} >
          <Card className="text-center shadow-sm border-0 bg-info" id="booking-card">
            <Card.Body>
              <FaUsers size={40} className="text-primary mb-2" />
              <h5>Total Users</h5>
              <h3>
                {loading ? <Spinner animation="border" size="sm" /> : userCount}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-info" id="booking-card">
            <Card.Body>
              <FaPlane size={40} className="text-success mb-2" />
              <h5>Flights Scheduled</h5>
              <h3>
                {loading ? <Spinner animation="border" size="sm" /> : flightCount}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-info" id="booking-card">
            <Card.Body>
              <FaCity size={40} className="text-warning mb-2" />
              <h5>Cities</h5>
              <h3>
                {loading ? <Spinner animation="border" size="sm" /> : cityCount}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 bg-info " id="booking-card">
            <Card.Body>
              <FaClipboardList size={40} className="text-danger mb-2" />
              <h5>Bookings</h5>
              <h3>
                {loading ? <Spinner animation="border" size="sm" /> : bookingCount}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <row>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Flight No</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Time</th>
              <th>Date</th>
              <th>Seat(s)</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {viewBooking.slice(-6).map((booking) => (
              <tr key={booking.id}>
                <td>{booking.flightNumber}</td>
                <td>{booking.origin}</td>
                <td>{booking.destination}</td>
                <td>{booking.time}</td>
                <td>{booking.date}</td>
                <td>{Array.isArray(booking.seatNo) ? booking.seatNo.join(', '): booking.seatNo}</td>
                <td>{booking.firstName}</td>
                <td>{booking.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </row>
    </div>
  );
};

export default Dashboard;
