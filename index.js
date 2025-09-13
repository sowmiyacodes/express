const express = require('express');
const oracledb = require('oracledb');

const app = express();
app.use(express.json());  // <-- This parses JSON request bodies
app.use(express.urlencoded({ extended: true }));

// Oracle connection setup
const dbConfig = {
    user: 'system',
    password: 'Sow@#124',
    connectString: 'localhost/XE'
};

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Oracle CRUD API!');
});

// Get all users
app.get('/users', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT * FROM users');
    res.send(result.rows);
  } catch (err) {
    console.error('Error accessing Oracle Database:', err);
    res.status(500).send('Database error');
  } finally {
    if (connection) await connection.close();
  }
});

// Insert user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;  // works with form input now
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const sql = `INSERT INTO users (name, email) VALUES (:name, :email)
                 RETURNING id INTO :id`;

    const result = await connection.execute(
      sql,
      {
        name,
        email,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.send(`User inserted with ID: ${result.outBinds.id[0]}`);
  } catch (err) {
    console.error('Insert Error:', err);
    res.status(500).send(err.message);
  } finally {
    if (connection) await connection.close();
  }
});


// Start server
app.listen(5000, () => {
    console.log('Server listening at http://localhost:5000');
});
