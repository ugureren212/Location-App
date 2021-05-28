const mongoose = require("mongoose");

const GymLocationSchema = new mongoose.Schema({
    lat: {
        type: Number
    },
    lon: {
        type: Number
    },
    name: {
        type: String,
    }
});

module.exports = mongoose.model("GymLocation", GymLocationSchema);