class WishlistItem1 {
  final int id;
  final String userCode;
  final int servSubTypeId;
  late final bool flag;
  final String createdAt;
  final String servSubTypeName;
  final String servName;
  final String imageFile;
  final double rate;

  WishlistItem1({
    required this.id,
    required this.userCode,
    required this.servSubTypeId,
    required this.flag,
    required this.createdAt,
    required this.servSubTypeName,
    required this.servName,
    required this.imageFile,
    required this.rate,
  });

  // Factory constructor to create a WishlistItem1 from JSON
  factory WishlistItem1.fromJson(Map<String, dynamic> json) {
    return WishlistItem1(
      id: json['id'],
      userCode: json['user_Code'],
      servSubTypeId: json['servSubType_Id'],
      flag: json['flag'],
      createdAt: json['created_at'],
      servSubTypeName: json['servSubType_Name'],
      servName: json['serv_Name'],
      imageFile: json['imagefile'],
      rate: (json['rate'] as num).toDouble(),
    );
  }
}
