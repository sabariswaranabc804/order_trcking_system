//const sql = require('mssql');  // Assuming you're using MSSQL
const { poolPromise,sql } = require('../../db');
// Function to get users with user_Type_ID = 5
// Function to get users where user_Type_ID = 5
const getUsersByType = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_Type_ID', sql.Int, 5)  // Set user_Type_ID = 5
            .query(`
                SELECT * 
                FROM user_Master 
                WHERE user_Type_ID = @user_Type_ID and active_Flag=1
            `);
        
        return result.recordset;  // Return the retrieved records
    } catch (error) {
        throw new Error(`Database query error: ${error.message}`);
    }
};

// Function to get user addresses by user ID
const getUserAddresses = async (userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_ID', sql.NVarChar(), userId)
            .query(`
                SELECT 
                    UAID,
                    user_ID,
                    longitude,
                    lattitude,
                    address,
                    state_Id,
                    city_Id,
                    location_Id,
                    Area,
                    Street,
                    Floor_Door_no,
                    Landmark,
                    pin_Code,
                    active_Flag,
                    created_By,
                    created_Date,
                    modified_By,
                    modified_Date,
                    AddressId,
                    AddressType,
                    mobile_number
                FROM user_Address 
                WHERE user_ID = @user_ID AND active_Flag = 1
                ORDER BY created_Date DESC
            `);
        
        return result.recordset;
    } catch (error) {
        throw new Error(`Database query error: ${error.message}`);
    }
};

// Function to add a new user address
const addUserAddress = async (addressData) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_ID', sql.NVarChar(), addressData.user_ID)
            .input('address', sql.NVarChar, addressData.address)
            .input('Area', sql.NVarChar, addressData.Area)
            .input('Street', sql.NVarChar, addressData.Street || null)
            .input('Floor_Door_no', sql.NVarChar, addressData.Floor_Door_no || null)
            .input('Landmark', sql.NVarChar, addressData.Landmark || null)
            .input('pin_Code', sql.NVarChar, addressData.pin_Code)
            .input('AddressType', sql.NVarChar, addressData.AddressType || 'Home')
            .input('mobile_number', sql.NVarChar, addressData.mobile_number || null)
            .input('state_Id', sql.Int, addressData.state_Id || 1)
            .input('city_Id', sql.Int, addressData.city_Id || 1)
            .input('location_Id', sql.Int, addressData.location_Id || 1)
            .input('active_Flag', sql.Bit, 1)
            .input('created_Date', sql.DateTime, new Date())
            .query(`
                INSERT INTO user_Address (
                    user_ID, address, Area, Street, Floor_Door_no, Landmark, 
                    pin_Code, AddressType, mobile_number, state_Id, city_Id, 
                    location_Id, active_Flag, created_Date
                )
                OUTPUT INSERTED.*
                VALUES (
                    @user_ID, @address, @Area, @Street, @Floor_Door_no, @Landmark,
                    @pin_Code, @AddressType, @mobile_number, @state_Id, @city_Id,
                    @location_Id, @active_Flag, @created_Date
                )
            `);
        
        return result.recordset[0];
    } catch (error) {
        throw new Error(`Database insert error: ${error.message}`);
    }
};

module.exports = {
    getUsersByType,
    getUserAddresses,
    addUserAddress,
};