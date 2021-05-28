const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(`mongodb://localhost:27017/ugur_test?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    () => console.log("Database connection successful")
);

const GymLocation = require("./model/GymLocation");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello")
});

app.post("/gym/add", async (req, res) => {

    console.log(req.body);

    // Create GymLocation object
    const newLocation = new GymLocation({
        lat: req.body.lat,
        lon: req.body.lon,
        name: req.body.name,
    });

    // Write the record to the DB
    await newLocation.save();

    // Get all gyms
    const gyms = await GymLocation.find({}).select("-_id -__v");;

    // Send request back
    res.json(gyms);
});

app.get("/gym/get", async (req, res) => {

    const gyms = await GymLocation.find({}).select("-_id -__v");;
    res.json(gyms);

});

app.listen(3000, () => console.log("The app is running on port 3000"));