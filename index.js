const express = require('express');
const oracledb = require('oracledb');

// Initialize Express application
const app = express();
app.use(express.json());

// Oracle connection setup
const dbConfig = {
    user: 'system',
    password: 'Sow@#124',
    connectString: 'localhost/XEPDB1' // replace with your Oracle connection string
};

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Oracle CRUD API!');
});

// Create a new user
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const connection = await oracledb.getConnection(dbConfig);

    const sql = `INSERT INTO users (name, email) VALUES (:name, :email) RETURNING id INTO :id`;
    const binds = { name, email, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } };

    const result = await connection.execute(sql, binds, { autoCommit: true });
    res.status(201).send({ id: result.outBinds.id[0], name, email });

    await connection.close();
});

// Get all users
app.get('/users', async (req, res) => {
    const connection = await oracledb.getConnection(dbConfig);

    const sql = 'SELECT * FROM users';
    console.log(sql);
    const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.send(result.rows);

    await connection.close();
});

// Update a user
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const connection = await oracledb.getConnection(dbConfig);

    const sql = 'UPDATE users SET name = :name, email = :email WHERE id = :id';
    const result = await connection.execute(sql, { name, email, id }, { autoCommit: true });

    if (result.rowsAffected === 0) {
        res.status(404).send('User not found');
    } else {
        res.send({ id, name, email });
    }

    await connection.close();
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await oracledb.getConnection(dbConfig);

    const sql = 'DELETE FROM users WHERE id = :id';
    const result = await connection.execute(sql, { id }, { autoCommit: true });

    if (result.rowsAffected === 0) {
        res.status(404).send('User not found');
    } else {
        res.send('User deleted');
    }

    await connection.close();
});

// Start the server
app.listen(5000, () => {
    console.log('Server listening at http://localhost:5000');
});
