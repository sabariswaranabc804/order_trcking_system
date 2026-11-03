class DeliveryMan {
  final int deliverymanId;
  final String deliverymanName;
  final String contact;
  final String email;
  final String status;
  final String dCode;
  final String alternativeNumber;
  final String city;
  final String address;
  final int companyId;

  DeliveryMan({
    required this.deliverymanId,
    required this.deliverymanName,
    required this.contact,
    required this.email,
    required this.status,
    required this.dCode,
    required this.alternativeNumber,
    required this.city,
    required this.address,
    required this.companyId,
  });

  factory DeliveryMan.fromJson(Map<String, dynamic> json) {
    return DeliveryMan(
      deliverymanId: json['deliveryman_id'],
      deliverymanName: json['deliveryman_name'],
      contact: json['contact'],
      email: json['email'],
      status: json['status'],
      dCode: json['d_code'],
      alternativeNumber: json['alternativeNumber'],
      city: json['city'],
      address: json['address'],
      companyId: json['company_Id'],
    );
  }
}
