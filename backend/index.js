// Import required modules
import express from 'express'; // Import the Express framework
import bodyParser from 'body-parser'; // Import the body-parser for parsing JSON request bodies
import cors from 'cors'; // Import CORS for cross-origin requests (optional, for frontend-backend interaction)
import axios from 'axios';


/** const express = require('express'); // Import the Express framework
const bodyParser = require('body-parser'); // Import the body-parser for parsing JSON request bodies
const cors = require('cors'); // Import CORS for cross-origin requests (optional, for frontend-backend interaction)
**/

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/random-user', async(req,res) => {
    try{
        const response = await axios.get('https://randomuser.me/api/');
        const randomUser = response.data.results[0];
        res.json(randomUser);

    }catch{
        console.log("Cant get randomUser from the endPoint" , error);
        res.status(500).json({error : 'Cant get randomUser from the endPoint'});

    }
});


app.get('/Multiple-random-user', async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page is provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page if not specified
    
        // Calculate the offset based on page and limit
        const offset = (page - 1) * limit;
    
        // Fetch random users with pagination support
        const response = await axios.get(`https://randomuser.me/api/?results=50`);
        const users = response.data.results;
    
        // Paginate the data
        const paginatedUsers = users.slice(offset, offset + limit);
        res.json({
            users: paginatedUsers,
            total: users.length,
            page,
            limit,
            totalPages: Math.ceil(users.length / limit)
          });
        } catch (error) {
          console.error('Error fetching random users:', error);
          res.status(500).json({ error: 'Failed to fetch users' });
        }
    }
); 

app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
  });

// https://randomuser.me/api/?results=5000