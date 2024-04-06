const express = require("express"); 
const router = express.Router(); 
const mongoose = require("mongoose"); 
const confirmBookingSchema = require("../schemas/confirmBookingSchema"); 
const ConfirmBooking = mongoose.model("confirmBookingCollections", confirmBookingSchema);


//  getting all requested booking ---------------------------------------------
router.get("/", async (req, res) => {
    try {
        const confirmBooking = await ConfirmBooking.find({email:email});
        res.status(200).json(confirmBooking);
    } catch (error) {
        console.log("the error to get confirmBooking is", error)
        res.status(500).json({ error: "There was a server side error" })
    }
})
// =============================================================================


// add a new booking request by user --------------------------------------------
router.post("/", async (req, res) => {
    try {
        const newConfirmBooking = new ConfirmBooking(req.body);
        await newConfirmBooking.save();
        res.status(201).json({ message: "request for booking successfull", confirmBooking: newConfirmBooking })
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
        const deletedRequest = await ConfirmBooking.findByIdAndDelete(requestedBookingId);
        if (deletedRequest) {
            res.status(200).json({ message: "confirm booking deleted successfully", deletedRequest })
        } else {
            res.status(404).json({ error: "Booking not found" })
        }

    } catch (error) {
        console.log("error while deleting booking", error)
        res.status(500).json({ error: "There was a server side error" })
    }
})
// ========================================================================================================

module.exports = router