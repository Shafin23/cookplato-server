const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../schemas/userSchema")
const Users = new mongoose.model("userCollections", userSchema)


const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = uuidv4() + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });






// Get all user's data --------------------------------------------------
router.get("/", async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching cooks:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
})
// =======================================================================


// Get all cook's data --------------------------------------------------------
router.get("/cook", async (req, res) => {
    try {
        //  collecting all user's from the database
        const users = await Users.find();
        const cooks = await users.filter(user => user.userRole === "cook")
        res.status(200).json(cooks);
    } catch (error) {
        console.error("Error fetching cooks:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
})
// ============================================================================


// get approved cook: when admin approve a cook -----------------------------
router.get("/approvedCook", async (req, res) => {
    try {
        // collect8ing all approved cook-----
        const users = await Users.find();
        const approvedCook = users.filter(user => user?.status === "approved");
        res.status(200).json(approvedCook);
    } catch (err) {
        console.error("Error fetching Approved cooks:", err);
        res.status(500).json({ error: "There was a server side error" });
    }
})
// ==========================================================================


// get pending cook -------------------------------------------------------------
router.get("/pendingCook", async (req, res) => {
    try {
        // collecting all pending cook------------------------------------------
        const users = await Users.find();
        const pendingCook = users.filter(user => user?.status === "pending");
        res.status(200).json(pendingCook);
    } catch (err) {
        console.error("Error fetching pending cooks:", err);
        res.status(500).json({ error: "There was a server side error" });
    }
})
// ===============================================================================


// Get all dish item's information -------------------------------------------
router.get("/dishes", async (req, res) => {
    try {
        let allDishes = [];
        //  collecting all user's from the database
        const users = await Users.find();
        users.forEach(user => allDishes.push(...user.dishes))
        res.status(200).json(allDishes);
    } catch (error) {
        console.error("Error fetching cooks:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
})
// =======================================================================


// get specific user's information through email----------------------------------
router.get("/email/:email", async (req, res) => {
    const userEmail = await req.params.email;
    try {

        const user = await Users.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json({ message: "User found successfully", user: user })
    } catch (err) {
        console.error("Error fetching cook:", err)
        res.status(500).json({ error: "There was a server side error" });
    }
})
// ===============================================================================


// get specific User's information through id --------------------------------------------
router.get("/userId/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching cook:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
//  ============================================================================



// post user info ==============================================================
router.post('/submit', upload.single('img'), async (req, res) => {
    try {
        // Create a new user object with form data
        const newUser = new Users({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            userRole: req.body.userRole,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            display_name: req.body.displayName,
            img: req.file ? '/uploads/' + req.file.filename : '', // Save image URL if uploaded
            description: req.body.description,
            dishes: req.body.dishes ? req.body.dishes.split(',') : [], // Assuming dishes is a comma-separated string
            status: req.body.status
        });

        // Save the user object to the database
        await newUser.save();
        console.log(newUser)

        res.status(200).send('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal server error');
    }
});
// ------------------------------------------------------------------------------


// update the Cook's data when he/she is creating profile or updating information
router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;
    console.log(userId)
    console.log(updatedUserData)

    const user = await Users.findById(userId);
    const updatedDishes = await user.dishes;
    // console.log("this is the update thing", user.dishes)

    try {
        // const user = await Users.findById(userId);

        const updatedUser = await Users.findByIdAndUpdate(userId, { dishes: [...updatedDishes, updatedUserData] }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "Cook not found" });
        }
        res.status(200).json({ message: "Cook updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating cook:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ===================================================================================================



// Update Cook's status ------------------------------------------------------------------------------------
router.put("/updateStatus/:id", async (req, res) => {
    const userId = req.params.id;
    const updatedStatus = req.body.status; // Assuming the status is sent in the request body
    try {
        const updatedUser = await Users.findByIdAndUpdate(userId, { status: updatedStatus }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "Cook not found" });
        }
        res.status(200).json({ message: "Cook status updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating cook status:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
//==============================================================================================================


// update user's information---------------------------------------------------------------------------
// router.put("/:id", async (req, res) => {
//     const userId = req.params.id;
//     const updatedUserData = req.body;
//     // console.log(updatedUserData)
//     try {
//         const updatedUser = await Users.findByIdAndUpdate(userId, updatedUserData, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         res.status(200).json({ message: "User updated successfully", user: updatedUser });
//     } catch (error) {
//         console.error("Error updating user:", error);
//         res.status(500).json({ error: "There was a server side error" });
//     }
// });
// ===================================================================================================


module.exports = router;