const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require('cors');
const multer = require('multer')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const stripe = require('stripe')("sk_test_51OY48pCg3UF6njdMIGMex9SQFX49Hl36mb8yI20UV3M5HtIj3meONK8fF2YAaSp98DHENkED2aPt3JuI9Ypd7oXI00qqrB0fF5");

dotenv.config();

// Load route handlers--------------------------------------------
const getAllUsers = require("./routeHandlers/getAllusers");
const getAllMessages = require("./routeHandlers/getAllMessages")
const pendingBooking = require("./routeHandlers/pendingBooking")
const confirmBooking = require("./routeHandlers/confirmBooking")
const requestBooking = require("./routeHandlers/RequestedBooking")
const soldDishes = require("./routeHandlers/soldDish");
// ================================================================

// Common middlewares -----------------------------------
app.use(cors()); // enable cors policy
app.use(express.json()); // get data in json format
app.use(bodyParser.json());
// ======================================================

// // Database connection with mongoose ----------------------------------------
// mongoose.connect("mongodb+srv://shafin90:1Mrbdn987@cluster0.yhuz2xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Cookplato")
//   .then(() => console.log("Connection to MongoDB established"))
//   .catch(err => console.error("Error connecting to MongoDB:", err));
// // ========================================================================

// Application's routes  ---------------------
app.use("/getAllUsers", getAllUsers);
app.use("/getAllMessages", getAllMessages)
app.use("/pendingBooking", pendingBooking)
app.use("/confirmBooking", confirmBooking)
app.use("/requestBooking", requestBooking)
app.use("/soldDishes", soldDishes);
// ===========================================

// Handle Stripe payment----------------------------------------
app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency, payment_method_types } = req.body;
  console.log(amount, currency, payment_method_types)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types,
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});
// =============================================================

// Handle payout request from worker
app.post("/request-payout", async (req, res) => {
  try {
    const { amount } = req.body;

    // Create a payout to the worker's bank account
    const payout = await stripe.transfers.create({
      amount,
      currency: 'usd', // Adjust currency as necessary
      destination: 69207711, // Replace with Payoneer account ID
    });

    res.status(200).json({ success: true, payout });
  } catch (error) {
    console.error("Error creating payout:", error);
    res.status(500).json({ error: "Failed to create payout" });
  }
});



app.post('/charge', async (req, res) => {
  try {
    const paymentMethodId = req.body.paymentMethodId;

    // Create a Payment Intent with a return URL
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'https://yourwebsite.com/success', // Your success page URL
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your payment.' });
  }
});


// checking whether the server is running or not ---------------
app.get("/", (req, res) => {
  res.send("hello")
})
//  =============================================================

// Start the server ------------------------------------------
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
