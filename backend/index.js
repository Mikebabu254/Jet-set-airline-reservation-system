const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RegistrationModel = require('./models/registration');
const FlightModel = require("./models/flight");
const { default: FlightSchedule } = require("./models/flight");
const Booking = require("./models/booking");
const AddCityModel = require("./models/addCity");
const app = express();
const session = require("express-session");


app.use(cors());
app.use(express.json());

app.use(
  session({
      secret: "your_secret_key", // Use a strong, random secret key
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false } // Set to true if using HTTPS
  })
);

const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Jetset-airline-reservation", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));



// Registration route
app.post("/registration", (req, res) => {
  const { firstName, lastName, phoneNo, gender, email, DOB, password } = req.body;

  RegistrationModel.findOne({ email })
    .then(user => {
      if (user) {
        res.json("The user already exists");
      } else {
        RegistrationModel.create({
          firstName,
          lastName,
          phoneNo,
          gender,
          email,
          DOB,
          password,
          role: "user",
        })
        .then(result => res.json("Account created successfully"))
        .catch(err => res.json(err));
      }
    })
    .catch(err => res.json(err));
});



// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  RegistrationModel.findOne({ email })
      .then(user => {
          if (user) {
              if (user.password === password) {
                  // Set user data in the session
                  req.session.user = {
                      id: user._id,
                      role: user.role,
                      firstName: user.firstName,
                      email: user.email
                  };

                  res.json({
                      status: "success",
                      role: user.role,
                      user: {
                          firstName: user.firstName,
                          lastName: user.lastName,
                          gender: user.gender,
                          email: user.email,
                          DOB: user.DOB
                      }
                  });
              } else {
                  res.json({ message: "The password is incorrect" });
              }
          } else {
              res.json({ message: "The user does not exist" });
          }
      })
      .catch(err => res.json({ message: "An error occurred", error: err }));
});


//logout API
app.post("/logout", (req, res) => {
  if (req.session) {
      req.session.destroy(err => {
          if (err) {
              res.json({ message: "Logout failed", error: err });
          } else {
              res.json({ status: "success", message: "Logged out successfully" });
          }
      });
  } else {
      res.json({ message: "No active session" });
  }
});




// Route for adding a flight
app.post("/flight-schedule", (req, res) => {
  const { flightNumber, origin, destination, time, date } = req.body;

  FlightModel.create({ flightNumber, origin, destination, time, date })
    .then(flight => res.json({ message: "Flight added successfully", flight }))
    .catch(err => res.json({ message: "Failed to add flight", error: err }));
});


// Route for adding cities
app.post("/add-city", async (req, res) => {
  const { cityCode, countryName, cityName, timeZone } = req.body;

  // Validate request data
  if (!cityCode || !countryName || !cityName || !timeZone) {
      return res.status(400).json({ message: "All fields are required." });
  }

  try {
      // Check if the city code already exists
      const existingCity = await AddCityModel.findOne({ cityCode });
      if (existingCity) {
          return res.status(409).json({ message: "City with this code already exists." });
      }

      // Create a new city entry
      const city = await AddCityModel.create({ cityCode, countryName, cityName, timeZone });
      res.status(201).json({ message: "City added successfully", city });
  } catch (err) {
      res.status(500).json({ message: "Failed to add city", error: err });
  }
});



// Route for getting all cities
app.get("/cities", async (req, res) => {
  try {
      const cities = await AddCityModel.find(); // Fetch all cities from the database
      res.status(200).json(cities); // Send the cities as a response
  } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities." });
  }
});

//Router for fetching cities
app.get("/get-cities", async (req, res) => {
  try {
      const cities = await AddCityModel.find({});
      res.status(200).json(cities);
  } catch (err) {
      res.status(500).json({ message: "Failed to fetch cities", error: err });
  }
});



// Route for getting all flights
app.get("/flight-schedule", async (req, res) => {
  try {
    const flights = await FlightModel.find(); // Fetch all flights from the database
    res.status(200).json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ message: "Failed to fetch flights", error });
  }
});





