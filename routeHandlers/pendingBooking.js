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

// Getting specific data of pending booking by email
router.get("/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const pendingRequest = await client.db("Cookplato").collection("pendingBooking").find({ email: email }).toArray();
        res.status(200).json(pendingRequest);
    } catch (error) {
        console.log("Error fetching pending booking data:", error);
        res.status(500).json({ message: "There was a server side problem" });
    }
});

// Getting all the data of pending booking
router.get("/", async (req, res) => {
    try {
        const pendingRequest = await client.db("Cookplato").collection("pendingBooking").find().toArray();
        res.status(200).json(pendingRequest);
    } catch (error) {
        console.log("Error fetching all pending booking data:", error);
        res.status(500).json({ message: "There was a server side problem" });
    }
});

// Add a booking request
router.post("/", async (req, res) => {
    try {
        const newInPendingRequest = req.body;
        await client.db("Cookplato").collection("pendingBooking").insertOne(newInPendingRequest);
        res.status(201).json({ message: "New pending request added", newPendingRequest: newInPendingRequest });
    } catch (error) {
        console.log("Error adding pending request:", error);
        res.status(500).json({ message: "There was a server side error" });
    }
});

// Delete a booking request
router.delete("/:id", async (req, res) => {
    try {
        const pendingBookingId = req.params.id;
        const deletedRequest = await client.db("Cookplato").collection("pendingBooking").findOneAndDelete({ _id: ObjectId(pendingBookingId) });
        if (deletedRequest.value) {
            res.status(200).json({ message: "Pending booking deleted successfully", deletedRequest });
        } else {
            res.status(404).json({ error: "Pending item not found" });
        }
    } catch (error) {
        console.log("Error while deleting pending booking:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

module.exports = router;
