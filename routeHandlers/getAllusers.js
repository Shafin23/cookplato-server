const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../schemas/userSchema");
const Users = new mongoose.model("userCollections", userSchema);




// mongoose.connection.on('open', async () => {
//     try {
//         // Check if the Users collection already exists
//         const collectionNames = await mongoose.connection.db.listCollections().toArray();
//         const collectionExists = collectionNames.some(collection => collection.name === 'userCollections');

//         // If the collection doesn't exist, create it
//         if (!collectionExists) {
//             await mongoose.connection.db.createCollection('userCollections');
//             console.log('Users collection created successfully');
//         }
//     } catch (error) {
//         console.error('Error creating Users collection:', error);
//     }
// });




// Get all user's data --------------------------------------------------
router.get("/", async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// =======================================================================

// Get all cook's data --------------------------------------------------------
router.get("/cook", async (req, res) => {
    try {
        const cooks = await Users.find({ userRole: "cook" });
        res.status(200).json(cooks);
    } catch (error) {
        console.error("Error fetching cooks:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ============================================================================

// Get approved cooks --------------------------------------------------------
router.get("/approvedCook", async (req, res) => {
    try {
        const approvedCooks = await Users.find({ status: "approved" });
        res.status(200).json(approvedCooks);
    } catch (error) {
        console.error("Error fetching approved cooks:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ============================================================================

// Get pending cooks ---------------------------------------------------------
router.get("/pendingCook", async (req, res) => {
    try {
        const pendingCooks = await Users.find({ status: "pending" });
        res.status(200).json(pendingCooks);
    } catch (error) {
        console.error("Error fetching pending cooks:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ============================================================================

// Get all dish items' information -------------------------------------------
router.get("/dishes", async (req, res) => {
    try {
        const allDishes = await Users.distinct('dishes', { dishes: { $exists: true, $ne: null } });
        res.status(200).json(allDishes);
    } catch (error) {
        console.error("Error fetching dishes:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ============================================================================

// Get user by email ---------------------------------------------------------
router.get("/email/:email", async (req, res) => {
    const userEmail = req.params.email;
    try {
        const user = await Users.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User found successfully", user: user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ============================================================================

// Get user by ID ------------------------------------------------------------
router.get("/userId/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ============================================================================

// Create new user -----------------------------------------------------------
router.post('/submit', async (req, res) => {
    try {
        const newUser = new Users(req.body);
        await newUser.save();
        res.status(200).send('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal server error');
    }
});
// ============================================================================

// Update user information ---------------------------------------------------
router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await Users.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ============================================================================

// Update cook status --------------------------------------------------------
router.put("/updateStatus/:id", async (req, res) => {
    const userId = req.params.id;
    const updatedStatus = req.body.status;
    try {
        const updatedUser = await Users.findByIdAndUpdate(userId, { status: updatedStatus }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User status updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ============================================================================

module.exports = router;
