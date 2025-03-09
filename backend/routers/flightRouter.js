const express = require("express")
const router = express.Router()
const {addFlight, deleteFlight, viewFlight, modifyFlight, viewAllFlights, bookFlight, countFlight, seatBookFlight, checkingSeat, cancelBooking} = require("../controls/flightControl")
const {getUserBookings, viewBookings, countBooking} = require("../controls/reservationControl")

router.post("/flight-schedule",addFlight)
router.delete("/delete-flight/:id", deleteFlight)
router.get("/view-flight/:id", viewFlight)
router.put("/modifyFlight/:id", modifyFlight)
router.get("/view-all-flight", viewAllFlights)
router.post("/booking-flight", bookFlight)
router.get("/user-bookings", getUserBookings)
router.get("/view-bookings", viewBookings)
router.get("/count-flight", countFlight)
router.get("/count-booking", countBooking)
router.get("/seat-book-flight", checkingSeat)
router.patch("/seat-book-flight", seatBookFlight); 
router.post("/cancel-booking", cancelBooking);


module.exports = router