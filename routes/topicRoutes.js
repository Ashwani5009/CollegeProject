const express = require("express");
const Topic = require("../models/Topic");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const topics = await Topic.find();
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
