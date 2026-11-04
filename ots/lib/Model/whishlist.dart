class WishlistItem {
  final String userId;
  final int servSubTypeId;

  WishlistItem({required this.userId, required this.servSubTypeId});

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'servSubType_Id': servSubTypeId,
    };
  }
}
