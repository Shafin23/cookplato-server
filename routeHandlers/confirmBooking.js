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
        const confirmBooking = await client.db("Cookplato").collection("confirmBooking").find({ email: email }).toArray();
        res.status(200).json(confirmBooking);
    } catch (error) {
        console.log("Error fetching confirmBooking:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

// Getting all requested booking
router.get("/", async (req, res) => {
    try {
        const confirmBooking = await client.db("Cookplato").collection("confirmBooking").find().toArray();
        res.status(200).json(confirmBooking);
    } catch (error) {
        console.log("Error fetching confirmBooking:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

// Add a new booking request by user
router.post("/", async (req, res) => {
    try {
        const newConfirmBooking = req.body;
        await client.db("Cookplato").collection("confirmBooking").insertOne(newConfirmBooking);
        res.status(201).json({ message: "Request for booking successful", confirmBooking: newConfirmBooking });
    } catch (error) {
        console.log("Error adding booking request:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

// Delete a booking request
router.delete("/:id", async (req, res) => {
    try {
        const requestedBookingId = req.params.id;
        const deletedRequest = await client.db("Cookplato").collection("confirmBooking").findOneAndDelete({ _id: ObjectId(requestedBookingId) });
        if (deletedRequest.value) {
            res.status(200).json({ message: "Confirm booking deleted successfully", deletedRequest });
        } else {
            res.status(404).json({ error: "Booking not found" });
        }
    } catch (error) {
        console.log("Error while deleting booking:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

module.exports = router;
