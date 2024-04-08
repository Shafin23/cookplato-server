const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const pendingBookingSchema = require("../schemas/pendingBookingSchema");
const PendingBooking = new mongoose.model("pendingBookingCollections", pendingBookingSchema);


// getting specific data of pending booking ----------------------------------------
router.get("/:email", async (req, res) => {
    try {
        const email =  req.params.email;
        const pendingRequest = await PendingBooking.find({email:email});
        res.status(200).json(pendingRequest);
    } catch (error) {
        console.log("error while getting all the  data of pending request", error)
        res.status(500).json({ message: "There was a server side problem" })
    }
})
// =================================================================================


// getting all the data of pending booking ----------------------------------------
router.get("/", async (req, res) => {
    try {
        const pendingRequest = await PendingBooking.find();
        res.status(200).json(pendingRequest);
    } catch (error) {
        console.log("error while getting all the  data of pending request", error)
        res.status(500).json({ message: "There was a server side problem" })
    }
})
// =================================================================================




//  add a booking request --------------------------------------------------------------------------------
router.post("/", async (req, res) => {
    try {
        const newInPendingRequest = new PendingBooking(req.body)
        await newInPendingRequest.save();
        res.status(201).json({ message: "new pending request", newPendingRequest: newInPendingRequest })
    } catch (error) {
        console.log("There was an error while adding a pending request", error)
        res.status(500).json({ message: "There was a server side error" })
    }
})
// =======================================================================================================



//  delete a booking request -----------------------------------------------------------------------------
router.delete("/:id", async (req, res) => {
    try {
        const pendingBookingId = req.params.id;
        const deletedRequest = await PendingBooking.findByIdAndDelete(pendingBookingId);
        if (deletedRequest) {
            res.status(200).json({ message: "pending booking deleted successfully", deletedRequest })
        } else {
            res.status(404).json({ error: "Pending item not found" })
        }

    } catch (error) {
        console.log("error while deleting booking request", error)
        res.status(500).json({ error: "There was a server side error" })
    }
})
// ========================================================================================================

module.exports = router;