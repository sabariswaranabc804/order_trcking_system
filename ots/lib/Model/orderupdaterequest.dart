class OrderUpdateRequest {
  int orderId;
  String statusName;
  List<int> deliverymanIds;

  OrderUpdateRequest({
    required this.orderId,
    required this.statusName,
    required this.deliverymanIds,
  });

  // Convert Dart object to JSON
  Map<String, dynamic> toJson() {
    return {
      'orderId': orderId,
      'status_Name': statusName, // Corrected JSON key
      'deliverymanIds': deliverymanIds,
    };
  }
}
