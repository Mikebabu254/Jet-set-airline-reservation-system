const bookingFlights = require("../models/reservationModel")

const bookFlight = async (req, res)=>{
    const { from, to, departureDate, returnDate, price, payed } = req.body;

    try {
        const newFlight = await bookingFlights.create({
          from,
          to,
          departureDate,
          returnDate,
          price,
          payed,
        });
    
        res.status(201).json(newFlight); 
        console.log(newFlight)
    } catch (error) {
        console.error("Error adding flight:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getUserBookings = async (req, res) => {
    const { email } = req.query; // Use req.query to match the frontend request

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const userBookings = await bookingFlights.find({ email });
        res.status(200).json(userBookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch user bookings" });
    }
};

const viewBookings = async (rqe, res)=>{
    try{
        const ViewBooking = await bookingFlights.find()
        res.json(ViewBooking)
    }catch(Error){
        console.log("error fetching bookings")
    }
}


module.exports = {bookFlight, getUserBookings, viewBookings}