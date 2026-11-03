const CartModel = require('../models/user/cartModel');

async function initializeCartTable() {
  try {
    console.log('Initializing cart table...');
    await CartModel.createCartTable();
    console.log('Cart table initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing cart table:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeCartTable();
}

module.exports = { initializeCartTable };