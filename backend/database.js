import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
}).promise();

export const registerUser = async (userName, userEmail, userPassword) =>{
    //TODO: have to fix dublicate userName entry by handling userID.
    const [ result ] = await pool.query(`INSERT INTO users (userName, userEmail, userPassword) VALUES ( ?, ?, ? )`, [ userName, userEmail, userPassword ]);
   const id = result.insertId;
   return getUser(id);
}

export const getUsers = async () =>{
    const [ result, fields ] = await pool.query(`SELECT * FROM users`);
    return result;
}

export const getUser = async (userId) =>{
    const [ result, fields ] = await pool.query(`SELECT * FROM users WHERE userID = ?`, [userId]);
    return result[0];
}

