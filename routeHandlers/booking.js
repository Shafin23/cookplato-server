const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bookingSchema = require("../schemas/bookingSchema");
const Bookings = new mongoose.model("bookings", bookingSchema);


// get pending booking-------------------------------------------------------------------
router.get("/pending", async (req, res) => {
    try {
        const booking = await Bookings.find();
        const pendingBooking = booking.filter(item => item?.bookingStatus === "pending")
        res.status(200).json(pendingBooking);
    } catch (err) {

    }
})
// ========================================================================================



// get request booking -------------------------------------------------------------------
router.get("/request", async (req, res) => {
    try {
        const booking = await Bookings.find();
        console.log(booking)
        const requestBooking = await booking.filter(item => item?.bookingStatus === "request")
        res.status(200).json(requestBooking);
    } catch (err) {
        console.log("something error happend", err)
        res.status(500).json({ error: "server error" })
    }
})
// ========================================================================================


// get confirm  booking-------------------------------------------------------------------
router.get("/confirm", async (req, res) => {
    try {
        const booking = await Bookings.find();
        const confirmBooking = booking.filter(item => item?.bookingStatus === "confirm")
        res.status(200).json(confirmBooking);
    } catch (err) {
        console.log("something error happend", err)
        res.status(500).json({ error: "server error" })
    }
})
// ========================================================================================


// make a post request to book first------------------------
router.post("/", async (req, res) => {
    try {
        const booking = new Bookings(req.body);
        await booking.save();
        res.status(200).json({ message: " successfully requested to book", message: booking })
    } catch (err) {
        console.log("something wrong happened", err)
        res.status(500).json({ error: "server error" })
    }
})
// =========================================================


// make an update: Cook will make the status "pending" from "request" or "request" to "confirm" so that , user can confirm payment
router.put("/:id", async (req, res) => {
    const bookingID = req.params.id;
    const statusUpdate = req.body;
    console.log(bookingID, statusUpdate)
    try {
        const updateStatus = await Bookings.findByIdAndUpdate(bookingID, statusUpdate, { new: true });
        if (!updateStatus) {
            return res.status(404).json({ error: "booking info not found" })
        }
        res.status(200).json({ message: "booking status updated successfully" })

    } catch (err) {
        console.log("server error", err)
        res.status(500).json({ error: "server error" })
    }
})
//==================================================================================================

// Delete booking request --------------------------------------------------------------------------
router.delete("/request/:id", async (req, res) => {
    const bookingID = req.params.id;
    try {
        const deletedBooking = await Bookings.findByIdAndDelete(bookingID);
        if (!deletedBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (err) {
        console.error("Server error", err);
        res.status(500).json({ error: "Server error" });
    }
});
// =================================================================================================

module.exports = router;