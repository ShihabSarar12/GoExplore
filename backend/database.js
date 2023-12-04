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
    //TODO: have to create database and tables when app runs!!
}

export const registerUser = async (userName, userEmail, userPassword) =>{
    try{
        const [ userExist ] = await pool.query(`SELECT * FROM users WHERE userName = ?`, [ userName ]);
        console.log(userExist);
        if(userExist.length !== 0){
            return {
                user: null,
                error: null
            };
        }
        const [ result ] = await pool.query(`INSERT INTO users (userName, userEmail, userPassword) VALUES ( ?, ?, ? );`, [ userName, userEmail, userPassword ]);
        console.log(result);
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
