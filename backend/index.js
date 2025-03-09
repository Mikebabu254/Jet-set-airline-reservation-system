const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./routers/userRouter")
const flightRouter = require("./routers/flightRouter")
const cityRouter = require("./routers/cityRouter");
const paymentRouter = require("./routers/paymentRoutes")
const support = require("./controls/supportControl");

const app = express();
const PORT = 3000;

//middle ware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/Jetset-airline-reservation")
.then(()=>{
  console.log("connected successful")
}).catch((Error)=>{
  console.log("not connected", Error)
})

app.use(userRouter)
app.use(flightRouter)
app.use(cityRouter)
app.use(paymentRouter)
app.use(support)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});