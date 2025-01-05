document.addEventListener("DOMContentLoaded", () => {
    console.log("Dashboard Loaded");

    // Example: Dynamic updates for widgets
    const temperatureWidget = document.querySelector(".widget:nth-child(1) p");
    setInterval(() => {
        const temp = Math.floor(Math.random() * 5) + 28; // Random temperature between 28-33
        temperatureWidget.textContent = `${temp}°C`;
    }, 5000); // Update every 5 seconds

    // Handle search functionality
    const searchForm = document.getElementById("searchForm");
    const districtInput = document.getElementById("districtInput");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form from reloading the page

        const district = districtInput.value.trim();
        if (district) {
            // Redirect to your weather website with the district as a query parameter
            const baseURL = "https://agrisense-60035550612.development.catalystserverless.in/app/index.html";
            const searchURL = `${baseURL}?district=${encodeURIComponent(district)}`;
            window.location.href = searchURL;
        } else {
            alert("Please enter a valid district name.");
        }
    });
});


// document.addEventListener("DOMContentLoaded", () => {
//     console.log("Dashboard Loaded");

//     // Example: Adding dynamic updates to widgets
//     const temperatureWidget = document.querySelector(".widget:nth-child(1) p");
//     setInterval(() => {
//         const temp = Math.floor(Math.random() * 5) + 28; // Random temperature between 28-33
//         temperatureWidget.textContent = `${temp}°C`;
//     }, 5000); // Update every 5 seconds
// });

// document.addEventListener("DOMContentLoaded", () => {
//     console.log("Dashboard Loaded");

//     // Example: Dynamic updates for widgets
//     const temperatureWidget = document.querySelector(".widget:nth-child(1) p");
//     setInterval(() => {
//         const temp = Math.floor(Math.random() * 5) + 28; // Random temperature between 28-33
//         temperatureWidget.textContent = `${temp}°C`;
//     }, 5000); // Update every 5 seconds

//     // Handle search functionality
//     const searchForm = document.getElementById("searchForm");
//     const districtInput = document.getElementById("districtInput");

//     searchForm.addEventListener("submit", (event) => {
//         event.preventDefault(); // Prevent form from reloading the page

//         const district = districtInput.value.trim();
//         if (district) {
//             // Redirect to your weather website with the district as a query parameter
//             const baseURL = "https://agrisense-60035550612.development.catalystserverless.in/app/index.html";
//             const searchURL = `${baseURL}?district=${encodeURIComponent(district)}`;
//             window.location.href = searchURL;
//         } else {
//             alert("Please enter a valid district name.");
//         }
//     });
// });



// Modification on existing website (index.html "The frontend deployed code")
// The code should be added to javascript file (script.js) related with index.html file 
// when using this dashbpard.html file

// // On your existing website (index.html)
// document.addEventListener("DOMContentLoaded", () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const district = urlParams.get("district");

//     if (district) {
//         console.log(`Fetching weather data for: ${district}`);
//         // Replace this with your data fetching logic
//         fetchWeatherData(district);
//     } else {
//         console.log("No district specified in the query.");
//     }
// });

// function fetchWeatherData(district) {
//     // Example: Simulate API call
//     console.log(`Simulating fetch for district: ${district}`);
//     // Use AJAX/Fetch API here to get weather data based on the district
// }
