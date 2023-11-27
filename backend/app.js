import express from 'express';
import cors from 'cors';
import {
    getUsers,
    getUser,
    registerUser,
    deleteUser,
    updateUserInfo,
    hashPassword,
    validateLogin
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
    const hash = await hashPassword(userPassword);
    const user = await registerUser(userName, userEmail, hash);
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
        res.status(200).send('Deletion Successful!!');
        return;
    }
    res.status(423).send('Deletion Failed!!');
})

app.patch('/user/:id', async ( req, res ) =>{
    const { id } = req.params;
    const { userName, userEmail, userPassword } = req.body;
    const { success } = await updateUserInfo( id, userName, userEmail, userPassword );
    if(success){
        res.status(200).send('Update successful!!');
        return;
    }
    res.status(423).send('Update failed!!');
})

app.post('/user/login', async ( req, res ) =>{
    const { userName, userPassword } = req.body;
    const { user, validate } = await validateLogin(userName, userPassword);
    if(!user){
        res.status(423).send('User doesn\'t exist!!');
        return;
    }
    if(validate){
        res.status(200).send('Welcome ' + user.userName);
        return;
    }
    res.status(423).send('Password doesn\'t match!!');
})

app.listen(process.env.SERVER_PORT, () =>{
    console.log('Server is running on ' + process.env.SERVER_PORT);
    console.log(`Listening on http://localhost:${process.env.SERVER_PORT}/`);
})