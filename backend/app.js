import express from 'express';
import cors from 'cors';
import {
    getUsers,
    getUser,
    registerUser,
    deleteUser,
    updateUserInfo
} from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', ( req, res ) =>{
    res.send('Server is Running!!');
});

app.get('/users',async ( req, res ) =>{
    const users = await getUsers();
    res.status(200).send(users);
});

app.post('/users',async ( req, res ) =>{
    const { userName, userEmail, userPassword } = req.body;
    const user = await registerUser(userName, userEmail, userPassword);
    if(user){
        res.status(201).send(user);
        return;
    }
    res.status(423).send('User already exists!!');
});

app.get('/user/:id',async ( req, res ) =>{
    const { id } = req.params;
    const user = await getUser(id);
    if(user){
        res.status(200).send(user);
        return;
    }
    res.status(423).send('User doesn\'t exist!!');
});

app.delete('/user/:id', async ( req, res ) =>{
    const { id } = req.params;
    const { success } = await deleteUser(id);
    console.log(success);
    if(success){
        res.status(200).send('Deletion Successful');
        return;
    }
    res.status(423).send('Deletion Failed');
})

app.patch('/user/:id', async ( req, res ) =>{
    const { id } = req.params;
    const { userName, userEmail, userPassword } = req.body;
    const { success, user } = await updateUserInfo( id, userName, userEmail, userPassword );
    if(success){
        res.status(200).send(user);
        return;
    }
    res.status(423).send('Update failed');
})

app.listen(process.env.SERVER_PORT, () =>{
    console.log('Server is running on ' + process.env.SERVER_PORT);
    console.log(`Listening on http://localhost:${process.env.SERVER_PORT}/`);
})