import express from 'express';
import bcrypt from 'bcrypt';
const saltRounds = 10;
import cors from 'cors';
import knex from 'knex';

// these setting are not secure but for just my personal project
const db = knex({
    client: 'pg',
    //where are database will be on a hosted platform
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },  
        host: DATABASE_HOST,
        port: 5432,
        user: DATABASE_USER,
        password: DATABASE_PW,
        database: DATABASE_DB 
    }
});

import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfileGet from './controllers/profile.js';
import { handleImage, handleAPICall } from './controllers/image.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('success');
})

app.post('/signin', (req, res) => {
    handleSignin(req, res, db, bcrypt)
})

app.post('/register', (req, res) => { 
    handleRegister(req, res, db, bcrypt, saltRounds) 
});

app.get('/profile/:id', (req, res) => {
    handleProfileGet(req, res, db)
})

app.put('/image', (req, res) => {
    handleImage(req, res, db)
})

app.post('/imageurl', (req, res) => { 
    handleAPICall(req, res)
})

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
    console.log(`server is running on port ${PORT}`)
});