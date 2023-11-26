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
    const [ userExist ] = await pool.query(`SELECT * FROM users WHERE userName = ?`, [userName]);
    if(userExist.length !== 0){
        console.log('User already exists!!');
        return null;
    }
    const [ result ] = await pool.query(`INSERT INTO users (userName, userEmail, userPassword) VALUES ( ?, ?, ? );`, [ userName, userEmail, userPassword ]);
    const id = result.insertId;
    return getUser(id);
}

export const getUsers = async () =>{
    const [ result, fields ] = await pool.query(`SELECT * FROM users;`);
    return result;
}

export const getUser = async (userId) =>{
    const [ result, fields ] = await pool.query(`SELECT * FROM users WHERE userID = ?;`, [userId]);
    if(result.length === 0){
        return null;
    }
    return result[0];
}

export const deleteUser = async (userId) =>{
    const [ { affectedRows }, fields ] = await pool.query(`DELETE FROM users WHERE userID = ?;`, [userId]);
    if(affectedRows > 0){
        return {
            success: true
        };
    }
    return {
        success: false
    };
}

export const updateUserInfo = async (userId, userName, userEmail, userPassword) =>{
    const [ { affectedRows }, fields ] = await pool.query(`UPDATE users SET userName = ?, userEmail = ?, userPassword = ? WHERE userID = ?`, [ userName, userEmail, userPassword, userId ]);
    if(affectedRows > 0){
        return {
            success: true,
            user: {
                userId,
                userName,
                userEmail,
                userPassword
            }
        };
    }
    return {
        success: false,
        user: undefined
    }
}

