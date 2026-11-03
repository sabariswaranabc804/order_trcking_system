// controllers/adminController.js
const adminModel = require('../../models/superadmin/adminModel');
//const db = require('../../config/database');

// Create Admin
const createAdmin = async (req, res) => {
  const { username,   companyName, mobileId, email,name,mobile,role } = req.body;
    
  console.log('Received data:', req.body); // Log the received data

  try {
    // Insert company details and get company_Id
    const company_Id = await adminModel.addCompany(companyName, email, mobileId,mobile);
     
    // Insert user details with the company_Id
    await adminModel.addUser(username,  company_Id,mobileId,email,name,role,mobile);

    // Success response
    res.status(200).json({ message: 'Admin created successfully',company_Id });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'An error occurred while creating the admin' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await adminModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
const updateCompanySettings = async (req, res) => {
  try {
    const companyId = 1;
    const companyData = req.body;
    
    // Handle file uploads from multer middleware
    if (req.files) {
      // Handle logo upload
      if (req.files.logo && req.files.logo.length > 0) {
        companyData.logo = req.files.logo[0].filename;
      }
      
      // Handle frontPageImage upload
      if (req.files.frontPageImage && req.files.frontPageImage.length > 0) {
        companyData.frontPageImage = req.files.frontPageImage[0].filename;
      }
    }

    await adminModel.updateCompanySettings(companyId, companyData);
    res.status(200).json({ message: 'Company settings updated successfully' });
  } catch (error) {
    console.error('Error updating company settings:', error);
    res.status(500).json({ error: 'Failed to update company settings' });
  }
};

const getCompanySettings = async (req, res) => {
  try {
    const { companyId } = req.params;
    const settings = await adminModel.getCompanySettings(companyId);
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching company settings:', error);
    res.status(500).json({ error: 'Failed to fetch company settings' });
  }
};



// Update the menu access functions to use the model
const createMenuAccess = async (req, res) => {
    try {
        await adminModel.createMenuAccess(req.body);
        res.status(201).json({
            success: true,
            message: 'Menu access created successfully'
        });
    } catch (error) {
        console.error('Error creating menu access:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create menu access'
        });
    }
};

const getMenuAccess = async (req, res) => {
    try {
        const rows = await adminModel.getMenuAccess();
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching menu access:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch menu access'
        });
    }
};

const updateMenuAccess = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, value } = req.body;
        await adminModel.updateMenuAccess(id, role, value);
        res.status(200).json({
            success: true,
            message: 'Menu access updated successfully'
        });
    } catch (error) {
        console.error('Error updating menu access:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update menu access'
        });
    }
};

const deleteMenuAccess = async (req, res) => {
    try {
        const { id } = req.params;
        await adminModel.deleteMenuAccess(id);
        res.status(200).json({
            success: true,
            message: 'Menu access deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting menu access:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete menu access'
        });
    }
};

// ... existing code ...

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
     console.log(userId,isActive);
     
    await adminModel.updateUserStatus(userId, isActive);
    
    res.status(200).json({ 
      success: true, 
      message: 'User status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update user status' 
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { user_Name, email_ID, mobile_Number, alter_Mobile_number } = req.body;
    
    await adminModel.updateUser(userId, {
      user_Name,
      email_ID,
      mobile_Number,
      alter_Mobile_number
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'User updated successfully' 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update user' 
    });
  }
};


const getUsersByType=async(req,res)=>{

  try {
    const { usertype } = req.params;
    const users = await adminModel.getUsersByType(usertype);
    res.status(200).json(users);  

  }catch (error) {
    console.error('Error fetching users by type:', error);
    res.status(500).json({ error: 'Failed to fetch users by type' });
  }
}
//send notification
const sendNotification = async (req,res)=>{
  try{
    const {title,message,receiver} = req.body;
    if (!title || !message || !receiver) {
      return res.status(400).json({ success: false, message: 'Title, message, and receiver are required' });
    }

    const { admin: adminReceivers =[], anchor: anchorReceivers =[], customer: customerReceivers =[] } = receiver;

    await adminModel.sendNotification(title,message,adminReceivers,anchorReceivers,customerReceivers);

    res.status(200).json({success: true, message: 'Notification send successfully'});
  }catch(error){
    console.error('Error sending notification',error);
    res.status(500).json({success: false, message: 'Failed to send notification'});
  }
};

//get notification
const getNotification = async(req,res)=>{
  try{
    const {typeId,user}=req.query;
    if(!user || !typeId){
      return res.status(400).json({success: false,message: 'User name required'})
    }
    const type={
      '2':'admin',
      '4':'anchor',
      '5':'customer'
    }
    const notifications = await adminModel.getNotification(type[typeId],user);
     // console.log(notifications)
    res.status(200).json({success: true,data:notifications})
  }catch(error){
    console.error('Error fetching notifications',error);
    res.status(500).json({success: false,message: 'Failed to fetch notifications'});
  }
};

//delete notification
const deleteNotification = async(req,res) =>{
  try{
    const {id}=req.params;
    if(!id){
      return res.status(400).json({success: false, message: 'Id is required to delete notification'})
    }
    await adminModel.deleteNotification(id);
    res.status(200).json({success:true,message:'Notification deleted successfully'})
  }catch(error){
    console.error('Error deleting notification',error);
    res.status(500).json({success:false,message:'Failed to delete notification'})
  }
};



// Get revenue data for reports
const getRevenueData = async (req, res) => {
  try {
    const revenueData = await adminModel.getRevenueData();
    res.status(200).json({ success: true, data: revenueData });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch revenue data' });
  }
};

// Get monthly revenue data for reports
const getMonthlyRevenueData = async (req, res) => {
  try {
    const monthlyRevenueData = await adminModel.getMonthlyRevenueData();
    res.status(200).json({ success: true, data: monthlyRevenueData });
  } catch (error) {
    console.error('Error fetching monthly revenue data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch monthly revenue data' });
  }
};

// Get service usage data for reports
const getServiceUsageData = async (req, res) => {
  try {
    const serviceUsageData = await adminModel.getServiceUsageData();
    res.status(200).json({ success: true, data: serviceUsageData });
  } catch (error) {
    console.error('Error fetching service usage data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service usage data' });
  }
};

// Update the exports
module.exports = {
  getRevenueData,
  getMonthlyRevenueData,
  getServiceUsageData,
  deleteNotification,
  getNotification,
  sendNotification,
  getUsersByType,
  createAdmin,
  getAllUsers,
  updateCompanySettings,
  getCompanySettings,
  createMenuAccess,
  getMenuAccess,
  updateMenuAccess,
  deleteMenuAccess,
  updateUser,
  updateUserStatus
};