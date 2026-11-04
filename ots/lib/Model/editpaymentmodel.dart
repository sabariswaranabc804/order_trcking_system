class editpaymentmodel {
  final String orderId;
  final String paymentStatus;

  editpaymentmodel({required this.orderId, required this.paymentStatus});

  // Factory method to create an Order instance from a map
  factory editpaymentmodel.fromJson(Map<String, dynamic> json) {
    return editpaymentmodel(
      orderId: json['orderId'],
      paymentStatus: json['paymentStatus'],
    );
  }

  // Method to convert Order instance to map (for sending data)
  Map<String, dynamic> toJson() {
    return {
      'orderId': orderId,
      'paymentStatus': paymentStatus,
    };
  }
}
