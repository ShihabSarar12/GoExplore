import mysql from 'mysql2';
import dotenv from 'dotenv';
import { hashMatch } from './utilities.js';

dotenv.config();
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
}).promise();

export const initDB = async () =>{
    try{
        const database = await pool.query(`CREATE DATABASE IF NOT EXISTS tour_app;`);
        const [{ stateChanges }] = await pool.query(`USE tour_app`);
        const { schema } = stateChanges;
        const tourTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS tours (
                tourId BIGINT(20) AUTO_INCREMENT PRIMARY KEY,
                price FLOAT NOT NULL,
                tourName VARCHAR(60) NOT NULL,
                reviews FLOAT,
                description VARCHAR(120),
                duration INT NOT NULL
            );
        `);
        const userTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                userID BIGINT(20) AUTO_INCREMENT PRIMARY KEY,
                userName VARCHAR(60) UNIQUE NOT NULL,
                userEmail VARCHAR(60) UNIQUE NOT NULL,
                userPassword VARCHAR(60) NOT NULL,
                created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
        const destinationTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS destinations (
                destinationID BIGINT(20) AUTO_INCREMENT PRIMARY KEY,
                destinationName VARCHAR(60) UNIQUE NOT NULL,
                description VARCHAR(120),
                imageUrl VARCHAR(120) NOT NULL
            );
        `);
        const hotelTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS hotels (
                hotelID BIGINT(20) AUTO_INCREMENT PRIMARY KEY,
                hotelName VARCHAR(60) UNIQUE NOT NULL,
                description VARCHAR(120),
                imageUrl VARCHAR(120) NOT NULL
            );
        `);
        const adminTable = await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                adminID BIGINT(20) AUTO_INCREMENT PRIMARY KEY,
                adminName VARCHAR(60) UNIQUE NOT NULL,
                adminPassword VARCHAR(60) NOT NULL,
                adminEmail VARCHAR(60) NOT NULL,
                created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
        //TODO: connect tables using relations. 
        return {
            data: schema,
            error: null
        }
    } catch(error){
        return {
            data: null,
            error: error.code
        }
    }
}

export const registerUser = async (userName, userEmail, userPassword) =>{
    try{
        const [ userExist ] = await pool.query(`SELECT * FROM users WHERE userName = ? OR userEmail = ? `, [ userName, userEmail ]);
        if(userExist.length !== 0){
            return {
                user: null,
                error: null
            };
        }
        const [ result ] = await pool.query(`INSERT INTO users (userName, userEmail, userPassword) VALUES ( ?, ?, ? );`, [ userName, userEmail, userPassword ]);
        const { insertId } = result;
        const { user } = await getUser(insertId);
        return {
            user,
            error: null
        };
    } catch(error) {
        return {
            user: null,
            error: error.code
        }
    }
}

export const getUsers = async () =>{
    try{
        const [ result ] = await pool.query(`SELECT * FROM users;`);
        return {
            users: result,
            error: null
        };
    } catch(error) {
        return {
            users: null,
            error: error.code
        }
    }
}

export const getUser = async (userId) =>{
    try{
        const [ result ] = await pool.query(`SELECT * FROM users WHERE userID = ?;`, [ userId ]);
        if(result.length === 0){
            return {
                user: null,
                error: null
            };
        }
        return {
            user: result[0],
            error: null
        };
    } catch(error){
        return {
            user: null,
            error: error.code
        }
    }
}

export const deleteUser = async (userId) =>{
    try{
        const [ { affectedRows } ] = await pool.query(`DELETE FROM users WHERE userID = ?;`, [ userId ]);
        if(affectedRows > 0){
            return {
                success: true,
                error: null
            };
        }
        return {
            success: false,
            error: null
        };
    } catch(error){
        return {
            success: false,
            error: error.code
        }
    }
}

export const updateUserInfo = async (userId, userName, userEmail, userPassword) =>{
    try{
        const [ { affectedRows } ] = await pool.query(`UPDATE users SET userName = ?, userEmail = ?, userPassword = ? WHERE userID = ?`, [ userName, userEmail, userPassword, userId ]);
        if(affectedRows > 0){
            return {
                success: true,
                error: null
            };
        }
        return {
            success: false,
            error: null
        }
    } catch(error){
        return {
            success: false,
            error: error.code
        }
    }
}

export const validateLogin = async (userName, loginPassword) =>{
    try{
        const [ result ] = await pool.query(`SELECT * FROM users WHERE userName = ?;`, [ userName ]);
        if(result.length === 0){
            return {
                user: null,
                validate: false,
                error: null
            };
        }
        const user = result[0];
        const { userPassword } = user;
        const validate = await hashMatch(loginPassword, userPassword);
        return {
            user,
            validate,
            error: null
        };
    } catch(error){
        return {
            user: null,
            validate: false,
            error: error.code
        }
    }
}
