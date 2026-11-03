// menu.js - Menu access data configuration

/**
 * Default menu access configuration for different user roles
 * Each item defines access permissions for admin, owner, anchor and customer roles
 */
export const menuAccessData = [
    { id: 1, title: 'Dashboard', menu: 'Master', submenu: 'Main', list: 'Dashboard Access', admin: true, owner: true, anchor: false, customer: false },
    { id: 2, title: 'Laundry Reception', menu: 'Master', submenu: 'Operations', list: 'Reception Management', admin: true, owner: true, anchor: false, customer: false },
    { id: 3, title: 'Orders', menu: 'Transaction', submenu: 'Order', list: 'Order Management', admin: true, owner: true, anchor: true, customer: true },
    { id: 9, title: 'One Way', menu: 'Transaction', submenu: 'Order', list: 'Order Management', admin: true, owner: true, anchor: true, customer: true },
    { id: 4, title: 'Two Way', menu: 'Transaction', submenu: 'Order', list: 'Order Management', admin: true, owner: true, anchor: true, customer: true },
    { id: 5, title: 'Customer', menu: 'Transaction', submenu: 'Order', list: 'Order Management', admin: true, owner: true, anchor: true, customer: true },
    { id: 6, title: 'Anchor', menu: 'Transaction', submenu: 'Order', list: 'Order Management', admin: true, owner: true, anchor: true, customer: true },
    { id: 7, title: 'Services', menu: 'Master', submenu: 'Service', list: 'Service Management', admin: true, owner: false, anchor: false, customer: false },
    { id: 8, title: 'Products', menu: 'Master', submenu: 'Product', list: 'Product Management', admin: true, owner: true, anchor: false, customer: false },
    { id: 10, title: 'Take Order', menu: 'Master', submenu: 'Deliveryman', list: 'Deliveryman Management', admin: true, owner: true, anchor: false, customer: false },
    { id: 11, title: 'My Order', menu: 'Master', submenu: 'Company', list: 'Company Settings', admin: true, owner: true, anchor: false, customer: false },
    { id: 12, title: 'Profile Page', menu: 'Master', submenu: 'Menu Access', list: 'Menu Access Management', admin: true, owner: true, anchor: false, customer: false },
    { id: 13, title: 'Company Settings', menu: 'Master', submenu: 'Company', list: 'Company Settings', admin: true, owner: true, anchor: false, customer: false },
    { id: 14, title: 'Admin Management', menu: 'Master', submenu: 'Menu Access', list: 'Menu Access Management', admin: true, owner: true, anchor: false, customer: false },
    { id: 15, title: 'Report & Analytics', menu: 'Master', submenu: 'Deliveryman', list: 'Deliveryman Management', admin: true, owner: true, anchor: false, customer: false },
    { id: 16, title: 'Customer OverView', menu: 'Master', submenu: 'Company', list: 'Company Settings', admin: true, owner: true, anchor: false, customer: false },
    { id: 17, title: 'Communication Support', menu: 'Master', submenu: 'Menu Access', list: 'Menu Access Management', admin: true, owner: true, anchor: false, customer: false },
    { id: 18, title: 'Setting Configuration', menu: 'Master', submenu: 'Deliveryman', list: 'Deliveryman Management', admin: true, owner: true, anchor: false, customer: false },
  ];
