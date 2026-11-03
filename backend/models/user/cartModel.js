const sql = require('mssql');
const { poolPromise } = require('../../db');

class CartModel {
  // Create cart table
  static async createCartTable() {
    try {
      const pool = await poolPromise;
      const query = `
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_cart' AND xtype='U')
        CREATE TABLE user_cart (
          cart_id INT IDENTITY(1,1) PRIMARY KEY,
          user_Code NVARCHAR(50) NOT NULL,
          servSubType_Id INT NOT NULL,
          service_name NVARCHAR(255),
          service_price DECIMAL(10,2),
          quantity INT DEFAULT 1,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (user_Code) REFERENCES user_Master(user_Code) ON DELETE CASCADE
        );
      `;
      await pool.request().query(query);
      console.log('Cart table created successfully');
    } catch (error) {
      console.error('Error creating cart table:', error);
      throw error;
    }
  }

  // Get cart items for a user
  static async getCartItems(userId) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('userCode', sql.NVarChar, userId)
        .query(`
           SELECT 
            cart_id,
            servSubType_Id,
        
            service_price,
            quantity,
            created_at,
            updated_at,
			imagefile,
			servSubType_Name,
			    service_name as serv_Name,
			service_price as rate
          FROM user_cart 
          WHERE user_id = @userCode
          ORDER BY created_at DESC
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  }

  // Add item to cart
  static async addToCart(userId, item) {
    try {
      const pool = await poolPromise;
      
      // Check if item already exists
      const existingItem = await pool.request()
        .input('userCode', sql.NVarChar, userId)
        .input('servSubTypeId', sql.Int, item.servSubType_Id)
        .query(`
          SELECT cart_id, quantity 
          FROM user_cart 
          WHERE user_id = @userCode AND servSubType_Id = @servSubTypeId
        `);

      if (existingItem.recordset.length > 0) {
        // Update quantity if item exists
        const newQuantity = existingItem.recordset[0].quantity + 1;
        await pool.request()
          .input('cartId', sql.Int, existingItem.recordset[0].cart_id)
          .input('quantity', sql.Int, newQuantity)
          .query(`
            UPDATE user_cart 
            SET quantity = @quantity, updated_at = GETDATE()
            WHERE cart_id = @cartId
          `);
        return { success: true, message: 'Item quantity updated' };
      } else {
        // Insert new item
        await pool.request()
          .input('userCode', sql.NVarChar, userId)
          .input('servSubTypeId', sql.Int, item.servSubType_Id)
          .input('serviceName', sql.NVarChar, item.serv_Name || '')
          .input('servSubType_Name', sql.NVarChar, item.servSubType_Name || '')
          .input('imagefile', sql.NVarChar, item.imagefile || '')
          .input('servicePrice', sql.Decimal(10,2), item.rate || 0)
          .input('quantity', sql.Int, 1)
          .query(`
            INSERT INTO user_cart (user_id, servSubType_Id, service_name, service_price, quantity,imagefile,servSubType_Name)
            VALUES (@userCode, @servSubTypeId, @serviceName, @servicePrice, @quantity,@imagefile,@servSubType_Name)
          `);
        return { success: true, message: 'Item added to cart' };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Remove item from cart
  static async removeFromCart(userId, servSubTypeId) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('userCode', sql.NVarChar, userId)
        .input('servSubTypeId', sql.Int, servSubTypeId)
        .query(`
          DELETE FROM user_cart 
          WHERE user_id = @userCode AND servSubType_Id = @servSubTypeId
        `);
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Update item quantity
  static async updateQuantity(userId, servSubTypeId, quantity) {
    try {
      const pool = await poolPromise;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return await this.removeFromCart(userId, servSubTypeId);
      }

      await pool.request()
        .input('userCode', sql.NVarChar, userId)
        .input('servSubTypeId', sql.Int, servSubTypeId)
        .input('quantity', sql.Int, quantity)
        .query(`
          UPDATE user_cart 
          SET quantity = @quantity, updated_at = GETDATE()
          WHERE user_id = @userCode AND servSubType_Id = @servSubTypeId
        `);
      return { success: true, message: 'Quantity updated' };
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }

  // Clear entire cart
  static async clearCart(userId) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('userCode', sql.NVarChar, userId)
        .query(`DELETE FROM user_cart WHERE user_id = @userCode`);
      return { success: true, message: 'Cart cleared' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Get cart count
  static async getCartCount(userId) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('userCode', sql.NVarChar, userId)
        .query(`
          SELECT COALESCE(SUM(quantity), 0) as total_items 
          FROM user_cart 
          WHERE user_id = @userCode
        `);
      return result.recordset[0].total_items;
    } catch (error) {
      console.error('Error getting cart count:', error);
      throw error;
    }
  }
}

module.exports = CartModel;