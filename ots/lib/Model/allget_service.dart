class AllgetService {
  int? servSubTypeId;
  int? servId;
  String? servSubTypeName;
  int? rate;
  String? imagefile;
  int? companyId;
  String? servName;

  AllgetService({
    this.servSubTypeId,
    this.servId,
    this.servSubTypeName,
    this.rate,
    this.imagefile,
    this.companyId,
    this.servName,
  });

  factory AllgetService.fromJson(Map<String, dynamic> json) => AllgetService(
        servSubTypeId: json["servSubType_Id"],
        servId: json["serv_Id"],
        servSubTypeName: json["servSubType_Name"],
        rate: json["rate"],
        imagefile: json["imagefile"],
        companyId: json["company_Id"],
        servName: json["serv_Name"],
      );
}
