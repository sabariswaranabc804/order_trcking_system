const { getAllOrderDetails ,getOrderIdDetails,updateOrderStatus,getAllOrderDetail} = require('../../models/admin/OrderModel');
const { sendWhatsAppMessage } = require("../../utils.js");
// const  = require("mssql");
const {poolPromise,sql} = require("../../db.js");
const fetchAllOrderDetails = async (req, res) => {

    // If frontend sends: /api/admin/all-order-details?type=washing
    console.log("Query param:", req.query.type);

    ;
  
  try {
    const { type } = req.query
    const allOrders = await getAllOrderDetails(type);

    if (allOrders.length > 0) {
      res.status(200).json({
        success: true,
        data: allOrders
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No orders found'
      });
     
      
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
    console.log(error);
  }
};
const fetchAllOrderDetail = async (req, res) => {
  try {
    const allOrders = await getAllOrderDetail();

    if (allOrders.length > 0) {
      res.status(200).json({
        success: true,
        data: allOrders
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No orders found'
      });
     
      
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
    console.log(error);
  }
};
const fetchOrderIdDetails = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const orderDetails = await getOrderIdDetails(orderId);
  
      if (orderDetails) {
        res.status(200).json({
          success: true,
          data: orderDetails
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching order details',
        error: error.message
      });
    }
  };
  

  // Update order status to "Ready to Drop"
// const setReadyToDrop = async (req, res) => {
//   const { mobile_Number } = req.body; // Extract mobile number from request body
//   console.log(mobile_Number);
  
//   if (!mobile_Number) {
//       return res.status(400).json({ message: "Mobile number is required." });
//   }
//   try {
//       const { order_id } = req.params;
//       const updatedOrder = await updateOrderStatus(order_id, 5); // Status 4 is 'Ready to Drop'
//       res.status(200).json({ message: 'Order status updated to Ready to Drop', updatedOrder });
//   } catch (error) {
//       res.status(500).json({ error: 'Failed to update order status' });
//   }
// };
const setReadyToDrop = async (req, res) => {
  const { mobile_Number ,oneWay} = req.body; // Extract mobile number from request body
   
  let flag=4;

  if(oneWay){
    flag=5;
  }
  //console.log(mobile_Number,oneWay,flag);
  
  // if (!mobile_Number) {
  //     return res.status(400).json({ message: "Mobile number is required." });
  // }
   
  try {
      const { order_id } = req.params;
      const updatedOrder = await updateOrderStatus(order_id,flag); // Status 5 is 'Ready to Drop' 


       if(mobile_Number){
  // WhatsApp message content
      const message = `🚚 Your order #${order_id} is now *Ready for Pickup*! Please collect it at your convenience. Thank you! 😊`;

      // Send WhatsApp message
      await sendWhatsAppMessage(mobile_Number, message);
 }
      

      res.status(200).json({ message: "Order status updated and WhatsApp message sent.", updatedOrder });
  } catch (error) {
      res.status(500).json({ error: "Failed to update order status or send WhatsApp message" });
  }
};
// Update order status to "Completed"
const setCompleted = async (req, res) => {
  try {
      const { order_id } = req.params;
      const updatedOrder = await updateOrderStatus(order_id, 6); // Status 6 is 'Completed'
      res.status(200).json({ message: 'Order status updated to Completed', updatedOrder });
  } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
  }
};


const updateOrderStatus2 = async (req, res) => {
  const { orderId, oldStatus, adminId, deliverymanId, action,ordertype } = req.body;

  console.log("orderId", orderId, "oldStatus", oldStatus, "adminId", adminId, "deliverymanId", deliverymanId, "action", action,"type",ordertype);
  console.log(typeof orderId, typeof oldStatus, typeof adminId, typeof deliverymanId, typeof action);

  try {
    const pool = await poolPromise;

    let newStatus;

    if ((oldStatus === 0 || oldStatus === 1) && action === 'cancel') {
      newStatus = 9;
    } else if (oldStatus === 0) {
      if (action === 'accept') {
        newStatus = 1;
      } else if (action === 'reject') {
        newStatus = 10;
      }
    } else if (oldStatus === 3) {
      newStatus = 4;
    } else if (oldStatus === 4) {
      if(ordertype=='self-service'){
        newStatus=8
      }else{
           newStatus = 5;
      }
   
    } else if (oldStatus === 10) {
      newStatus = 1;
    } else if (oldStatus === 7) {
      newStatus = 8;
    } else if (oldStatus === 2) {
      if (action === 'accept') {
        newStatus = 3;
      } else if (action === 'reject') {
        newStatus = 1;
      }
    } else if (oldStatus === 6) {
      if (action === 'accept') {
        newStatus = 7;
      } else if (action === 'reject') {
        newStatus = 5;
      }
    } else {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    const request = pool.request();
    let updateFields = "orderStatus_Id = @newStatus";
    request.input("orderId", sql.Int, orderId);
    request.input("newStatus", sql.Int, newStatus);

    if (adminId !== undefined) {
      updateFields += ", admin_id = @adminId";
      request.input("adminId", sql.NVarChar(50), adminId);
    }

    if (deliverymanId !== undefined) {
      updateFields += ", deliveryman_id = @deliverymanId";
      request.input("deliverymanId", sql.Int, deliverymanId);
    }

    const updateQuery = `
      UPDATE Orders
      SET ${updateFields}
      WHERE order_id = @orderId
    `;

    await request.query(updateQuery);

    // Insert into OrderHistory only for status 2 or 6
    if (oldStatus === 2 || oldStatus === 6) {
      await pool.request()
        .input("orderId", sql.Int, orderId)
        .input("newStatus", sql.Int, newStatus)
        .input("deliverymanId", sql.Int, deliverymanId || null)
        .query(`
          INSERT INTO OrderHistory (order_id, deliveryman_id, orderStatus_Id, changed_at)
          VALUES (@orderId, @deliverymanId, @newStatus, GETDATE())
        `);
    }

    res.status(200).json({ message: "Order status updated", newStatus });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



  

module.exports = { fetchAllOrderDetails, updateOrderStatus2,fetchAllOrderDetail,fetchOrderIdDetails ,setReadyToDrop,setCompleted};
