class Admorderdetailsmodel {
  final int orderId;
  final DateTime orderDate;
  final int totalPrice;
  final int totalItem;
  final String userName;
  final String emailId;
  final String mobileNumber;
  final String cityId;
  final String statusName;
  final String payment;
  final String? deliverymanName; // Make this field nullable

  Admorderdetailsmodel({
    required this.orderId,
    required this.orderDate,
    required this.totalPrice,
    required this.totalItem,
    required this.userName,
    required this.emailId,
    required this.mobileNumber,
    required this.cityId,
    required this.statusName,
    required this.payment,
    this.deliverymanName, // Nullable field
  });

  // Factory method to create an instance from JSON
  factory Admorderdetailsmodel.fromJson(Map<String, dynamic> json) {
    return Admorderdetailsmodel(
      orderId: json['order_id'],
      orderDate: DateTime.parse(json['order_date']),
      totalPrice: json['total_price'],
      totalItem: json['total_item'],
      userName: json['user_Name'],
      emailId: json['email_Id'],
      mobileNumber: json['mobile_Number'],
      cityId: json['city_Id'],
      statusName: json['status_Name'],
      payment: json['payment'] ?? 'N/A',
      deliverymanName: json['deliveryman_name'], // Allow nullable values
    );
  }
}
