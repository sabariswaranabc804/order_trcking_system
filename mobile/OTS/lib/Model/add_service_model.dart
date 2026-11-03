class addserv_model {
  String userId;
  String servTypeName;
  String servName;
  String servDescription;
  String? imagefile;

  addserv_model({
    required this.userId,
    required this.servTypeName,
    required this.servName,
    required this.servDescription,
    this.imagefile,
  });

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'servType_Name': servTypeName,
      'serv_Name': servName,
      'serv_Description': servDescription,
      'imagefile': imagefile,
    };
  }
}
