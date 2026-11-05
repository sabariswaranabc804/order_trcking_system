const { sql, poolPromise } = require('../db');

async function emailExists(email) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT COUNT(*) AS count FROM user_Master WHERE email_ID = @email and active_Flag=1 ');
        return result.recordset[0].count > 0;
    } catch (err) {
        console.error('Database query failed:', err);
        throw err;
    }
}

async function saveOtp(email, otp, expiresAt) {
    try {
        const pool = await poolPromise;
        
        // Combined query to get both user_Type and userID
        const userTypeResult = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT user_Type_ID, user_Code, company_Id ,deliveryman_id FROM user_Master WHERE email_ID = @email');

        if (userTypeResult.recordset.length === 0) {
            throw new Error('User not found');
        }

        const userType = userTypeResult.recordset[0].user_Type_ID;
        const userID = userTypeResult.recordset[0].user_Code;
        const company_Id = userTypeResult.recordset[0].company_Id;
        const deliveryman_id = userTypeResult.recordset[0].deliveryman_id; // Ensure correct retrieval
       // const company_Id = company_Id ? sql.Numeric : sql.Null;
        console.log('company_Id:', company_Id); // Debugging
        console.log("delivery man id",deliveryman_id);
        
        // Save email, otp, expires_at, user_type, and userID into otp_table
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('otp', sql.VarChar, otp)
            .input('expiresAt', sql.DateTime, expiresAt)
            .input('userType', sql.Numeric, userType)
            .input('userID', sql.VarChar, userID)
            .input('company_Id', sql.Numeric, company_Id) // Ensure correct data type
            .input('deliveryman_id', sql.Int, deliveryman_id)
            .query('INSERT INTO otp_table (email, otp, expires_at, user_Type_ID, user_Code, company_Id,deliveryman_id) VALUES (@email, @otp, @expiresAt, @userType, @userID, @company_Id,@deliveryman_id)');

    } catch (err) {
        console.error('Error saving OTP:', err);
        throw err;
    }
}





async function verifyOtp(email, otp) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('otp', sql.VarChar, otp)
            .query('SELECT TOP 1 otp, expires_at, user_Type_ID, user_Code, company_Id, deliveryman_id FROM otp_table WHERE email = @email AND otp = @otp ORDER BY id DESC');

        if (result.recordset.length === 0) {
            return { isValid: false };
        }

        // Always fetch the live, current role and user details from user_Master
        const userResult = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT user_Type_ID, user_Code, company_Id, deliveryman_id FROM user_Master WHERE email_ID = @email OR mobile_Number = @email');

        if (userResult.recordset.length > 0) {
            const { user_Type_ID, user_Code, company_Id, deliveryman_id } = userResult.recordset[0];
            return { isValid: true, user_Type_ID, user_Code, company_Id, deliveryman_id };
        }

        const { user_Type_ID, user_Code, company_Id, deliveryman_id } = result.recordset[0];
        return { isValid: true, user_Type_ID, user_Code, company_Id, deliveryman_id };
    } catch (err) {
        console.error('Error verifying OTP:', err);
        throw err;
    }
}


module.exports = {
    emailExists,
    saveOtp,
    verifyOtp
};
