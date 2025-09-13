const express = require('express');
const oracledb = require('oracledb');

// Initialize Express application
const app = express();


// Oracle connection setup
const dbConfig = {
    user: 'system',
    password: 'Sow@#124',
    connectString: 'localhost/XEPDB1' // replace with your Oracle connection string
};

// Connect to MySQL



// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Oracle CRUD API!');
});


// Get all users
app.get('/users', (req, res) => {

    try{
	const dbconnect = oracledb.getConnection(dbConfig);
	 console.log('MySQL connected...');
}
catch(err)
{
	console.log('Error connecting to Oracle Database:', err);
}
    const sql = 'SELECT * FROM users';
    console.log(sql);
    const result =  dbconnect.execute(sql);
    res.send(result.rows);
});


// Start the server
app.listen(5000, () => {
    console.log('Server listening at http://localhost:5000');
});