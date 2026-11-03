// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/admin/serviceController');
const serviceSubTypeController = require('../controllers/admin/servSubTypeController');
const order=require('../controllers/admin/OrderController');
const deliverymanController = require('../controllers/admin/deliverymanController');
const customer=require('../controllers/admin/customer')




//const{upload}=require('../controllers/admin/servSubTypeController')
// Route to create service and service type
router.post('/service/create', serviceController.createService);

// 2. Update an existing service
router.put('/service/update/:serv_Id', serviceController.updateService);

// 3. Delete a service (soft delete)
router.put('/service/delete/:serv_Id', serviceController.deleteService);

// 4. Get all active services
router.get('/service/all', serviceController.getAllServices);

// 5. Get services by company_Id
router.get('/company/:company_Id', serviceController.getServicesByCompanyId);


// service suptype

router.get('/serviceSubTypes', serviceSubTypeController.getAllServiceSubTypes);
router.get('/serviceSubTypes/:id', serviceSubTypeController.getServiceSubTypeById);
router.post('/serviceSubTypes', serviceSubTypeController.addServiceSubType);
router.put('/serviceSubTypes/:id', serviceSubTypeController.updateServiceSubType);
router.put('/serviceSubTypes/disable/:id', serviceSubTypeController.deleteServiceSubType);

// service suptype


//orders 





// Route to fetch all order details
router.get('/admin/all-order-details', order.fetchAllOrderDetails);

router.get('/admin/all-order-detail', order.fetchAllOrderDetail);
// Route to fetch order details by order ID
//router.get('/admin/order-details/:orderId', order.fetchOrderIdDetails);

// Use the orders routes
router.use('/orders/:order_id/ready-to-drop', order.setReadyToDrop);

// Use the orders routes
router.use('/orders/:order_id/completed', order.setCompleted);

//deliverman create
router.post('/create/deliveryman', deliverymanController.createDeliveryman);

// Route to get all deliverymen for a specific company
router.get('/deliveryman', deliverymanController.getDeliverymenByCompanyId);

router.post("/update-status", order.updateOrderStatus2);

// Route to get a deliveryman by id
router.get('/deliverymanid/:deliveryman_id', deliverymanController.getDeliverymanById);

//assign task to deliveryman
router.post('/assign-deliveryman',deliverymanController.assignDeliveryman);

// API to fetch orders recommended to a specific deliveryman by the admin

router.get('/assignedOrders/:deliverymanId',deliverymanController.recommendAchor);

//Deliveryman id 



router.post('/deliveryman/accept-order',deliverymanController.acceptOrder);


// Route to get all orders for a specific deliveryman
router.get('/myorders/:deliverymanId/all', deliverymanController.getAllOrders);

router.get('/myorderhistory/:deliverymanId/all', deliverymanController.getDeliverymanHistoryOrders);

// Route to get pick orders (status = 3) for a specific deliveryman
router.get('/myorders/:deliverymanId/pick', deliverymanController.getPickOrders);

// Route to get drop orders (status = 5) for a specific deliveryman
router.get('/myorders/:deliverymanId/drop', deliverymanController.getDropOrders);


router.post('/myorder/reject-order', deliverymanController.rejectOrder);

//customer

router.get('/customer',customer.getUsersByType)

// User addresses
router.get('/user-addresses/:userId', customer.getUserAddresses)
router.post('/user-addresses', customer.addUserAddress)

//deliveryman

router.put('/deliveryman/disable/:id',deliverymanController.deleteAnchor);

router.put('/deliveryman/edit/:id',deliverymanController.editAnchor)

router.put('/orders/updatePayment',deliverymanController.updatePaymentStatus)


// GET API to fetch data from RejectOrders in descending order
router.get('/rejectlist', deliverymanController.getRejectOrdersList);



module.exports = router;
