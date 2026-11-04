class Adm_orderdetails {
  final int orderId;
  final String userCode;
  final double totalPrice;
  final DateTime orderDate;
  final List<int> addressId;
  final int? orderStatusId;
  final List<int> deliverymanId;
  final int totalItem;
  final int uaid;
  final String userId;
  final double longitude;
  final double latitude;
  final List<String?> address;
  final String? stateId; // Nullable
  final String? cityId; // Nullable
  final String? locationId; // Nullable
  final String? area; // Nullable
  final String? street; // Nullable
  final String? floorDoorNo; // Nullable
  final String? landmark; // Nullable
  final String pinCode;
  final String? addressType; // Nullable
  final String deliverymanName;
  final String contact;
  final String mobileNumber;
  final String email;
  final String status;
  final String dCode;
  final String alternativeNumber;
  final String? city; // Nullable
  final int companyId;
  final List<AdmProduct> products;

  Adm_orderdetails({
    required this.orderId,
    required this.userCode,
    required this.totalPrice,
    required this.orderDate,
    required this.addressId,
    this.orderStatusId,
    required this.deliverymanId,
    required this.totalItem,
    required this.uaid,
    required this.userId,
    required this.longitude,
    required this.latitude,
    required this.address,
    this.stateId, // Nullable
    this.cityId, // Nullable
    this.locationId, // Nullable
    this.area, // Nullable
    this.street, // Nullable
    this.floorDoorNo, // Nullable
    this.landmark, // Nullable
    required this.pinCode,
    this.addressType, // Nullable
    required this.deliverymanName,
    required this.contact,
    required this.mobileNumber,
    required this.email,
    required this.status,
    required this.dCode,
    required this.alternativeNumber,
    this.city, // Nullable
    required this.companyId,
    required this.products,
  });

  factory Adm_orderdetails.fromJson(Map<String, dynamic> json) {
    var productList = (json['products'] as List)
        .map((product) => AdmProduct.fromJson(product))
        .toList();

    var addressIdList = (json['order']['AddressId'] as List?)
            ?.map(
                (item) => item != null ? int.tryParse(item.toString()) ?? 0 : 0)
            .toList() ??
        [];

    var deliverymanIdList = (json['order']['deliveryman_id'] as List?)
            ?.map(
                (item) => item != null ? int.tryParse(item.toString()) ?? 0 : 0)
            .toList() ??
        [];

    return Adm_orderdetails(
      orderId: json['order']['order_id'] ?? 0,
      userCode: json['order']['user_Code'] ?? '',
      totalPrice: (json['order']['total_price']?.toDouble()) ?? 0.0,
      orderDate: DateTime.parse(json['order']['order_date'] ?? '1970-01-01'),
      addressId: addressIdList,
      orderStatusId: json['order']['orderStatus_Id'],
      deliverymanId: deliverymanIdList,
      totalItem: json['order']['total_item'] ?? 0,
      uaid: json['order']['UAID'] ?? 0,
      userId: json['order']['user_ID'] ?? '',
      longitude: (json['order']['longitude']?.toDouble()) ?? 0.0,
      latitude: (json['order']['lattitude']?.toDouble()) ?? 0.0,
      address: List<String?>.from(json['order']['address'] ?? []),
      stateId: json['order']['state_Id'],
      cityId: json['order']['city_Id'],
      locationId: json['order']['location_Id'],
      area: json['order']['Area'],
      street: json['order']['Street'],
      floorDoorNo: json['order']['Floor_Door_no'],
      landmark: json['order']['Landmark'],
      pinCode: json['order']['pin_Code'] ?? '',
      addressType: json['order']['AddressType'],
      deliverymanName: json['order']['deliveryman_name'] ?? '',
      contact: json['order']['contact'] ?? '',
      mobileNumber: json['order']['mobile_number'] ?? '',
      email: json['order']['email'] ?? '',
      status: json['order']['status'] ?? '',
      dCode: json['order']['d_code'] ?? '',
      alternativeNumber: json['order']['alternativeNumber'] ?? '',
      city: json['order']['city'],
      companyId: json['order']['company_Id'] ?? 0,
      products: productList,
    );
  }
}

class AdmProduct {
  final int itemId;
  final int orderId;
  final String productName;
  final String category_name;
  final int quantity;
  final double rate;
  final double totalPrice;

  AdmProduct({
    required this.itemId,
    required this.orderId,
    required this.productName,
    required this.category_name,
    required this.quantity,
    required this.rate,
    required this.totalPrice,
  });

  factory AdmProduct.fromJson(Map<String, dynamic> json) {
    return AdmProduct(
      itemId: json['item_id'] ?? 0,
      orderId: json['order_id'] ?? 0,
      productName: json['product_name'] ?? '',
      category_name: json['category_name'] ?? '',
      quantity: json['quantity'] ?? 0,
      rate: (json['rate']?.toDouble()) ?? 0.0,
      totalPrice: (json['total_price']?.toDouble()) ?? 0.0,
    );
  }
}
