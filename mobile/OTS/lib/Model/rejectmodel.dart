class rejectmodel {
  final int orderId;
  final String statusName;

  rejectmodel({required this.orderId, required this.statusName});

  // To JSON
  Map<String, dynamic> toJson() {
    return {
      'orderId': orderId,
      'status_Name': statusName,
    };
  }
}
