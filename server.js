require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const BinDataObj = require("./models/BinDataObj")

const app = express();

// Connect to database
mongoose.connect(
    process.env.MONGO_DB_CONNECTION_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true, dbName: "SmartWheelieBinData" },
    (err) => {
        if (!err) {
            console.log("Successfully connected to database");
        } else {
            console.log("Couldn't connect to database", err);
        }
    }
);

// Get all entries
app.get("/", async (req, res) => {
    try {
        const data = await BinDataObj.find().sort({ _id: -1 });
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
})

// Get all entries of a specific ID
app.get("/:id", async (req, res) => {
    try {
        const data = await BinDataObj.find({ deviceId: req.params.id }).sort({ _id: -1 });
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
})

// Get latest entry of a specific ID
app.get("/latest/:id", async (req, res) => {
    try {
        const data = await BinDataObj.find({ deviceId: req.params.id }).sort({ _id: -1 }).limit(1);
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
})

// Get average plastic volume for past week for a specific ID
app.get("/avg-volume/:id", async (req, res) => {
    try {
        const data = await BinDataObj.aggregate([
            { $match: { deviceId: req.params.id }},
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' }},
                    avgPlasticVolume: { $avg: "$rubbishVolume" }
                }
            }
        ]);
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}...`);
})
