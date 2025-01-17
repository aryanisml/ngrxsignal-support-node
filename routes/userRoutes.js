const express = require("express");
const router = express.Router();

// In-memory storage (Note: This is temporary and will reset on server restart)
let users = [
    { userId: "1", name: "Demo User", email: "demo@example.com" }
];

// Middleware to log requests
router.use((req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
});

// GET all users
router.get("/users", (req, res) => {
    try {
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET single user
router.get("/users/:userId", (req, res) => {
    try {
        const { userId } = req.params;
        const user = users.find(u => u.userId === userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST new user
router.post("/users", (req, res) => {
    try {
        const newUser = { 
            ...req.body, 
            userId: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        
        // Basic validation
        if (!newUser.name || !newUser.email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        users.push(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT update user
router.put("/users/:userId", (req, res) => {
    try {
        const { userId } = req.params;
        const index = users.findIndex(user => user.userId === userId);

        if (index === -1) {
            return res.status(404).json({ error: "User not found" });
        }

        users[index] = { 
            ...users[index], 
            ...req.body,
            userId, // Prevent userId from being modified
            updatedAt: new Date().toISOString()
        };

        res.json(users[index]);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE user
router.delete("/users/:userId", (req, res) => {
    try {
        const { userId } = req.params;
        const initialLength = users.length;
        users = users.filter(user => user.userId !== userId);

        if (users.length === initialLength) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;