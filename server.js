require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const BinDataObj = require("./models/BinDataObj")

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to database
mongoose.connect(
    process.env.MONGO_DB_CONNECTION_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME },
    (err) => {
        if (!err) {
            console.log("Successfully connected to database");
        } else {
            console.log("Couldn't connect to database", err);
        }
    }
);

// Get latest entry of a specific ID
app.get("/latest/:id", async (req, res) => {
    try {
        const data = await BinDataObj.find({ deviceId: req.params.id }).sort({ _id: -1 }).limit(1);
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
})

// Get average plastic volume per day for a specific ID
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
