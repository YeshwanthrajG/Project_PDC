const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for a specific domain
app.use(cors({
    origin: 'https://agrisense-60035550612.development.catalystserverless.in', // Allowed domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials if required
}));

// Preflight request handler for all routes
app.options('*', cors()); 


app.get("/predict", async (req, res) => {
    const { temperature, humidity } = req.query;
  
    if (!temperature || !humidity) {
      return res.status(400).json({ error: "Temperature and humidity are required." });
    }
  
    try {
      // Forward the request to the Plumber API
      const response = await axios.get("http://localhost:8000/predict", {
        params: { temperature, humidity },
      });
  
      // Send the response from the R API back to the client
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching data from Plumber API:", error.message);
      res.status(500).json({ error: "Failed to fetch prediction from the R API." });
    }
  });
  
// Example route
// app.get('/predict', (req, res) => {
//     const { temperature, humidity } = req.query;
//     if (!temperature || !humidity) {
//         return res.status(400).json({ error: 'Missing parameters!' });
//     }
//     res.json({ message: 'Prediction successful!', temperature, humidity });
// });

// Start the server
// const port = process.env.PORT || 3000;
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



// const express = require('express');
// const cors = require('cors');
// const app = express();

// // Add CORS middleware with specific allowed origin
// app.use(cors({
//     //origin: 'https://agrisense-60035550612.development.catalystserverless.in', // Allow this domain

//     // origin: [
//     //     'https://agrisense-60035550612.development.catalystserverless.in',
//     //     'http://127.0.0.1:5500'
//     // ],

//     origin: "*",
//     methods: ['GET', 'POST', 'PUT', 'DELETE' , 'OPTIONS'], // Allowed HTTP methods
//     allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
// }));

// // Example route
// app.get('/predict', (req, res) => {
//     res.json({ message: 'Prediction successful!' });
// });

// // const port = process.env.PORT || 3000;
// // app.listen(port, () => {
// //     console.log(`Server running on port ${port}`);
// // });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong!' });
// });





// const express = require("express");
// const bodyParser = require("body-parser");
// const { exec } = require("child_process");
// const app = express();

// app.use(bodyParser.json());

// // Endpoint to run the R script
// app.post("/run-r-script", (req, res) => {
//     exec("Rscript backend/api.R", (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error: ${stderr}`);
//             return res.status(500).send(stderr);
//         }
//         res.send(stdout);
//     });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
