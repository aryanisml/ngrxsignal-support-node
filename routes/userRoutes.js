const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataPath = path.join(__dirname, "../data/users.json");

// Helper to read/write JSON
const getUsers = () => JSON.parse(fs.readFileSync(dataPath, "utf-8"));
const saveUsers = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// Routes
router.get("/users", (req, res) => {
    const users = getUsers();
    res.json(users);
});

router.post("/users", (req, res) => {
    const users = getUsers();
    const newUser = { ...req.body, userId: Date.now().toString() };
    users.push(newUser);
    saveUsers(users);
    res.status(201).json(newUser);
});

router.put("/users/:userId", (req, res) => {
    const { userId } = req.params;
    const users = getUsers();
    const index = users.findIndex((user) => user.userId === userId);

    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users[index] = { ...users[index], ...req.body };
    saveUsers(users);
    res.json(users[index]);
});

router.delete("/users/:userId", (req, res) => {
    const { userId } = req.params;
    const users = getUsers();
    const filteredUsers = users.filter((user) => user.userId !== userId);

    if (users.length === filteredUsers.length) {
        return res.status(404).json({ error: "User not found" });
    }

    saveUsers(filteredUsers);
    res.status(204).send();
});

module.exports = router;
