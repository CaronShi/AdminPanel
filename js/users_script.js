let approvedEventData = [];
let temEventData = [];

function switchtab(tab) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(navLink => {
        const isCurrentTab = navLink.getAttribute('aria-controls') === `nav-${tab}`;
        navLink.classList.toggle('active', isCurrentTab);
        navLink.setAttribute('aria-selected', isCurrentTab ? 'true' : 'false');
    });

    fetchAndPopulateApprovedUsersTable(tab);

}
//default switchtab in approved
switchtab('approved')



//user page
function fetchAndPopulateApprovedUsersTable(tab) {
    const tableBody = document.querySelector('#users-table tbody');
    tableBody.innerHTML = ''; // Clear existing table rows
    const endpoint = tab === 'approved' ? 'http://localhost:3080/users?mode=approved' : 'http://localhost:3080/users?mode=tem';

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort data by date

            if (tab === 'approved') {
                this.approvedUserData = data
            }
            else if (tab === 'tem') {
                this.temUserData = data
            }
            i = 0
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.points}</td>
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
    const userData = tab === 'approved' ? this.approvedUserData : this.temUserData;
    const matchedUser = userData[index];
    const tabDiv = document.getElementById("users-content")
    const userDetailsDiv = document.getElementById('user-details');

    // Toggle visibility of user-details div
    if (userDetailsDiv.style.display === 'none') {
        userDetailsDiv.style.display = 'block';
        tabDiv.style.display = 'None';

        if (tab === "tem") {
            const userDetailsHTML = `
            <button id="backToListButton" type="button" class="btn btn-ghost-secondary">Back to List</button>
            <h2>${matchedUser.username}</h2>
            <p>First Name: ${matchedUser.firstname}</p>
            <p>Last Name: ${matchedUser.lastname}</p>
            <p>Email: ${matchedUser.email}</p>
            <p>Points: ${matchedUser.points}</p>
            <p>Events Attended: ${matchedUser.eventsAttended}</p>
            <p>School: ${matchedUser.school}</p>
        <button id="approvedbtn" type="button" class="btn btn-outline-success">Approved</button>
        <button id="declinedbtn"   type="button" class="btn btn-outline-danger">Declined</button> `;
            // Set the user details HTML and handle the "Back to List" button click
            userDetailsDiv.innerHTML = userDetailsHTML;
            document.getElementById("approvedbtn").addEventListener("click", function () {
                performUserAction(matchedUser._id, "approved");
            });
            document.getElementById("declinedbtn").addEventListener("click", function () {
                performUserAction(matchedUser._id, "declined");
            });
        } else {
            const userDetailsHTML = `
            <button id="backToListButton" type="button" class="btn btn-ghost-secondary">Back to List</button>
                <h2>${matchedUser.username}</h2> 
                <p>First Name: ${matchedUser.firstname}</p>
                <p>Last Name: ${matchedUser.lastname}</p>
                <p>Email: ${matchedUser.email}</p>
                <p>Points: ${matchedUser.points}</p>
                <p>Events Attended: ${matchedUser.eventsAttended}</p>
                <p>School: ${matchedUser.school}</p>
            `;
            // Set the user details HTML and handle the "Back to List" button click
            userDetailsDiv.innerHTML = userDetailsHTML;
        }



        // Get the "Back to List" button after it's inserted into the DOM
        const backToListButton = document.getElementById('backToListButton');

        // Handle "Back to List" button click
        backToListButton.addEventListener('click', () => {
            userDetailsDiv.style.display = 'none'; // Hide the details
            tabDiv.style.display = 'block';
        });
    }

    else {
        userDetailsDiv.style.display = 'none'; // Hide the details
        tabDiv.style.display = 'block';
    }


}
function performUserAction(userId, mode) {
    console.log(" performUserAction", userId, mode)
    const requestBody = {
        userId: userId
    };

    fetch(`http://localhost:3080/useraction?mode=${mode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        if (response.ok) {
            // Handle success
            console.log(`User ${mode}d successfully`);
            // Refresh or update the user list as needed
        } else {
            // Handle error
            console.error(`Error ${mode}ing user`);
        }
    }).then(() => {
        window.location.href = 'users.html';
    })
        .catch(error => {
            console.error(error);
        });

}

