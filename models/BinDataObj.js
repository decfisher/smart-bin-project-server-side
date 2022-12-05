const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const binData = new Schema({
    deviceId: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Schema.Types.Date,
        required: true
    },
    percentageFull: {
        type: Schema.Types.Number,
        required: true
    },
    rubbishVolume: {
        type: Schema.Types.Number,
        required: true
    },
    latitude: {
        type: Schema.Types.Mixed,
        required: true
    },
    longitude: {
        type: Schema.Types.Mixed,
        required: true
    }
})

module.exports = mongoose.model("SmartBin", binData, "SmartBin")