let approvedEventData = [];
let temEventData = [];

function switchtab(tab) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(navLink => {
        const isCurrentTab = navLink.getAttribute('aria-controls') === `nav-${tab}`;
        navLink.classList.toggle('active', isCurrentTab);
        navLink.setAttribute('aria-selected', isCurrentTab ? 'true' : 'false');
    });

    fetchAndPopulateApprovedOrganizationsTable(tab);

}
//default switchtab in approved
switchtab('approved')



//organization page
function fetchAndPopulateApprovedOrganizationsTable(tab) {
    const tableBody = document.querySelector('#organizations-table tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    const endpoint = tab === 'approved' ? 'http://localhost:3080/organizations?mode=approved' : 'http://localhost:3080/organizations?mode=tem';

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort data by date

            if (tab === 'approved') {
                this.approvedOrganizationData = data
            }
            else if (tab === 'tem') {
                this.temOrganizationData = data
            }
            i = 0
            data.forEach(organization => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${organization.name}</td>
                    <td>${organization.email}</td>
                    <td>${organization.phone}</td>
                    <td>${organization.location}</td>
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
    const organizationData = tab === 'approved' ? this.approvedOrganizationData : this.temOrganizationData;
    const matchedOrganization = organizationData[index];
    const tabDiv = document.getElementById("organizations-content")
    const organizationDetailsDiv = document.getElementById('organization-details');

    // Toggle visibility of organization-details div
    if (organizationDetailsDiv.style.display === 'none') {
        organizationDetailsDiv.style.display = 'block';
        tabDiv.style.display = 'None';

        if (tab === "tem") {
            const organizationDetailsHTML = `
            <button id="backToListButton" type="button" class="btn btn-ghost-secondary">Back to List</button>
            <h2> ${matchedOrganization.name}</h2>
            <p>Email: ${matchedOrganization.email}</p>
            <p>Phone: ${matchedOrganization.phone}</p>
            <p>Location: ${matchedOrganization.location}</p>
        <button id="approvedbtn" type="button" class="btn btn-outline-success">Approved</button>
        <button id="declinedbtn"   type="button" class="btn btn-outline-danger">Declined</button> `;
            // Set the organization details HTML and handle the "Back to List" button click
            organizationDetailsDiv.innerHTML = organizationDetailsHTML;
            document.getElementById("approvedbtn").addEventListener("click", function () {
                performOrganizationAction(matchedOrganization._id, "approved");
            });
            document.getElementById("declinedbtn").addEventListener("click", function () {
                performOrganizationAction(matchedOrganization._id, "declined");
            });
        } else {
            const organizationDetailsHTML = `
            <button id="backToListButton" type="button" class="btn btn-ghost-secondary">Back to List</button>
        
                <h2>${matchedOrganization.name}</h2>
                <p>Email: ${matchedOrganization.email}</p>
                <p>Phone: ${matchedOrganization.phone}</p>
                <p>Location: ${matchedOrganization.location}</p>
            `;
            // Set the organization details HTML and handle the "Back to List" button click
            organizationDetailsDiv.innerHTML = organizationDetailsHTML;
        }



        // Get the "Back to List" button after it's inserted into the DOM
        const backToListButton = document.getElementById('backToListButton');

        // Handle "Back to List" button click
        backToListButton.addEventListener('click', () => {
            organizationDetailsDiv.style.display = 'none'; // Hide the details
            tabDiv.style.display = 'block';
        });
    }

    else {
        organizationDetailsDiv.style.display = 'none'; // Hide the details
        tabDiv.style.display = 'block';
    }


}
function performOrganizationAction(organizationId, mode) {
    console.log(" performOrganizationAction", organizationId, mode)
    const requestBody = {
        organizationId: organizationId
    };

    fetch(`http://localhost:3080/organizationaction?mode=${mode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        if (response.ok) {
            // Handle success
            console.log(`Organization ${mode}d successfully`);
            // Refresh or update the organization list as needed
        } else {
            // Handle error
            console.error(`Error ${mode}ing organization`);
        }
    }).then(() => {
        window.location.href = 'organizations.html';
    })
        .catch(error => {
            console.error(error);
        });

}

