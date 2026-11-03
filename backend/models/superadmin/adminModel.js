// models/adminModel.js
const { sql, poolPromise } = require('../../db');

const generateUniqueUserCode = async (prefix = 'USER') => {
  const pool = await poolPromise;

  const result = await pool.request()
  .query('SELECT TOP 1 user_Id FROM [user_Master] ORDER BY user_Id DESC');

let newId = 1;
if (result.recordset.length > 0) {
  newId = result.recordset[0].user_Id + 1;
}
const userCode = `${prefix}${newId}`;


  
  return userCode;
};

const getAllUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request()
   .query(`select 
       user_ID,
	   user_Code,
       user_Name,
	   user_Type_ID,
	   mobile_Number,
	   alter_Mobile_number,
	   email_ID,
	   active_Flag,
	   deliveryman_id,
	   company_Id,
	   created_Date

FROM user_Master order by user_ID desc`);
  return result.recordset;
};


const updateUserStatus = async (userId, isActive) => {
  const pool = await poolPromise;
  const query = `
    UPDATE user_Master 
    SET active_Flag = @isActive 
    WHERE user_ID = @userId
  `;
  
  await pool.request()
    .input('userId', sql.Int, userId)
    .input('isActive', sql.Bit, isActive)
    .query(query);
};

const updateUser = async (userId, userData) => {
  try {
    const pool = await poolPromise;
    
    // Check if email exists for other users
    const emailCheck = await pool.request()
      .input('email', sql.NVarChar, userData.email_ID)
      .input('userId', sql.Int, userId)
      .query(`
        SELECT COUNT(*) as count 
        FROM user_Master 
        WHERE email_ID = @email 
        AND user_ID != @userId
      `);

    if (emailCheck.recordset[0].count > 0) {
      throw new Error('Email already exists');
    }

    const query = `
      UPDATE user_Master
      SET 
        user_Name = @user_Name,
        email_ID = @email_ID,
        mobile_Number = @mobile_Number,
        alter_Mobile_number = @alter_Mobile_number,
        modified_Date = GETDATE()
      WHERE user_ID = @userId
    `;

    await pool.request()
      .input('userId', sql.Int, userId)
      .input('user_Name', sql.NVarChar, userData.user_Name)
      .input('email_ID', sql.NVarChar, userData.email_ID)
      .input('mobile_Number', sql.NVarChar, userData.mobile_Number)
      .input('alter_Mobile_number', sql.NVarChar, userData.alter_Mobile_number)
      .query(query);

    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// 
// Insert into company_Master and return company_Id
const addCompany = async (companyName, email, mobileId,mobile) => {
   
    const pool = await poolPromise;
  const result = await pool.request()
    .input('companyName', sql.VarChar, companyName || "ots2.0")
    .input('email', sql.VarChar, email)
    .input('mobileId', sql.VarChar, mobileId || mobile)
    .query(`
      INSERT INTO company_Master (company_Name, email, mobile_No)
      OUTPUT inserted.company_Id
      VALUES (@companyName, @email, @mobileId)
    `);

  return result.recordset[0].company_Id;
};

// Insert into user_Master
const addUser = async (username,  company_Id, mobileId, email, name, role, mobile) => {
  const pool = await poolPromise;
  
  // Generate unique user code if not provided
  const finalUserCode =  await generateUniqueUserCode(role === 1 ? 'SUADM' : 
                                                                role === 2 ? 'Admin' : 
                                                                role === 3 ? 'Owner' : 'CUS');
  
  await pool.request()
    .input('username', sql.VarChar, username || name)
    .input('usercode', sql.VarChar, finalUserCode)
    .input('usertypeId', sql.Numeric, role)
    .input('company_Id', sql.Numeric, company_Id)
    .input('email', sql.VarChar, email)
    .input('mobileId', sql.VarChar, mobileId || mobile)
    .query(`
      INSERT INTO user_Master (user_Name, user_Code, user_Type_ID, company_Id, email_ID, mobile_Number)
      VALUES (@username, @usercode, @usertypeId, @company_Id, @email, @mobileId)
    `);
    
  return finalUserCode;
};

const updateCompanySettings = async (companyId, companyData) => {
  const pool = await poolPromise;
  console.log(companyData);
  await pool.request()
    .input('companyId', sql.Int, companyId)
    .input('companyName', sql.VarChar, companyData.name)
    .input('email', sql.VarChar, companyData.email)
    .query(`
      UPDATE company_Master 
      SET company_Name = @companyName,
          email = @email
      WHERE company_Id = @companyId
    `);
    
  // Insert or update in company_settings table which has the additional fields
  await pool.request()
    .input('companyId', sql.Int, companyId)
    .input('companyName', sql.VarChar, companyData.name)
    .input('logoUrl', sql.VarChar, companyData.logo || null)
    .input('frontPageImageUrl', sql.VarChar, companyData.frontPageImage || null)
    .input('description', sql.VarChar, companyData.description || null)
    .input('address', sql.VarChar, companyData.address || null)
    .input('email', sql.VarChar, companyData.email)
    .input('phone', sql.VarChar, companyData.phone || null)
    .input('website', sql.VarChar, companyData.website || null)
    .input('currentDate', sql.DateTime, new Date())
    .query(`
      IF EXISTS (SELECT 1 FROM company_settings WHERE id = @companyId)
      BEGIN
        UPDATE company_settings 
        SET company_name = @companyName,
            logo_url = @logoUrl,
            front_page_image_url = @frontPageImageUrl,
            description = @description,
            address = @address,
            email = @email,
            phone = @phone,
            website = @website,
            updated_at = @currentDate
      END
      ELSE
      BEGIN
        INSERT INTO company_settings (id, company_name, logo_url, front_page_image_url, description, address, email, phone, website, created_at, updated_at)
        VALUES (@companyId, @companyName, @logoUrl, @frontPageImageUrl, @description, @address, @email, @phone, @website, @currentDate, @currentDate)
      END
    `);
};


const getCompanySettings = async (companyId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('companyId', sql.Int, companyId)
    .query(`
    SELECT 
        id,
        company_name as name,
        logo_url as logo,
        front_page_image_url as frontPageImage,
        description,
        address,
        email,
        phone,
        website,
        created_at,
        updated_at
      FROM company_settings
      WHERE id = @companyId
    `);

  return result.recordset[0];
};

const createMenuAccess = async (menuItems) => {
  const pool = await poolPromise;
  const table = new sql.Table('menu_access');
  
  table.columns.add('title', sql.VarChar(100));
  table.columns.add('menu', sql.VarChar(50));
  table.columns.add('submenu', sql.VarChar(50));
  table.columns.add('list', sql.VarChar(100));
  table.columns.add('admin', sql.Bit);
  table.columns.add('owner', sql.Bit);
  table.columns.add('anchor', sql.Bit);
  table.columns.add('customer', sql.Bit);

  menuItems.forEach(item => {
    table.rows.add(
      item.title,
      item.menu,
      item.submenu,
      item.list,
      item.admin,
      item.owner,
      item.anchor,
      item.customer
    );
  });

  await pool.request().bulk(table);
};

const getMenuAccess = async () => {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT * FROM menu_access');
  return result.recordset;
};

const updateMenuAccess = async (id, role, value) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .input('value', sql.Bit, value)
    .query(`UPDATE menu_access SET ${role} = @value WHERE id = @id`);
};

const deleteMenuAccess = async (id) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM menu_access WHERE id = @id');
};
const getUsersByType=async(usertype)=>{
  const pool = await poolPromise;
  const result = await pool.request()
   .input('usertype', sql.Numeric, usertype)
   .query(`
    SELECT
        user_ID,
        user_Name,
        user_Code,
        email_ID,
        mobile_Number,
        active_Flag
      FROM user_Master
      WHERE user_Type_ID = @usertype
  `);
  return result.recordset;
}
//send notification

