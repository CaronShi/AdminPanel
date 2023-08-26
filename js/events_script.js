let approvedEventData = [];
let temEventData = [];

function switchtab(tab) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(navLink => {
        const isCurrentTab = navLink.getAttribute('aria-controls') === `nav-${tab}`;
        navLink.classList.toggle('active', isCurrentTab);
        navLink.setAttribute('aria-selected', isCurrentTab ? 'true' : 'false');
    });

    fetchAndPopulateApprovedEventsTable(tab);

}
//default switchtab in approved
switchtab('approved')

//events page
function fetchAndPopulateApprovedEventsTable(tab) {
    const tableBody = document.querySelector('#events-table tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    const endpoint = tab === 'approved' ? 'http://localhost:3080/events?mode=approved' : 'http://localhost:3080/events?mode=tem';

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort data by date

            if (tab === 'approved') {
                this.approvedEventData = data
            }
            else if (tab === 'tem') {
                this.temEventData = data
            }
            i = 0
            data.forEach(event => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${event.name}</td>
                    <td>${event.date}</td>
                    <td>${event.location.state}</td>
                    <td><button type="button" class="btn btn-outline-primary" onclick="navigateToDetailPage('${tab}', '${i}')">Details</button></td>`;
                tableBody.appendChild(row);
                i++
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function navigateToDetailPage(tab, index) {
    const eventData = tab === 'approved' ? this.approvedEventData : this.temEventData;
    const matchedEvent = eventData[index];
    const tabDiv = document.getElementById("events-content")
    const eventDetailsDiv = document.getElementById('event-details');

    // Toggle visibility of event-details div
    if (eventDetailsDiv.style.display === 'none') {
        eventDetailsDiv.style.display = 'block';
        tabDiv.style.display = 'None';

        if (tab === "tem") {
            const eventDetailsHTML = `
            <button id="backToListButton" type="button" class="btn btn-ghost-secondary">Back to List</button>
            <h2>${matchedEvent.name}</h2>
            <p>Date: ${matchedEvent.date}</p>
            <p>Time: ${matchedEvent.start_time.hour}:${matchedEvent.start_time.minute} to ${matchedEvent.end_time.hour}:${matchedEvent.end_time.minute}</p>
            <p>Description: ${matchedEvent.description}</p>
            <p>Location: ${matchedEvent.location.state},${matchedEvent.location.city}, ${matchedEvent.location.street}</p>
            <p>Registered User: ${matchedEvent.registered}</p>
            <p>Supervisor: ${matchedEvent.supervisor}</p>
        <button id="approvedbtn" type="button" class="btn btn-outline-success">Approved</button>
        <button id="declinedbtn"   type="button" class="btn btn-outline-danger">Declined</button> `;
            // Set the event details HTML and handle the "Back to List" button click
            eventDetailsDiv.innerHTML = eventDetailsHTML;
            document.getElementById("approvedbtn").addEventListener("click", function () {
                performEventAction(matchedEvent._id, "approved");
            });
            document.getElementById("declinedbtn").addEventListener("click", function () {
                performEventAction(matchedEvent._id, "declined");
            });
        } else {
            const eventDetailsHTML = `
            <button id="backToListButton" type="button" class="btn btn-ghost-secondary">Back to List</button>
                <h2>${matchedEvent.name}</h2>
                <p>Date: ${matchedEvent.date}</p>
                <p>Time: ${matchedEvent.start_time.hour}:${matchedEvent.start_time.minute} to ${matchedEvent.end_time.hour}:${matchedEvent.end_time.minute}</p>
                <p>Description: ${matchedEvent.description}</p>
                <p>Location: ${matchedEvent.location.state},${matchedEvent.location.city}, ${matchedEvent.location.street}</p>
                <p>Registered User: ${matchedEvent.registered}</p>
                <p>Supervisor: ${matchedEvent.supervisor}</p>
            `;
            // Set the event details HTML and handle the "Back to List" button click
            eventDetailsDiv.innerHTML = eventDetailsHTML;
        }



        // Get the "Back to List" button after it's inserted into the DOM
        const backToListButton = document.getElementById('backToListButton');

        // Handle "Back to List" button click
        backToListButton.addEventListener('click', () => {
            eventDetailsDiv.style.display = 'none'; // Hide the details
            tabDiv.style.display = 'block';
        });
    }

    else {
        eventDetailsDiv.style.display = 'none'; // Hide the details
        tabDiv.style.display = 'block';
    }


}
function performEventAction(eventId, mode) {
    console.log(" performEventAction", eventId, mode)
    const requestBody = {
        eventId: eventId
    };

    fetch(`http://localhost:3080/eventaction?mode=${mode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        if (response.ok) {
            // Handle success
            console.log(`Event ${mode}d successfully`);
            // Refresh or update the event list as needed
        } else {
            // Handle error
            console.error(`Error ${mode}ing event`);
        }
    }).then(() => {
        window.location.href = 'events.html';
    })
        .catch(error => {
            console.error(error);
        });

}
