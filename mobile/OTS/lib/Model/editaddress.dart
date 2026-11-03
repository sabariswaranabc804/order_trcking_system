class editAddress {
  final String addressId;
  final String userId;
  final String country;
  final String state;
  final String city;
  final String area;
  final String street;
  final String floorDoorNumber;
  final String landmark;
  final String pinCode;
  final String addressType;
  String? location;
  final String phoneNumber;

  editAddress({
    required this.addressId,
    required this.userId,
    required this.country,
    required this.state,
    required this.city,
    required this.area,
    required this.street,
    required this.floorDoorNumber,
    required this.landmark,
    required this.pinCode,
    required this.addressType,
    this.location,
    required this.phoneNumber,
  });

  // Method to convert the instance to a map
  Map<String, dynamic> toMap() {
    return {
      'addressId': addressId,
      'userId': userId,
      'country': country,
      'state': state,
      'city': city,
      'area': area,
      'street': street,
      'floorDoorNumber': floorDoorNumber,
      'landmark': landmark,
      'pinCode': pinCode,
      'addressType': addressType,
      'location': location,
      'phoneNumber': phoneNumber,
    };
  }

  // Factory constructor to create an instance from a map, if needed
  factory editAddress.fromMap(Map<String, dynamic> map) {
    return editAddress(
      addressId: map['addressId'],
      userId: map['userId'],
      country: map['country'],
      state: map['state'],
      city: map['city'],
      area: map['area'],
      street: map['street'],
      floorDoorNumber: map['floorDoorNumber'],
      landmark: map['landmark'],
      pinCode: map['pinCode'],
      addressType: map['addressType'],
      location: map['location'],
      phoneNumber: map['phoneNumber'],
    );
  }
}
