class Assignedorder {
  int? orderId;
  String? userCode;
  int? totalPrice;
  DateTime? orderDate;
  int? orderStatusId;
  String? userName;
  int? totalItem;
  String? emailId;
  String? customerPhone;
  DateTime? assignDate;
  String? statusName;
  String? cityId;
  String? deliverymanName;
  String? assignmentStatus;

  Assignedorder({
    required this.orderId,
    required this.userCode,
    required this.totalPrice,
    required this.orderDate,
    required this.orderStatusId,
    required this.userName,
    required this.totalItem,
    required this.emailId,
    required this.customerPhone,
    required this.assignDate,
    required this.statusName,
    required this.cityId,
    required this.deliverymanName,
    required this.assignmentStatus,
  });

  // Factory method to convert JSON data to Dart object
  factory Assignedorder.fromJson(Map<String, dynamic> json) {
    return Assignedorder(
      orderId: json['order_id'],
      userCode: json['user_Code'],
      totalPrice: json['total_price'],
      orderDate: DateTime.parse(json['order_date']),
      orderStatusId: json['orderStatus_Id'],
      userName: json['user_Name'],
      totalItem: json['total_item'],
      emailId: json['email_Id'],
      customerPhone: json['customer_phone'],
      assignDate: DateTime.parse(json['assign_date']),
      statusName: json['status_Name'],
      cityId: json['city_Id'],
      deliverymanName: json['deliveryman_name'],
      assignmentStatus: json['assignment_status'],
    );
  }
}
