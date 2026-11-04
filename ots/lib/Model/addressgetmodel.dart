class Address {
  final int uaId;
  final int addressId;
  final String userId;
  final String location_Id;
  final String stateId;
  final String cityId;
  final String locationId;
  final String area;
  final String street;
  final String floorDoorNo;
  final String landmark;
  final String pinCode;
  final String addressType;
  final String mobile_number;

  final double longitude;
  final double lattitude;

  Address({
    required this.uaId,
    required this.addressId,
    required this.userId,
    required this.location_Id,
    required this.stateId,
    required this.cityId,
    required this.locationId,
    required this.area,
    required this.street,
    required this.floorDoorNo,
    required this.landmark,
    required this.pinCode,
    required this.addressType,
    required this.mobile_number,
    required this.longitude,
    required this.lattitude,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      uaId: json['UAID'] ?? 0,
      addressId: json['AddressId'] ?? 0,
      userId: json['user_ID'] ?? '',
      location_Id: json['location_Id'] ?? '',
      stateId: json['state_Id'] ?? '',
      cityId: json['city_Id'] ?? '',
      locationId: json['location_Id'] ?? '',
      area: json['Area'] ?? '',
      street: json['Street'] ?? '',
      floorDoorNo: json['Floor_Door_no'] ?? '',
      landmark: json['Landmark'] ?? '',
      pinCode: json['pin_Code'] ?? '',
      addressType: json['AddressType'] ?? '',
      mobile_number: json['mobile_number'] ?? '',
      longitude: _parseDouble(json['longitude']),
      lattitude: _parseDouble(json['lattitude']),
    );
  }

  /// Helper method to safely parse strings or dynamic values to double.
  /// If the value cannot be parsed, it defaults to 0.0.
  static double _parseDouble(dynamic value) {
    if (value == null) {
      return 0.0;
    }
    if (value is double) {
      return value;
    }
    if (value is String) {
      return double.tryParse(value) ?? 0.0;
    }
    return 0.0;
  }
}

class PostOffice {
  final String name;
  final String branchType;
  final String deliveryStatus;
  final String taluk;
  final String district;
  final String state;
  final String country;

  PostOffice({
    required this.name,
    required this.branchType,
    required this.deliveryStatus,
    required this.taluk,
    required this.district,
    required this.state,
    required this.country,
  });

  factory PostOffice.fromJson(Map<String, dynamic> json) {
    return PostOffice(
      name: json['Name'] ?? '',
      branchType: json['BranchType'] ?? '',
      deliveryStatus: json['DeliveryStatus'] ?? '',
      taluk: json['Taluk'] ?? '',
      district: json['District'] ?? '',
      state: json['State'] ?? '',
      country: json['Country'] ?? '',
    );
  }
}