const sendNotification= async(title,message,adminReceivers,anchorReceivers,customerReceivers)=>{
  try{
    const pool= await poolPromise;
    const receivers=[
      {type:'admin', list:adminReceivers},
      {type:'anchor', list:anchorReceivers},
      {type:'customer',list: customerReceivers}
    ]
    console.log(receivers);
    for(const receiverType of receivers){
      for(const name of receiverType.list){
        if(name && name!==''){
          await pool.request()
          .input('title',sql.NVarChar,title)
          .input('notification_msg',sql.NVarChar,message)
          .input('receiver_type',sql.NVarChar,receiverType.type)
          .input('receiver',sql.NVarChar,name)
          .query(`
            insert into notificationTable (title,notification_msg,receiver_type,receiver,created_at,active_Flag)
            values(@title,@notification_msg,@receiver_type,@receiver,GETDATE(),1)`)
        }
      }
    }
    console.log('Notification sent successfully');
  }catch(error){
    console.error('Error sending notification:',error);
    throw error;
  }
}

//get notification
//get notification
const getNotification = async(type,user)=>{
  try{
    const pool =  await poolPromise;
    const result= await pool.request()
    .input('type',sql.NVarChar,type)
    .input('user',sql.NVarChar,user)
    .query(`
      select * from notificationTable
      where receiver_type=@type and receiver = @user and active_flag=1
      order by created_at desc; `)

    console.log('Notification fetched successfully');
    return result.recordset;
  }catch(error){
    console.error('Error fetching notification',error);
    throw error;
  }
}

