// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'zithara',
  password: '12345',
  port: 5432,
});

client.connect();

// Get paginated and sorted data
app.get('/customers', async (req, res) => {
  const { page = 1, sortBy, search } = req.query;
  const offset = (page - 1) * 20;

  let query = `SELECT sno, customer_name, age, phone, location, created_at::date as date, created_at::time as time FROM users order by sno OFFSET ${offset} LIMIT 20`;

  if (sortBy === 'date') {
    query = `SELECT sno, customer_name, age, phone, location, created_at::date as date, created_at::time as time FROM users ORDER BY DATE(created_at) ASC OFFSET ${offset} LIMIT 20`;
  } else if (sortBy === 'time') {
    query = `SELECT sno, customer_name, age, phone, location, created_at::date as date, created_at::time as time FROM users ORDER BY created_at::time ASC OFFSET ${offset} LIMIT 20`;
  }

  if (search) {
    query = `SELECT sno, customer_name, age, phone, location, created_at::date as date, created_at::time as time 
    FROM users 
    WHERE customer_name ILIKE '${search}%' OR location ILIKE '${search}%' 
    OFFSET ${offset} LIMIT 20
    `;
  }

  try {
    const result = await client.query(query);
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
