class OrderAssignment {
  final int id;
  final int orderId;
  final String deliverymanName;
  final int deliverymanId;

  OrderAssignment({
    required this.id,
    required this.orderId,
    required this.deliverymanName,
    required this.deliverymanId,
  });

  // Factory constructor to create an instance from JSON
  factory OrderAssignment.fromJson(Map<String, dynamic> json) {
    return OrderAssignment(
      id: json['id'],
      orderId: json['order_id'],
      deliverymanName: json['deliveryman_name'],
      deliverymanId: json['deliveryman_id'],
    );
  }
}
