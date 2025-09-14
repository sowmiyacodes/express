const express = require('express');
const oracledb = require('oracledb');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());  // <-- This parses JSON request bodies
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
    user: 'system',
    password: 'Sow@#124',
    connectString: 'localhost/XE'
};

app.get('/',(req,res)=>{
    res.send('Welcome to oracle db crud api');
});

app.get('/users', async (req, res) => {
    let connection = await oracledb.getConnection(dbConfig);
    let result = await connection.execute('SELECT * FROM USERS');
    await connection.close();
    res.send(result.rows);
});
app.post('/users',async(req,res)=>{
    
    const {name,email} = req.body;
    let connection = await oracledb.getConnection(dbConfig);
    const sql = 'insert into users (name,email) values (:name,:email) returning id into :id';
    const result = await connection.execute(sql,
        {
            name,email,id:{dir: oracledb.BIND_OUT, type: oracledb.NUMBER}
        },
        {autoCommit : true}
    );
    await connection.close();
    res.send(`User inserted with ID: ${result.outBinds.id[0]}`);

});

app.listen(3000, () => {
    console.log('Server listening at http://localhost:3000');
});