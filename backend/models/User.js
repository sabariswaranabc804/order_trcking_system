//const { sql } = require('../config/database');
const { sql, poolPromise } = require('../db');
class User {
  static async findByEmailOrMobile(identifier) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id', sql.VarChar, identifier)
        .query('SELECT * FROM user_Master WHERE (email_ID = @id OR mobile_Number = @id) AND active_Flag = 1');
      return result.recordset[0];
    } catch (error) {
      console.error('Error finding user by email or mobile:', error);
      throw error;
    }
  }


  // Check if email exists
  static async findByEmail(email) {
    console.log("email",email,typeof(email));
    
    try {
      const pool=await poolPromise;
      const result = await pool.request().query`
        SELECT * FROM user_Master WHERE email_ID = ${email}
      `;
      return result.recordset[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Generate a unique user code
  // static async generateUserCode() {
  //   try {
  //     const pool=await poolPromise;
  //     const result = await pool.request().query`
  //       SELECT TOP 1 user_Code FROM user_Master ORDER BY user_Id DESC
  //     `;
      
  //     if (result.recordset.length === 0) {
  //       return 'USR001';
  //     }
      
  //     const lastCode = result.recordset[0].user_Code;
  //     const numPart = parseInt(lastCode.substring(3));
  //     const newNumPart = numPart + 1;
  //     return `USR${newNumPart.toString().padStart(3, '0')}`;
  //   } catch (error) {
  //     console.error('Error generating user code:', error);
  //     throw error;
  //   }
  // }
  static async generateUserCode() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query`
      SELECT TOP 1 user_Id FROM user_Master ORDER BY user_Id DESC
    `;

    let newId = 1;
    if (result.recordset.length > 0) {
      newId = result.recordset[0].user_Id + 1;
    }

    // Create user code like USR2, USR3, etc.
    return `USR${newId}`;
  } catch (error) {
    console.error('Error generating user code:', error);
    throw error;
  }
}


  // Create a new user
  static async create(userData) {
    try {
      const { user_Name, user_Email, dob,mobileNumber,otp } = userData;
      const user_Code = await this.generateUserCode();
      
      const pool=await poolPromise;
      const result = await pool.request().query`
        INSERT INTO user_Master (
          user_Name, 
          user_Code, 
          email_ID, 
          otp, 
         company_Id, 
          user_Type_ID,
         date_Birth,
         mobile_Number,
         created_Date
         
        ) 
        VALUES (
          ${user_Name}, 
          ${user_Code}, 
          ${user_Email}, 
          ${otp}, 
          ${101}, 
          ${5},
          ${dob},
          ${mobileNumber},
          GETDATE()
        
        )
        
       
        SELECT
  [user_ID] AS userId,
  [user_Type_ID],
  [company_Id],
  [deliveryman_id],
  [user_Code]
FROM [user_Master]
WHERE [user_ID] = SCOPE_IDENTITY();
      `;
      
      const userId = result.recordset[0].userId;
      const userType_Id = result.recordset[0].user_Type_ID;
      const company_Id = result.recordset[0].company_Id;
      const deliveryman_id = result.recordset[0].deliveryman_id;
    //  const user_Code = result.recordset[0].user_Code;

      return { userId, userType_Id, company_Id, deliveryman_id, user_Code };
  //    return result.recordset[0].user_Id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user OTP
  static async updateOtp(email, otp) {
    try {
      const pool=await poolPromise;
      await pool.request().query`
        UPDATE user_Master 
        SET otp = ${otp}
        WHERE email_ID = ${email}
      `;
      return true;
    } catch (error) {
      console.error('Error updating OTP:', error);
      throw error;
    }
  }

  // Verify OTP
  static async verifyOtp(email, otp) {
    try {
     const pool=await poolPromise;
      const result = await pool.request().query`
        SELECT * FROM user_Master 
        WHERE email_ID = ${email} AND otp = ${otp}
      `;

  console.log('verifyOtp',result);    
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }


 
}

module.exports = User;