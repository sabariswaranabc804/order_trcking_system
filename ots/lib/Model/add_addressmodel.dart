class addAddress {
  String userId;
  String country;
  String phoneNumber;
  String state;
  String city;
  String area;
  String street;
  String floorDoorNumber;
  String landmark;
  String pinCode;
  String addressType;
  String? latitude;
  String? longitude;

  addAddress({
    required this.userId,
    required this.phoneNumber,
    required this.country,
    required this.state,
    required this.city,
    required this.area,
    required this.street,
    required this.floorDoorNumber,
    required this.landmark,
    required this.pinCode,
    required this.addressType,
    this.latitude,
    this.longitude,
  });

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'phoneNumber': phoneNumber,
      'country': country,
      'state': state,
      'city': city,
      'area': area,
      'street': street,
      'floorDoorNumber': floorDoorNumber,
      'landmark': landmark,
      'pinCode': pinCode,
      'addressType': addressType,
      'location': {
        'latitude': double.parse(latitude!),
        'longitude': double.parse(longitude!),
      }
    };
  }
}
