const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const soldDishSchema = require("../schemas/soldDishSchema");
const soldDishCollection = mongoose.model("soldDishCollection", soldDishSchema);

//  getting all requested booking ---------------------------------------------
router.get("/:sellerEmail", async (req, res) => {
    try {
        const email = await req.params.sellerEmail;
        const  soldDishes = await  soldDishCollection.find({sellerEmail:email});
        res.status(200).json(soldDishes);
    } catch (error) {
        console.log("the error to get requestedBooking is", error)
        res.status(500).json({ error: "There was a server side error" })
    }
})
// =============================================================================




//  getting all requested booking ---------------------------------------------
router.get("/:buyerEmail", async (req, res) => {
    try {
        const email = await req.params.buyerEmail;
        const soldDishes = await  soldDishCollection.find({buyerEmail:email});
        res.status(200).json(soldDishes);
    } catch (error) {
        console.log("the error to get requestedBooking is", error)
        res.status(500).json({ error: "There was a server side error" })
    }
})
// =============================================================================



router.get("/", async (req, res) => {
    try {
        const soldDishes = await  soldDishCollection.find();
        res.status(200).json(soldDishes);
    } catch (error) {
        console.log("error while getting all the  data of pending request", error)
        res.status(500).json({ message: "There was a server side problem" })
    }
})




// add a new booking request by user --------------------------------------------
router.post("/", async (req, res) => {
    try {
      
        const newSoldDish = new soldDishCollection(req.body);
        await newSoldDish.save();
        res.status(201).json({ message: "request for booking successfull", newDish: newSoldDish })
    } catch (err) {
        console.log("Error while adding booking equest is", err)
        res.status(500).json({ error: "There was a server side error" })
    }
})
// ==============================================================================


//  delete a booking request -----------------------------------------------------------------------------

// ========================================================================================================

module.exports= router;