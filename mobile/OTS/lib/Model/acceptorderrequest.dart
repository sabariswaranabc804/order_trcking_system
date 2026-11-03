class OrderDeliverymanRequest {
  final int orderId;
  final int deliverymanId;

  OrderDeliverymanRequest({
    required this.orderId,
    required this.deliverymanId,
  });

  // Convert Dart object to JSON
  Map<String, dynamic> toJson() {
    return {
      'orderId': orderId,
      'deliverymanId': deliverymanId,
    };
  }

  // Factory method to create an instance from JSON (optional)
  factory OrderDeliverymanRequest.fromJson(Map<String, dynamic> json) {
    return OrderDeliverymanRequest(
      orderId: json['orderId'],
      deliverymanId: json['deliverymanId'],
    );
  }
}
