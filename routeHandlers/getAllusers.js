const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

// MongoDB Connection URI
const uri = "mongodb+srv://shafin:bqIoXvqlvI3a6vBn@cluster0.yhuz2xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Change this to your MongoDB URI
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

// Get all user's data --------------------------------------------------
router.get("/", async (req, res) => {
    try {
        const users = await client.db("Cookplato").collection("users").find().toArray();
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
        const cooks = await client.db("Cookplato").collection("users").find({ userRole: "cook" }).toArray();
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
        const approvedCooks = await client.db("Cookplato").collection("users").find({ status: "approved" }).toArray();
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
        const pendingCooks = await client.db("Cookplato").collection("users").find({ status: "pending" }).toArray();
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
        const allDishes = await client.db("Cookplato").collection("users").distinct('dishes', { dishes: { $exists: true, $ne: null } });
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
        const user = await client.db("Cookplato").collection("users").findOne({ email: userEmail });
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
        const user = await client.db("Cookplato").collection("users").findOne({ _id: ObjectId(userId) });
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
        await client.db("Cookplato").collection("users").insertOne(req.body);
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
        const updatedUser = await client.db("Cookplato").collection("users").findOneAndUpdate(
            { _id: ObjectId(userId) },
            { $set: req.body },
            { returnOriginal: false }
        );
        if (!updatedUser.value) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser.value });
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
        const updatedUser = await client.db("Cookplato").collection("users").findOneAndUpdate(
            { _id: ObjectId(userId) },
            { $set: { status: updatedStatus } },
            { returnOriginal: false }
        );
        if (!updatedUser.value) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User status updated successfully", user: updatedUser.value });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});
// ============================================================================

module.exports = router;
