import express from 'express';
import cors from 'cors';
import {
    getUsers,
    getUser,
    registerUser,
    deleteUser,
    updateUserInfo,
    validateLogin
} from './database.js';
import { hashPassword } from './utilities.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', ( req, res ) =>{
    res.send('Server is Running!!');
});

app.get('/users',async ( req, res ) =>{
    const { users, error } = await getUsers();
    if(error){
        res.status(500).send(error + ': Error Occurred while fetching users');
        return;
    }
    res.status(200).send(users);
});

app.post('/users',async ( req, res ) =>{
    const { userName, userEmail, userPassword } = req.body;
    if(!userName || !userPassword || !userPassword){
        res.status(423).send('Please provide all the details');
        return;
    }
    const hash = await hashPassword(userPassword);
    const { user, error } = await registerUser(userName, userEmail, hash);
    if(error){
        res.status(500).send(error + ': Error Occurred while Registering Users');
        return;
    }
    if(user){
        res.status(201).send(user);
        return;
    }
    res.status(423).send('User already exists!!');
});

app.get('/user/:id',async ( req, res ) =>{
    const { id } = req.params;
    if(!parseInt(id)){
        res.status(423).send('Enter a valid id');
        return;
    }
    const { user, error } = await getUser(id);
    if(error){
        res.status(500).send(error + ': Error Occurred while Registering User');
        return;
    }
    if(user){
        res.status(200).send(user);
        return;
    }
    res.status(423).send('User doesn\'t exist!!');
});

app.delete('/user/:id', async ( req, res ) =>{
    const { id } = req.params;
    if(!parseInt(id)){
        res.status(423).send('Enter a valid id');
        return;
    }
    const { success, error } = await deleteUser(id);
    if(error){
        res.status(500).send(error + ': Error Occurred while Deleting User');
        return;
    }
    if(success){
        res.status(200).send('Deletion Successful!!');
        return;
    }
    res.status(423).send('Deletion Failed!!');
});

app.patch('/user/:id', async ( req, res ) =>{
    const { id } = req.params;
    if(!parseInt(id)){
        res.status(423).send('Enter a valid id');
        return;
    }
    const { userName, userEmail, userPassword } = req.body;
    if(!userName || !userPassword || !userPassword){
        res.status(423).send('Please provide all the details');
        return;
    }
    const { success, error } = await updateUserInfo( id, userName, userEmail, userPassword );
    if(error){
        res.status(500).send(error + ': Error Occurred while Updating User Info');
        return;
    }
    if(success){
        res.status(200).send('Update successful!!');
        return;
    }
    res.status(423).send('Update failed!!');
});

app.post('/user/login', async ( req, res ) =>{
    const { userName, userPassword } = req.body;
    if(!userName || !userPassword){
        res.status(423).send('Please provide all the details');
        return;
    }
    const { user, validate, error } = await validateLogin(userName, userPassword);
    if(error){
        res.status(500).send(error + ': Error Occurred while Logging In');
        return;
    }
    if(!user){
        res.status(423).send('User doesn\'t exist!!');
        return;
    }
    if(validate){
        res.status(200).send('Welcome ' + user.userName);
        return;
    }
    res.status(423).send('Password doesn\'t match!!');
});

app.listen(process.env.SERVER_PORT, () =>{
    console.log('Server is running on ' + process.env.SERVER_PORT);
    console.log(`Listening on http://localhost:${process.env.SERVER_PORT}/`);
});