class add_product {
  String servSubTypeName;
  String rate;
  String servName;
  String companyId;
  String imagefile;

  add_product({
    required this.servSubTypeName,
    required this.rate,
    required this.servName,
    required this.companyId,
    required this.imagefile,
  });

  // Method to convert the instance to JSON
  Map<String, dynamic> toJson() {
    return {
      'servSubType_Name': servSubTypeName,
      'rate': rate,
      'serv_Name': servName,
      'company_Id': companyId,
      'imagefile': imagefile,
    };
  }
}
