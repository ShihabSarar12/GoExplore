import express from 'express';
import cors from 'cors';
import {
    registerUser,
    updateUserInfo,
    validateLogin,
    initDB,
    getAll,
    getSingle,
    deleteSingle,
    getTotalBookings,
    getTotalUsers,
    getTotalPrices
} from './app/database.js';
import { hashPassword } from './app/utilities.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async ( req, res ) =>{
    const { data, error } = await initDB();
    if(error && !data){
        res.status(500).send(error + ' Unable to create database');
        return;
    }
    res.status(200).send('database: ' + data);
});

app.get('/totalBookings', async (req, res) =>{
    const totalBookings = await getTotalBookings();
    res.status(200).json({
        totalBookings
    });
});

app.get('/totalUsers', async (req, res) =>{
    const totalUsers = await getTotalUsers();
    res.status(200).json({
        totalUsers
    });
});

app.get('/totalPrices', async (req, res) =>{
    const totalPrices = await getTotalPrices();
    res.status(200).json({
        totalPrices
    });
});

app.get('/:entity', async ( req, res ) =>{
    const { entity } = req.params;
    const { data, error } = await getAll(entity);
    if(error){
        res.status(500).send(error + ': Error Occurred while fetching '+entity);
        return;
    }
    res.status(200).send(data);
});

app.post('/users',async ( req, res ) =>{
    const { userName, userEmail, userPassword } = req.body;
    if(!userName || !userEmail || !userPassword){
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
    res.status(423).send('User already exists by this partial credentials!!');
});

app.get('/:entity/:id',async ( req, res ) =>{
    const { entity,id } = req.params;
    if(!parseInt(id)){
        res.status(423).send('Enter a valid id');
        return;
    }
    const entityID = `${entity.slice(0, -1)}ID`;
    const { data, success, error } = await getSingle(entity, entityID, id);
    if(error){
        res.status(500).send(error + ': Error Occurred while Registering User');
        return;
    }
    if(data && success){
        res.status(200).send(data);
        return;
    }
    res.status(423).send('data doesn\'t exist!!');
});

app.delete('/:entity/:id', async ( req, res ) =>{
    const { entity, id } = req.params;
    if(!parseInt(id)){
        res.status(423).send('Enter a valid id');
        return;
    }
    const entityID = `${entity.slice(0, -1)}ID`;
    const { data, success, error } = await deleteSingle(entity, entityID, id);
    if(error){
        res.status(500).send(error + ': Error Occurred while Deleting '+entity);
        return;
    }
    if(success && data){
        res.status(200).json({
            data
        });
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

app.post('/:entity/login', async ( req, res ) =>{
    const { entity } = req.params;
    const { userName, userPassword } = req.body;
    if(!userName || !userPassword){
        res.status(423).send('Please provide all the details');
        return;
    }
    const { user, validate, error } = await validateLogin(entity, userName, userPassword);
    if(error){
        res.status(500).send(error + ': Error Occurred while Logging In');
        return;
    }
    if(!user){
        res.status(423).send('User doesn\'t exist!!');
        return;
    }
    if(validate){
        res.status(200).json({
            message : "Logged in Successfully",
            user
        });
        return;
    }
    res.status(423).send('Password doesn\'t match!!');
});

app.listen(process.env.SERVER_PORT, () =>{
    console.log('Server is running on ' + process.env.SERVER_PORT);
    console.log(`Listening on http://localhost:${process.env.SERVER_PORT}/`);
});