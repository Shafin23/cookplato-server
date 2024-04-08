const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

// MongoDB Connection URI
const uri = "mongodb+srv://shafin:bqIoXvqlvI3a6vBn@cluster0.yhuz2xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace this with your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
connect();

// Getting all requested booking by email
router.get("/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const requestedBooking = await client.db("Cookplato").collection("requestedBooking").find({ email: email }).toArray();
        res.status(200).json(requestedBooking);
    } catch (error) {
        console.log("Error fetching requested booking:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

// Getting all requested booking
router.get("/", async (req, res) => {
    try {
        const requestBooking = await client.db("Cookplato").collection("requestedBooking").find().toArray();
        res.status(200).json(requestBooking);
    } catch (error) {
        console.log("Error fetching all requested booking data:", error);
        res.status(500).json({ message: "There was a server side problem" });
    }
});

// Add a new booking request by user
router.post("/", async (req, res) => {
    try {
        const newBookingRequest = req.body;
        await client.db("Cookplato").collection("requestedBooking").insertOne(newBookingRequest);
        res.status(201).json({ message: "Request for booking successful", newRequest: newBookingRequest });
    } catch (error) {
        console.log("Error adding booking request:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

// Delete a booking request
router.delete("/:id", async (req, res) => {
    try {
        const requestedBookingId = req.params.id;
        const deletedRequest = await client.db("Cookplato").collection("requestedBooking").findOneAndDelete({ _id: ObjectId(requestedBookingId) });
        if (deletedRequest.value) {
            res.status(200).json({ message: "Booking request deleted successfully", deletedRequest });
        } else {
            res.status(404).json({ error: "Booking request not found" });
        }
    } catch (error) {
        console.log("Error while deleting booking request:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

module.exports = router;
