const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const date = DataView; 
// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'views')));

// API endpoint to fetch data from the NestJS API
app.get('', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/cats'); // Your NestJS API URL
    res.json(response.data);
    console.log(response.data);
    
  } catch (error) {
    res.status(500).send('Error fetching data from NestJS API');
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
