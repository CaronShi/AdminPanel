const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const db = mongoose.connection;
const app = express();
const User = require("./models/user");
const Event = require("./models/event");
const Event_tem = require("./models/event_tem");
const Supervisor = require("./models/supervisor");
const Organization = require("./models/organization");
const bcrypt = require('bcrypt');
// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
app.use(bodyParser.json({ limit: "25mb" }));
app.use(cors({ origin: true, credentials: true }));
const httpServer = require('http').createServer(app);

let db_url =
    "mongodb+srv://jitbaner:4r17oq9ZuznScSih@cluster0.znvt1pl.mongodb.net/AssistProject?retryWrites=true&w=majority";

mongoose
    .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN");
    })
    .catch((e) => {
        console.log("Error!");
        console.log(e);
    });

app.post('/createevent', async (req, res) => {

    const {
        name,
        date,
        start_time: {
            minute_start,
            hour_start,
        },
        end_time: {
            minute_end,
            hour_end,
        },
        location: {
            street,
            city,
            state,
        },
        description,
    } = req.body;
    const existingUser = await Event.findOne({ name });
    if (existingUser) {
        return res.status(409).json({ message: "Eventname already exists" });
    }

    // generating id
    var id = "";
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters.charAt(randomIndex);
    }

    const newEvent = new Event({
        id,
        name,
        // imageurl,
        date,
        time: {
            minute,
            hour,
        },
        end_time: {
            minute,
            hour,
        },
        location: {
            street,
            city,
            state,
        },
        description,
    });
    console.log("newEvent: " + newEvent);
    await newEvent.save();
    console.log("a new Event is sent to backend successfully!");
    res.status(201).json({ message: "Event created" });
});

app.get("/events/approved", async (req, res) => {
    const events = await Event.find();
    console.log("events: " + events);
    res.send(events);
});

app.get("/events/tem", async (req, res) => {
    const events = await Event_tem.find();
    console.log("events: " + events);
    res.send(events);
});



const port = process.env.PORT || 3080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});