//delete notification
const deleteNotification = async(id)=>{
  try{
    const pool= await poolPromise;
    await pool.request()
    .input('id',sql.Int,id)
    .query(`
      update notificationTable
      set active_flag=0
      where id=@id`)
    console.log('Notification deleted successfully');
  }catch(error){
    console.error('Error deleting notification',error);
    throw error;

  }
}

// Get revenue data based on order_date and total_price from Orders table
const getRevenueData = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          CONVERT(DATE, order_date) as date,
          SUM(CAST(total_price AS DECIMAL(10,2))) as revenue,
          COUNT(*) as orderCount
        FROM Orders 
        WHERE order_date >= DATEADD(day, -30, GETDATE())
        GROUP BY CONVERT(DATE, order_date)
        ORDER BY date DESC
      `);
    return result.recordset;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
};

// Get monthly revenue data based on order_date and total_price from Orders table
const getMonthlyRevenueData = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          YEAR(order_date) as year,
          MONTH(order_date) as month,
          DATENAME(MONTH, order_date) + ' ' + CAST(YEAR(order_date) AS VARCHAR) as monthYear,
          SUM(CAST(total_price AS DECIMAL(10,2))) as revenue,
          COUNT(*) as orderCount
        FROM Orders 
        WHERE order_date >= DATEADD(month, -12, GETDATE())
        GROUP BY YEAR(order_date), MONTH(order_date), DATENAME(MONTH, order_date)
        ORDER BY year DESC, month DESC
      `);
    return result.recordset;
  } catch (error) {
    console.error('Error fetching monthly revenue data:', error);
    throw error;
  }
};

// Get service usage data from service_Master and OrderItems tables
const getServiceUsageData = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          sm.serv_Name as serviceName,
          sm.isActive,
          COUNT(oi.category_name) as usageCount
        FROM service_Master sm
        LEFT JOIN OrderItems oi ON sm.serv_Name = oi.category_name
        WHERE sm.isActive = 1
        GROUP BY sm.serv_Name, sm.isActive
        ORDER BY usageCount DESC
      `);
    return result.recordset;
  } catch (error) {
    console.error('Error fetching service usage data:', error);
    throw error;
  }
};

module.exports = { 
  getRevenueData,
  getMonthlyRevenueData,
  getServiceUsageData,
  deleteNotification,
  getNotification,
  sendNotification,
  generateUniqueUserCode,
  getUsersByType,
  addCompany, 
  getAllUsers,
  addUser, 
  updateCompanySettings, 
  getCompanySettings,
  createMenuAccess,
  getMenuAccess,
  updateMenuAccess,
  deleteMenuAccess,updateUser, updateUserStatus,
};
