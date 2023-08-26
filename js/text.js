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
                username: temSupervisor.username,
                date: temSupervisor.date,
                id: temSupervisor.id,
                start_time: {
                    hour: temSupervisor.start_time.hour,
                    minute: temSupervisor.start_time.minute,
                },
                end_time: {
                    hour: temSupervisor.end_time.hour,
                    minute: temSupervisor.end_time.minute,
                },
                location: {
                    street: temSupervisor.location.street,
                    city: temSupervisor.location.city,
                    state: temSupervisor.location.state,
                },
                description: temSupervisor.description,
                supervisor: temSupervisor.supervisor,
                registered: temSupervisor.registered,
                attendents: temSupervisor.attendants
            });

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
