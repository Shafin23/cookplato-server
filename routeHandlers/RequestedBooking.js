const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requestedBookingSchema = require("../schemas/RequestedBookingSchema");
const RequestedBookingCollections = mongoose.model("requestedBookingCollections", requestedBookingSchema);

//  getting all requested booking ---------------------------------------------
router.get("/:email", async (req, res) => {
    try {
        const email = await req.params.email;
        const requestedBooking = await RequestedBookingCollections.find({email:email});
        res.status(200).json(requestedBooking);
    } catch (error) {
        console.log("the error to get requestedBooking is", error)
        res.status(500).json({ error: "There was a server side error" })
    }
})
// =============================================================================



router.get("/", async (req, res) => {
    try {
        const requestBooking = await  RequestedBookingCollections.find();
        res.status(200).json(requestBooking);
    } catch (error) {
        console.log("error while getting all the  data of pending request", error)
        res.status(500).json({ message: "There was a server side problem" })
    }
})




// add a new booking request by user --------------------------------------------
router.post("/", async (req, res) => {
    try {
        const newBookingRequest = new RequestedBookingCollections(req.body);
        await newBookingRequest.save();
        res.status(201).json({ message: "request for booking successfull", newRequest: newBookingRequest })
    } catch (err) {
        console.log("Error while adding booking equest is", err)
        res.status(500).json({ error: "There was a server side error" })
    }
})
// ==============================================================================


//  delete a booking request -----------------------------------------------------------------------------
router.delete("/:id", async (req, res) => {
    try {
        const requestedBookingId = req.params.id;
        const deletedRequest = await RequestedBookingCollections.findByIdAndDelete(requestedBookingId);
        if (deletedRequest) {
            res.status(200).json({ message: "booking request deleted successfully", deletedRequest })
        } else {
            res.status(404).json({ error: "Booking request not found" })
        }

    } catch (error) {
        console.log("error while deleting booking request", error)
        res.status(500).json({ error: "There was a server side error" })
    }
})
// ========================================================================================================

module.exports= router;