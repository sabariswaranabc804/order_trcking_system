const CartModel = require('../models/user/cartModel');

async function testCartOperations() {
  try {
    console.log('Testing cart operations...');
    
    // Test user code (you can change this to a real user code from your database)
    const testUserCode = 'USR001';
    
    // Test adding an item
    console.log('1. Testing add to cart...');
    const testItem = {
      servSubType_Id: 1,
      service_name: 'Test Service',
      service_price: 100.00
    };
    
    const addResult = await CartModel.addToCart(testUserCode, testItem);
    console.log('Add result:', addResult);
    
    // Test getting cart items
    console.log('2. Testing get cart items...');
    const cartItems = await CartModel.getCartItems(testUserCode);
    console.log('Cart items:', cartItems);
    
    // Test getting cart count
    console.log('3. Testing get cart count...');
    const cartCount = await CartModel.getCartCount(testUserCode);
    console.log('Cart count:', cartCount);
    
    // Test updating quantity
    if (cartItems.length > 0) {
      console.log('4. Testing update quantity...');
      const updateResult = await CartModel.updateQuantity(testUserCode, testItem.servSubType_Id, 3);
      console.log('Update result:', updateResult);
    }
    
    // Test clearing cart
    console.log('5. Testing clear cart...');
    const clearResult = await CartModel.clearCart(testUserCode);
    console.log('Clear result:', clearResult);
    
    console.log('All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  testCartOperations();
}

module.exports = { testCartOperations };