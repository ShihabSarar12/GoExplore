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
    if(user){
        res.status(201).send(user);
    }
    else{
        res.status(423).send('User already exists!!');
    }
    
});

app.get('/user/:id',async ( req, res ) =>{
    const { id } = req.params;
    const user = await getUser(id);
    res.status(200).send(user);
});

app.listen(process.env.SERVER_PORT, () =>{
    console.log('Server is running on ' + process.env.SERVER_PORT);
})