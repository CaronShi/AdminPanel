let approvedEventData = [];
let temEventData = [];

function switchtab(tab) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(navLink => {
        const isCurrentTab = navLink.getAttribute('aria-controls') === `nav-${tab}`;
        navLink.classList.toggle('active', isCurrentTab);
        navLink.setAttribute('aria-selected', isCurrentTab ? 'true' : 'false');
    });

    fetchAndPopulateApprovedSupervisorsTable(tab);

}
//default switchtab in approved
switchtab('approved')



//supervisor page
function fetchAndPopulateApprovedSupervisorsTable(tab) {
    const tableBody = document.querySelector('#supervisors-table tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    const endpoint = tab === 'approved' ? 'http://localhost:3080/supervisors?mode=approved' : 'http://localhost:3080/supervisors?mode=tem';

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort data by date

            if (tab === 'approved') {
                this.approvedSupervisorData = data
            }
            else if (tab === 'tem') {
                this.temSupervisorData = data
            }
            i = 0
            data.forEach(supervisor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${supervisor.username}</td>
                    <td>${supervisor.email}</td>
                    <td>${supervisor.phone}</td>
                    <td>${supervisor.firstname}</td>
                    <td>${supervisor.lastname}</td>
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
    const supervisorData = tab === 'approved' ? this.approvedSupervisorData : this.temSupervisorData;
    const matchedSupervisor = supervisorData[index];
    const tabDiv = document.getElementById("supervisors-content")
    const supervisorDetailsDiv = document.getElementById('supervisor-details');

    // Toggle visibility of supervisor-details div
    if (supervisorDetailsDiv.style.display === 'none') {
        supervisorDetailsDiv.style.display = 'block';
        tabDiv.style.display = 'None';

        if (tab === "tem") {
            const supervisorDetailsHTML = `
            <button id="backToListButton" type="button" class="btn btn-ghost-secondary">Back to List</button>
            <h2>${matchedSupervisor.username}</h2>
            <p>Email: ${matchedSupervisor.email}</p>
            <p>Phone: ${matchedSupervisor.phone}</p>
            <p>First Name: ${matchedSupervisor.firstname}</p>
            <p>Last Name: ${matchedSupervisor.lastname}</p>
            <p>Event Supervised: ${matchedSupervisor.eventsupervise}</p>
        <button id="approvedbtn" type="button" class="btn btn-outline-success">Approved</button>
        <button id="declinedbtn"   type="button" class="btn btn-outline-danger">Declined</button> `;
            // Set the supervisor details HTML and handle the "Back to List" button click
            supervisorDetailsDiv.innerHTML = supervisorDetailsHTML;
            document.getElementById("approvedbtn").addEventListener("click", function () {
                performSupervisorAction(matchedSupervisor._id, "approved");
            });
            document.getElementById("declinedbtn").addEventListener("click", function () {
                performSupervisorAction(matchedSupervisor._id, "declined");
            });
        } else {
            const supervisorDetailsHTML = `
            <button id="backToListButton" type="button" class="btn btn-ghost-secondary">Back to List</button>
                <h2>${matchedSupervisor.username}</h2>
                <p>Email: ${matchedSupervisor.email}</p>
                <p>Phone: ${matchedSupervisor.phone}</p>
                <p>First Name: ${matchedSupervisor.firstname}</p>
                <p>Last Name: ${matchedSupervisor.lastname}</p>
                <p>Event Supervised: ${matchedSupervisor.eventsupervise}</p>
            `;
            // Set the supervisor details HTML and handle the "Back to List" button click
            supervisorDetailsDiv.innerHTML = supervisorDetailsHTML;
        }



        // Get the "Back to List" button after it's inserted into the DOM
        const backToListButton = document.getElementById('backToListButton');

        // Handle "Back to List" button click
        backToListButton.addEventListener('click', () => {
            supervisorDetailsDiv.style.display = 'none'; // Hide the details
            tabDiv.style.display = 'block';
        });
    }

    else {
        supervisorDetailsDiv.style.display = 'none'; // Hide the details
        tabDiv.style.display = 'block';
    }


}
function performSupervisorAction(supervisorId, mode) {
    console.log(" performSupervisorAction", supervisorId, mode)
    const requestBody = {
        supervisorId: supervisorId
    };

    fetch(`http://localhost:3080/supervisoraction?mode=${mode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        if (response.ok) {
            // Handle success
            console.log(`Supervisor ${mode}d successfully`);
            // Refresh or update the supervisor list as needed
        } else {
            // Handle error
            console.error(`Error ${mode}ing supervisor`);
        }
    }).then(() => {
        window.location.href = 'supervisors.html';
    })
        .catch(error => {
            console.error(error);
        });

}

