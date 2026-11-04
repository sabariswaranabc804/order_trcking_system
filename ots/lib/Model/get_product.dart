class getproduct {
  int servSubTypeId;
  int servId;
  String servSubTypeName;
  int rate;
  String? imagefile;
  int companyId;
  String? servName;

  getproduct({
    required this.servSubTypeId,
    required this.servId,
    required this.servSubTypeName,
    required this.rate,
    required this.imagefile,
    required this.companyId,
    required this.servName,
  });

  factory getproduct.fromJson(Map<String, dynamic> json) => getproduct(
        servSubTypeId: json["servSubType_Id"],
        servId: json["serv_Id"],
        servSubTypeName: json["servSubType_Name"],
        rate: json["rate"],
        imagefile: json["imagefile"],
        companyId: json["company_Id"],
        servName: json["serv_Name"],
      );
}
