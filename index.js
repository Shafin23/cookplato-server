const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require('cors');
const multer = require('multer')
dotenv.config();
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

const stripe = require('stripe')("sk_test_51OY48pCg3UF6njdMIGMex9SQFX49Hl36mb8yI20UV3M5HtIj3meONK8fF2YAaSp98DHENkED2aPt3JuI9Ypd7oXI00qqrB0fF5");

// Load route handlers--------------------------------------------
const getAllUsers = require("./routeHandlers/getAllusers");
const getAllMessages = require("./routeHandlers/getAllMessages")
const booking = require("./routeHandlers/booking")
// ================================================================


// common middlewares -----------------------------------
app.use(cors()); // enable cors policy
app.use(express.json()); // get data in json formate
// ======================================================

// Database connection with mongoose ----------------------------------------
mongoose.connect(`mongodb+srv://mashrafiahnam1:1Mrbdn987@cluster0.yhuz2xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Cooks`)
  .then(() => console.log("Connection to MongoDB established"))
  .catch(err => console.error("Error connecting to MongoDB:", err));
// ========================================================================


// Application's routes  ---------------------
app.use("/getAllUsers", getAllUsers);
app.use("/getAllMessages", getAllMessages);
app.use("/book", booking);
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder where files will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Set the file name
  }
});


// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000000000000000000000 } // Set file size limit if needed
}).single('avatar'); // 'avatar' should match the name attribute of your file input


app.post('/profile', (req, res) => {
  upload(req, res, (err) => {
    console.log("path name--------  ",req.file.path)
  });
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
