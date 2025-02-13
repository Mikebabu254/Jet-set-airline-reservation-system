const express = require("express");
const flightModel = require("../models/flightModel");
const bookingFlights = require("../models/reservationModel")
const SeatBooking = require("../models/SeatBooking")

// adding flight
const addFlight = async (req, res) => {
  const {flightNumber, origin, destination, time, date, noOfSeats, price} = req.body;

  try {
    const newFlight = await flightModel.create({
      flightNumber,
      origin,
      destination,
      time,
      date,
      noOfSeats,
      price
    });
    res.status(201).json(newFlight); 
  } catch (error) {
    console.error("Error adding flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const bookFlight = async (req, res) => {
  const { flightNumber, origin, destination, time, date, selectedSeats, price, firstName, email, receiptNumber} = req.body;
  try {
      // Fetch the flight bookings to check for already booked seats
      const existingBookings = await bookingFlights.find({ 
          flightNumber, 
          date, 
          seatNo: { $in: selectedSeats }
      });

      if (existingBookings.length > 0) {
          const bookedSeats = existingBookings.map((booking) => booking.seatNo).flat();
          return res.status(400).json({
              message: "Some seats have already been booked.",
              bookedSeats,
          });
      }

      // Proceed with booking if seats are available
      const newFlight = await bookingFlights.create({
          flightNumber,
          origin,
          destination,
          time,
          date,
          seatNo: selectedSeats,
          price,
          firstName,
          email,
          receiptNumber,
      });

      res.status(201).json(newFlight);
  } catch (error) {
      console.error("Error booking flight:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const seatBookFlight = async (req, res) => {
  const { flightNumber, origin, destination, time, date, selectedSeats } = req.body;

  try {
      // Find the existing booking for the flight and date
      const existingBooking = await SeatBooking.findOne({ flightNumber, date });

      if (existingBooking) {
          // Update the existing booking with new seats (add unique entries)
          await SeatBooking.updateOne(
              { _id: existingBooking._id },
              { $addToSet: { seatNo: { $each: selectedSeats } } }
          );
          return res.status(200).json({ message: "Booking successful!" });
      } else {
          // No existing booking, proceed with creating a new one
          const newFlight = await SeatBooking.create({
              flightNumber,
              origin,
              destination,
              time,
              date,
              seatNo: selectedSeats, 
          });

          res.status(201).json(newFlight);
      }
  } catch (error) {
      console.error("Error booking flight:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const checkingSeat = async (req, res) => {
  try{
    const checkAllSeat = await SeatBooking.find()
    res.json(checkAllSeat) 
  }catch(Error){
    res.json("Error fetching data")
  }
}


// deleting flight
const deleteFlight = async (req, res) => {
  try {
    const { id } = req.params; 
    const deletedFlight = await flightModel.findByIdAndDelete(id); 

    if (!deletedFlight) {
      return res.status(404).json({ message: 'Flight not found' }); 
    }

    res.status(200).json({ message: 'Flight deleted successfully' }); 
  } catch (error) {
    console.error("Error deleting flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// view all flights
const viewAllFlights = async (req, res) => {
    try {
        const { destination, origin, date } = req.query; // Get filters from query parameters

        let filter = {};
        if (destination) filter.destination = { $regex: destination, $options: 'i' }; // Case-insensitive
        if (origin) filter.origin = { $regex: origin, $options: 'i' };
        if (date) filter.date = date;

        const flights = await flightModel.find(filter); // Apply the filters
        res.json(flights);
    } catch (error) {
        console.error("Error viewing flights:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// viewing a single flight
const viewFlight = async (req, res) => {
  try {
    const { id } = req.params; // Get flight ID from URL parameters
    const flight = await flightModel.findById(id); 

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' }); 
    }

    res.status(200).json(flight); 
  } catch (error) {
    console.error("Error viewing flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// editing flight
const modifyFlight = async (req, res) => {
  try {
    const { id } = req.params; 
    const { flightNumber, origin, destination, time, date, noOfSeats, price  } = req.body;
    const updatedFlight = await flightModel.findByIdAndUpdate(
      id, 
      {flightNumber, origin, destination, time, date, noOfSeats, price  }, 
      { new: true } // Return the updated document
    );

    if (!updatedFlight) {
      return res.status(404).json({ message: 'Flight not found' }); 
    }

    res.status(200).json(updatedFlight); 
  } catch (error) {
    console.error("Error modifying flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const countFlight = async (req, res) =>{
  try{
    const flightCount = await flightModel.countDocuments();
    res.json({flightCount})
  }catch(Error){
    console.log("error counting the flight")
  }
}

module.exports = { addFlight, deleteFlight, viewFlight, modifyFlight, viewAllFlights, bookFlight, countFlight, seatBookFlight, checkingSeat};