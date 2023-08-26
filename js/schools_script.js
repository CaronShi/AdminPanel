const tableBody = document.querySelector('#school-table tbody');
tableBody.innerHTML = ''; // Clear existing table rows
const endpoint = 'http://localhost:3080/schools';

fetch(endpoint)
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort data by date
        i = 0
        data.forEach(supervisor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${supervisor.name}</td>
                    <td>${supervisor.points}</td>
                    `;
            tableBody.appendChild(row);
            i++
        });
    })
    .catch(error => {
        console.error(error);
    });

document.getElementById("addSchoolForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const schoolName = document.getElementById("schoolName").value;

    // Create an object with the data to send to the server
    const requestData = {
        schoolName: schoolName
    };

    // Send a POST request to the backend
    fetch("http://localhost:3080/addschool", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            console.log("New school added:", data);
            // You can update the UI or show a success message here
        })
        .catch(error => {
            console.error("Error adding school:", error);
            // You can show an error message here
        }).then(() => {
            window.location.href = 'school.html';
        })
});