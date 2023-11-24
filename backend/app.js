import express from 'express';
import cors from 'cors';
import {
    getUsers,
    getUser,
    registerUser
} from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/users',async ( req, res ) =>{
    const users = await getUsers();
    res.status(200).send(users);
});

app.post('/users',async ( req, res ) =>{
    const { userName, userEmail, userPassword } = req.body;
    const user = await registerUser(userName, userEmail, userPassword);
    res.status(201).send(user);
});

app.get('/user/:id',async ( req, res ) =>{
    const { id } = req.params;
    const user = await getUser(id);
    res.status(200).send(user);
});
//TODO: have to hide server port using dotenv.
app.listen(8080, () =>{
    console.log('Server is running on ' + 8080);
})