const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user");
const User_tem = require("./models/user_tem");
const Supervisor_tem = require("./models/supervisor_tem");
const Event = require("./models/event");
const Event_tem = require("./models/event_tem");
const Supervisor = require("./models/supervisor");
const Organization = require("./models/organization");
const School = require("./models/school");
const Organization_tem = require("./models/organization_tem");
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

app.post('/eventaction', async (req, res) => {
    const eventMode = req.query.mode;
    const eventId = req.body.eventId; // Assuming eventId is passed in the request body
    console.log('backend', eventMode, eventId)
    if (eventMode === "approved") {
        try {
            // Find the tem event by ID
            const temEvent = await Event_tem.findById(eventId);
            console.log(temEvent)
            // Create a new event using the data from the tem event
            const newEvent = new Event({});
            for (const key in temEvent.toObject()) {
                newEvent[key] = temEvent[key];
            }
            // Save the new event
            await newEvent.save();
            // Delete the tem event
            await Event_tem.findByIdAndDelete(eventId);

            res.status(200).send("Event approved and moved to events collection");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error processing the event approval");
        }
    } else if (eventMode === "declined") {
        try {
            // Delete the tem event
            await Event_tem.findByIdAndDelete(eventId);

            res.status(200).send("Event declined and removed from tem events collection");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error processing the event decline");
        }
    } else {
        res.status(400).send("Invalid event mode");
    }
});

app.get("/events", async (req, res) => {
    const eventMode = req.query.mode; // Get the query parameter "mode"

    let events;

    if (eventMode === 'approved') {
        events = await Event.find();
    } else if (eventMode === 'tem') {
        events = await Event_tem.find();
    } else {
        return res.status(400).send("Invalid event mode");
    }

    res.send(events);
});
app.post('/useraction', async (req, res) => {
    const userMode = req.query.mode;
    const userId = req.body.userId; // Assuming userId is passed in the request body
    if (userMode === "approved") {
        try {
            // Find the tem user by ID
            const temUser = await User_tem.findById(userId);
            console.log(temUser)
            // Create a new user using the data from the tem user
            const newUser = new User();
            // Copy all properties from temUser to newUser
            for (const key in temUser.toObject()) {
                newUser[key] = temUser[key];
            }
            // Save the new user
            await newUser.save();
            // Delete the tem user
            await User_tem.findByIdAndDelete(userId);

            res.status(200).send("User approved and moved to users collection");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error processing the user approval");
        }
    } else if (userMode === "declined") {
        try {
            // Delete the tem user
            await User_tem.findByIdAndDelete(userId);

            res.status(200).send("User declined and removed from tem users collection");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error processing the user decline");
        }
    } else {
        res.status(400).send("Invalid user mode");
    }
});
app.get("/users", async (req, res) => {
    const userMode = req.query.mode; // Get the query parameter "mode"

    let users;

    if (userMode === 'approved') {
        users = await User.find();
    } else if (userMode === 'tem') {
        users = await User_tem.find();
    } else {
        return res.status(400).send("Invalid user mode");
    }

    res.send(users);
});

//supervisor
app.post('/supervisoraction', async (req, res) => {
    const supervisorMode = req.query.mode;
    const supervisorId = req.body.supervisorId; // Assuming supervisorId is passed in the request body
    console.log('backend', supervisorMode, supervisorId)
    if (supervisorMode === "approved") {
        try {
            // Find the tem supervisor by ID
            const temSupervisor = await Supervisor_tem.findById(supervisorId);
            console.log(temSupervisor)
            // Create a new supervisor using the data from the tem supervisor
            const newSupervisor = new Supervisor({
            });
            for (const key in temSupervisor.toObject()) {
                newSupervisor[key] = temSupervisor[key];
            }
            // Save the new supervisor
            await newSupervisor.save();
            // Delete the tem supervisor
            await Supervisor_tem.findByIdAndDelete(supervisorId);

            res.status(200).send("Supervisor approved and moved to supervisors collection");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error processing the supervisor approval");
        }
    } else if (supervisorMode === "declined") {
        try {
            // Delete the tem supervisor
            await Supervisor_tem.findByIdAndDelete(supervisorId);

            res.status(200).send("Supervisor declined and removed from tem supervisors collection");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error processing the supervisor decline");
        }
    } else {
        res.status(400).send("Invalid supervisor mode");
    }
});
app.get("/supervisors", async (req, res) => {
    const supervisorMode = req.query.mode; // Get the query parameter "mode"

    let supervisors;

    if (supervisorMode === 'approved') {
        supervisors = await Supervisor.find();
    } else if (supervisorMode === 'tem') {
        supervisors = await Supervisor_tem.find();
    } else {
        return res.status(400).send("Invalid supervisor mode");
    }

    res.send(supervisors);
});

//organization
app.post('/organizationaction', async (req, res) => {
    const organizationMode = req.query.mode;
    const organizationId = req.body.organizationId; // Assuming organizationId is passed in the request body
    console.log('backend', organizationMode, organizationId)
    if (organizationMode === "approved") {
        try {
            // Find the tem organization by ID
            const temOrganization = await Organization_tem.findById(organizationId);
            console.log(temOrganization)
            // Create a new organization using the data from the tem organization
            const newOrganization = new Organization({
            });
            for (const key in temOrganization.toObject()) {
                newOrganization[key] = temOrganization[key];
            }
            // Save the new organization
            await newOrganization.save();
            // Delete the tem organization
            await Organization_tem.findByIdAndDelete(organizationId);

            res.status(200).send("Organization approved and moved to organizations collection");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error processing the organization approval");
        }
    } else if (organizationMode === "declined") {
        try {
            // Delete the tem organization
            await Organization_tem.findByIdAndDelete(organizationId);

            res.status(200).send("Organization declined and removed from tem organizations collection");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error processing the organization decline");
        }
    } else {
        res.status(400).send("Invalid organization mode");
    }
});
app.get("/organizations", async (req, res) => {
    const organizationMode = req.query.mode; // Get the query parameter "mode"

    let organizations;

    if (organizationMode === 'approved') {
        organizations = await Organization.find();
    } else if (organizationMode === 'tem') {
        organizations = await Organization_tem.find();
    } else {
        return res.status(400).send("Invalid organization mode");
    }

    res.send(organizations);
});

app.get("/schools", async (req, res) => {
    let schools;
    schools = await School.find();
    res.send(schools);

});

app.post("/addschool", async (req, res) => {
    const schoolName = req.body.schoolName;
    const newSchool = new School({
        name: schoolName,
        points: 0,
    });

    // Save the new school to the database
    const savedSchool = await newSchool.save();
    res.status(201).json(savedSchool);
}
)
app.get('/summary', async (req, res) => {
    const schoolCount = await School.countDocuments();
    const eventCount = await Event.countDocuments();
    const userCount = await User.countDocuments();
    const supervisorCount = await Supervisor.countDocuments();
    const organizationCount = await Organization.countDocuments();
    const temeventCount = await Event_tem.countDocuments();
    const temuserCount = await User_tem.countDocuments();
    const temsupervisorCount = await Supervisor_tem.countDocuments();
    const temorganizationCount = await Organization_tem.countDocuments();

    const summaryData = {
        schoolCount,
        userCount,
        eventCount,
        supervisorCount,
        organizationCount,
        temeventCount,
        temuserCount,
        temsupervisorCount,
        temorganizationCount,
    };
    res.status(200).json(summaryData);
})



const port = process.env.PORT || 3080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});