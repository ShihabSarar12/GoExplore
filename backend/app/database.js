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
        const [{ stateChanges }] = await pool.query(`USE tour_app`);
        const { schema } = stateChanges;
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

export const getAll = async (entity) =>{   
    try{
        const [ data ] = await pool.query(`SELECT * FROM ??;`,[ entity ]);
        return {
            data,
            error: null
        }
    } catch(error){
        return {
            data: null,
            error: error.code
        }
    }
}

export const getSingle = async (entity, attribute, value) =>{
    try{
        const [ data ] = await pool.query(`SELECT * FROM ?? WHERE ?? = ?;`, [ entity, attribute, value ]);
        if(data.length === 0){
            return {
                data: null,
                success: false,
                error: null
            }
        }
        return {
            data: data[0],
            success: true,
            error: null
        }
    } catch(error){
        return {
            data: null,
            success: false,
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
        const { user } = await getSingle(insertId);
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


export const deleteSingle = async (entity, attribute, value) =>{
    try{
        const { data, error } = await getSingle(entity, attribute, value);
        if(error){
            return {
                data: null,
                success: false,
                error
            }
        }
        const [ { affectedRows } ] = await pool.query(`DELETE FROM ?? WHERE ?? = ?;`, [ entity, attribute, value ]);
        if(affectedRows > 0){
            return {
                data,
                success: true,
                error: null
            };
        }
        return {
            data: null,
            success: false,
            error: null
        };
    } catch(error){
        console.log(error);
        return {
            data: null,
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

export const updateTour = async (tourId, price, tourName, reviews, description, duration, imageUrl) =>{
    try{
        const [ { affectedRows } ] = await pool.query(`UPDATE tours SET price = ?, tourName = ?, reviews = ?, description = ?,duration = ?, imageUrl = ? WHERE tourId = ?`, [ price, tourName, reviews, description, duration, imageUrl, tourId ]);
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
export const validateLoginAdmin = async (adminName, loginPassword) =>{
    try{
        const [ result ] = await pool.query(`SELECT * FROM admins WHERE adminName = ? AND adminPassword = ?;`, [ adminName, loginPassword ]);
        if(result.length === 0){
            return {
                user: null,
                validate: false,
                error: null
            };
        }
        const user = result[0];
        if(user){
            return {
                user,
                validate: true,
                error: null
            };
        }
        return {
            user: null,
            validate: false,
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



export const getTotalBookings = async () => {
    try {
        const [[ result ]] = await pool.query(`SELECT COUNT(bookingID) as totalBookings FROM bookings;`);
        return result.totalBookings;
    } catch (error) {
        console.error('Error fetching total bookings count:', error);
        return null;
    } 
}

export const getTotalUsers = async () => {
    try {
        const [[result]] = await pool.query(`SELECT COUNT(userID) as totalUsers FROM users;`);
        return result.totalUsers;
    } catch (error) {
        console.error('Error fetching  totalUsers count:', error);
        return null;
    } 
}

export const getTotalPrices = async () => {
    try {
        const [result] = await pool.query(`SELECT sum(price) as totalPrices from tours where tourId in (select tourId from bookings);`);
        return result[0].totalPrices;
    } catch (error) {
        console.error('Error fetching  totalPrices count:', error);
        return null;
    }
}

export const addDestination = async (destName, destDescription, destImageUrl, destTourId) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO destinations (destinationName, description, imageUrl, tourId) VALUES (?, ?, ?, ?)',
            [destName, destDescription, destImageUrl, destTourId]
        );
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const addTour = async (tourName, tourDescription, tourImageUrl, price, reviews, duration) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO tours (tourName, description, imageUrl, price, reviews, duration) VALUES (?, ?, ?, ?, ?, ?)',
            [tourName, tourDescription, tourImageUrl, price, reviews, duration]
        );

        return result;
    } catch (error) {
        console.log(error);
    }
};

export const addBookings = async (tourId, userId) =>{
    try {
        const [result] = await pool.query(
            'INSERT INTO bookings (tourId, userId) VALUES (?, ?)',
            [tourId, userId]
        );
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
    }
}

export const fetchBookings = async (userID) =>{
    try {
        const [result] = await pool.query(
            'SELECT t.* FROM tours t JOIN bookings b ON t.tourId = b.tourId WHERE b.userID = ?;',
            [userID]
        );
        return result;
    } catch (error) {
        console.log(error);
    }
}