const express = require('express');
const oracledb = require('oracledb');

// Initialize Express application
const app = express();


// Oracle connection setup
const dbConfig = {
    user: 'system',
    password: 'Sow@#124',
    connectString: 'localhost/XE' // replace with your Oracle connection string
};

// Connect to MySQL



// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Oracle CRUD API!');
});


// Get all users
app.get('/users', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log('OracleDB connected...');

    const result = await connection.execute('SELECT * FROM users');
    
    res.send(result.rows);  // You can format the result as needed
  } catch (err) {
    console.error('Error accessing Oracle Database:', err);
    res.status(500).send('Database error');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Start the server
app.listen(5000, () => {
    console.log('Server listening at http://localhost:5000');
});