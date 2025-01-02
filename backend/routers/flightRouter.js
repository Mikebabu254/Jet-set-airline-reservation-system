const express = require("express")
const router = express.Router()
const {addFlight, deleteFlight, viewFlight, modifyFlight, viewAllFlights, bookFlight} = require("../controls/flightControl")

router.post("/flight-schedule",addFlight)
router.delete("/delete-flight/:id", deleteFlight)
router.get("/view-flight/:id", viewFlight)
router.put("/modifyFlight/:id", modifyFlight)
router.get("/view-all-flight", viewAllFlights)
router.post("/booking-flight", bookFlight)



module.exports = router