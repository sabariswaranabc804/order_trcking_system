const UserModel = require('../../models/admin/customer');

// Controller function to get users with user_Type_ID = 5
const getUsersByType = async (req, res) => {
  try {
    const users = await UserModel.getUsersByType();
    if (users.length > 0) {
      res.status(200).json({ success: true, data: users });
    } else {
      res.status(404).json({ success: false, message: 'No users found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller function to get user addresses by user ID
const getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await UserModel.getUserAddresses(userId);
    if (addresses.length > 0) {
      res.status(200).json({ success: true, data: addresses });
    } else {
      res.status(404).json({ success: false, message: 'No addresses found for this user.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller function to add a new user address
const addUserAddress = async (req, res) => {
  try {
    const addressData = req.body;
    const newAddress = await UserModel.addUserAddress(addressData);
    res.status(201).json({ success: true, data: newAddress, message: 'Address added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsersByType,
  getUserAddresses,
  addUserAddress,
};
