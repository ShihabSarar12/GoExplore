import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
}).promise();

export const registerUser = async (userName, userEmail, userPassword) =>{
    const [ userExist ] = await pool.query(`SELECT * FROM users WHERE userName = ?`, [ userName ]);
    if(userExist.length !== 0){
        console.log('User already exists!!');
        return null;
    }
    const [ result ] = await pool.query(`INSERT INTO users (userName, userEmail, userPassword) VALUES ( ?, ?, ? );`, [ userName, userEmail, userPassword ]);
    const { insertId } = result;
    return getUser(insertId);
}

export const getUsers = async () =>{
    const [ result ] = await pool.query(`SELECT * FROM users;`);
    return result;
}

export const getUser = async (userId) =>{
    const [ result ] = await pool.query(`SELECT * FROM users WHERE userID = ?;`, [ userId ]);
    if(result.length === 0){
        return null;
    }
    return result[0];
}

export const deleteUser = async (userId) =>{
    const [ { affectedRows } ] = await pool.query(`DELETE FROM users WHERE userID = ?;`, [ userId ]);
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
    const [ { affectedRows } ] = await pool.query(`UPDATE users SET userName = ?, userEmail = ?, userPassword = ? WHERE userID = ?`, [ userName, userEmail, userPassword, userId ]);
    if(affectedRows > 0){
        return {
            success: true
        };
    }
    return {
        success: false
    }
}

export const hashPassword = async (password) =>{
    const hash = await bcrypt.hash(password, parseInt(process.env.HASH_ITERATION));
    return hash;
}

const hashMatch = async (password, hash) =>{
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

export const validateLogin = async (userName, loginPassword) =>{
    const [ result ] = await pool.query(`SELECT * FROM users WHERE userName = ?;`, [ userName ]);
    if(result.length === 0){
        return {
            user: null,
            validate: false
        };
    }
    const user = result[0];
    const { userPassword } = user;
    const validate = await hashMatch(loginPassword, userPassword);
    return {
        user,
        validate
    };
}