//Route to get all users details
app.get("/registration", async (req, res) => {
  try{
    const users = await RegistrationModel.find();
    res.status(200).json(users);
  }catch(error){
    console.error("Error fetching the users: ", error);
    res.status(500).json({message: "failed to fetch user data", error});
  }
});


//Route for booking flights
app.post("/bookings", async (req, res) =>{
  try{
    const bookingData = req.body;
    const booking = new Booking(bookingData);
    await booking.save();
    res.status(201).json({ message: "Booking saved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save booking." });
    }
})


// Route for deleting a flight by ID
// app.delete("/flight-schedule/:id", async (req, res) => {
//   try {
//       const flightId = req.params.id;
//       console.log("Deleting flight with ID:", flightId); // Debugging line
//       const deletedFlight = await Flight.findByIdAndDelete(flightId);
//       if (!deletedFlight) {
//           return res.status(404).json({ message: "Flight not found" });
//       }
//       res.status(200).json({ message: "Flight deleted successfully" });
//   } catch (error) {
//       console.error("Error deleting flight:", error);
//       res.status(500).json({ message: "Error deleting flight", error });
//   }
// });

// Delete route for deleting a flight by ID
app.delete("/flight-schedule/:id", async (req, res) => {
  try {
      const flightId = req.params.id;

      // Use FlightModel to delete the flight
      const deletedFlight = await FlightModel.findByIdAndDelete(flightId);

      if (!deletedFlight) {
          return res.status(404).json({ message: "Flight not found" });
      }

      res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
      console.error("Error deleting flight:", error);
      res.status(500).json({ message: "Error deleting flight", error });
  }
});

// Route for deleting a flight by ID
// app.delete("/flight-schedule/:id", async (req, res) => {
//   try {
//     const flightId = req.params.id;
//     const deletedFlight = await FlightModel.findByIdAndDelete(flightId);
//     if (!deletedFlight) {
//       return res.status(404).json({ message: "Flight not found" });
//     }
//     res.status(200).json({ message: "Flight deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting flight:", error);
//     res.status(500).json({ message: "Error deleting flight", error });
//   }
// });




//getting flight by id to edit
app.get("/flight-schedule/:id", async (req, res) => {
  try {
      const flight = await FlightModel.findById(req.params.id);
      if (!flight) return res.status(404).json({ message: "Flight not found" });
      res.status(200).json(flight);
  } catch (error) {
      res.status(500).json({ message: "Error fetching flight", error });
  }
});

//editing flight
app.put("/flight-schedule/:id", async (req, res) => {
  try {
      const updatedFlight = await FlightModel.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
      });
      if (!updatedFlight) return res.status(404).json({ message: "Flight not found" });
      res.status(200).json({ message: "Flight updated successfully", updatedFlight });
  } catch (error) {
      res.status(500).json({ message: "Error updating flight", error });
  }
});


//searching flights
// app.get("/search-flights", async (req, res) => {
//     const { fromLocation, destination, departureDate } = req.query;

//     try {
//         const flights = await FlightModel.find({
//             origin: fromLocation,
//             destination,
//             date: new Date(departureDate).toISOString().split('T')[0], // Match only the date part
//         });

//         res.status(200).json(flights);
//     } catch (error) {
//         console.error("Error searching for flights:", error);
//         res.status(500).json({ message: "Failed to search for flights" });
//     }
// });

// app.get("/search-flights", async (req, res) => {
//   const { fromLocation, destination, departureDate } = req.query;

//   try {
//       // Example database query
//       const flights = await Flight.find({
//           fromLocation,
//           destination,
//           departureDate,
//       });

//       res.json(flights);
//   } catch (error) {
//       console.error("Error fetching flights:", error);
//       res.status(500).send("Internal Server Error");
//   }
// });

app.get("/flight-schedule", (req, res) => {
  const { fromLocation, destination, departureDate } = req.query;

  // Query the database for matching flights
  FlightModel.find({
    origin: fromLocation,
    destination: destination,
    date: departureDate,
  })
    .then(flights => {
      if (flights.length > 0) {
        res.json(flights); // Return the list of flights
      } else {
        res.status(404).json({ message: "No flights found for the given criteria." });
      }
    })
    .catch(err => res.status(500).json({ message: "Error fetching flights", error: err }));
});













app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
