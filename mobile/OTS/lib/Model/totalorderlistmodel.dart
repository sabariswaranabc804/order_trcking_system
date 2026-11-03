class totalorderlist {
  final int orderId;
  final String userCode;
  final double totalPrice; // Use double for prices
  final DateTime orderDate;
  final int addressId;
  final int orderStatusId;

  totalorderlist({
    required this.orderId,
    required this.userCode,
    required this.totalPrice,
    required this.orderDate,
    required this.addressId,
    required this.orderStatusId,
  });

  // Factory method to create an Order from JSON
  factory totalorderlist.fromJson(Map<String, dynamic> json) {
    return totalorderlist(
      orderId: json['order_id'],
      userCode: json['user_Code'],
      totalPrice: json['total_price'].toDouble(), // Ensure price is double
      orderDate: DateTime.parse(json['order_date']),
      // Handling cases where AddressId might be a list or an int
      addressId: json['AddressId'] is int
          ? json['AddressId']
          : (json['AddressId'] as List<dynamic>).first,
      // Handling cases where orderStatusId might be a list or an int
      orderStatusId: json['orderStatus_Id'] is int
          ? json['orderStatus_Id']
          : (json['orderStatus_Id'] as List<dynamic>).first,
    );
  }
}

class OrderList {
  final List<totalorderlist> orders;

  OrderList({required this.orders});

  factory OrderList.fromJson(Map<String, dynamic> json) {
    print('Raw JSON: $json'); // Log the raw JSON to debug the issue

    return OrderList(
      orders: (json['data'] as List<dynamic>)
          .map((orderJson) => totalorderlist.fromJson(orderJson))
          .toList(),
    );
  }
}
