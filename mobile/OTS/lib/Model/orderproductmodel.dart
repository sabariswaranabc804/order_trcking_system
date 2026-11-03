class Order {
  final int orderId;
  final String userCode;
  final DateTime orderDate;
  final String cityId;
  final String area;
  final String street;
  final String floorDoorNo;
  final String addressType;
  final String deliverymanName;
  final String contact;
  final int orderStatusId;

  Order({
    required this.orderId,
    required this.userCode,
    required this.orderDate,
    required this.cityId,
    required this.area,
    required this.street,
    required this.floorDoorNo,
    required this.addressType,
    required this.deliverymanName,
    required this.contact,
    required this.orderStatusId,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      orderId: json['order_id'] is int
          ? json['order_id']
          : (json['order_id'] is List<dynamic> && json['order_id'] != null)
              ? (json['order_id'] as List<dynamic>).first
              : 0, // Provide default value if null or not a list
      userCode: json['user_Code'] ?? 'N/A', // Provide a default value if null
      orderDate: json['order_date'] != null
          ? DateTime.parse(json['order_date'])
          : DateTime.now(), // Use current date if null
      cityId: json['city_Id']?.toString() ?? 'Unknown City', // Handle null case
      area: json['Area'] ?? 'Unknown Area', // Provide a default if null
      street: json['Street'] ?? 'Unknown Street', // Handle null case
      floorDoorNo: json['Floor_Door_no'] ?? 'N/A', // Handle null case
      addressType: json['AddressType'] ?? 'Unknown Type', // Handle null case
      deliverymanName:
          json['deliveryman_name'] ?? 'Unknown', // Handle null case
      contact: json['contact'] ?? 'N/A', // Handle null case
      orderStatusId: json['orderStatus_Id'] is int
          ? json['orderStatus_Id']
          : (json['orderStatus_Id'] is List<dynamic> &&
                  json['orderStatus_Id'] != null)
              ? (json['orderStatus_Id'] as List<dynamic>).first
              : 0, // Provide default value if null or not a list
    );
  }
}

class Product {
  final int itemId;
  final int orderId;
  final String productName;
  final String category_name;
  final int quantity;
  final double rate;
  final double totalPrice;

  Product({
    required this.itemId,
    required this.orderId,
    required this.productName,
    required this.category_name,
    required this.quantity,
    required this.rate,
    required this.totalPrice,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      itemId: json['item_id'] ?? 0,
      orderId: json['order_id'] ?? 0,
      productName: json['product_name'] ?? '',
      category_name: json['category_name'] ?? 'N/A',
      quantity: json['quantity'] ?? 0,
      rate: (json['rate'] as num?)?.toDouble() ?? 0.0,
      totalPrice: (json['total_price'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
