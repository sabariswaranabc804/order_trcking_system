class anchorassigned_orders_model {
  final int orderId;
  final String userCode;
  final double totalPrice;
  final DateTime orderDate;
  final int deliverymanId;
  final int currentStatus;
  final int orderStatusId;
  final String stateId;
  final String cityId;
  final String locationId;
  final String area;
  final String street;
  final String userName;
  final String mobileNumber;
  final String emailId;
  final String statusName;
  final String payment;

  anchorassigned_orders_model({
    required this.orderId,
    required this.userCode,
    required this.totalPrice,
    required this.orderDate,
    required this.deliverymanId,
    required this.currentStatus,
    required this.orderStatusId,
    required this.stateId,
    required this.cityId,
    required this.locationId,
    required this.area,
    required this.street,
    required this.userName,
    required this.mobileNumber,
    required this.emailId,
    required this.statusName,
    required this.payment,
  });

  // Factory method to create an Order instance from JSON
  factory anchorassigned_orders_model.fromJson(Map<String, dynamic> json) {
    return anchorassigned_orders_model(
      orderId: json['order_id'],
      userCode: json['user_Code'],
      totalPrice:
          json['total_price'].toDouble(), // Make sure to handle price as double
      orderDate: DateTime.parse(json['order_date']),
      deliverymanId: json['deliveryman_id'],
      currentStatus: json['currentstatus'],
      orderStatusId: json['orderStatus_Id'],
      stateId: json['state_Id'],
      cityId: json['city_Id'],
      locationId: json['location_Id'],
      area: json['Area'],
      street: json['Street'],
      userName: json['user_Name'],
      mobileNumber: json['mobile_Number'],
      emailId: json['email_ID'],
      statusName: json['status_Name'],
      payment: json['payment'] ?? "N/A",
    );
  }

  // Method to convert Order instance to JSON
  Map<String, dynamic> toJson() {
    return {
      'order_id': orderId,
      'user_Code': userCode,
      'total_price': totalPrice,
      'order_date': orderDate.toIso8601String(),
      'deliveryman_id': deliverymanId,
      'currentstatus': currentStatus,
      'orderStatus_Id': orderStatusId,
      'state_Id': stateId,
      'city_Id': cityId,
      'location_Id': locationId,
      'Area': area,
      'Street': street,
      'user_Name': userName,
      'mobile_Number': mobileNumber,
      'email_ID': emailId,
      'status_Name': statusName,
    };
  }
}
