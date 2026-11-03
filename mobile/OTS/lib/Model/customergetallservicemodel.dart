// To parse this JSON data, do
//
//     final customergetservicemodel = customergetservicemodelFromJson(jsonString);

import 'dart:convert';

List<Customergetservicemodel> customergetservicemodelFromJson(String str) =>
    List<Customergetservicemodel>.from(
        json.decode(str).map((x) => Customergetservicemodel.fromJson(x)));

String customergetservicemodelToJson(List<Customergetservicemodel> data) =>
    json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

class Customergetservicemodel {
  int servId;
  String servCode;
  String? servName;
  String servDescription;
  int servTypeId;
  bool isActive;
  int companyId;
  String? imagefile;
  DateTime createdOn;
  int? createdBy;
  dynamic alteredOn;
  dynamic alteredBy;

  Customergetservicemodel({
    required this.servId,
    required this.servCode,
    this.servName,
    required this.servDescription,
    required this.servTypeId,
    required this.isActive,
    required this.companyId,
    this.imagefile,
    required this.createdOn,
    required this.createdBy,
    required this.alteredOn,
    required this.alteredBy,
  });

  factory Customergetservicemodel.fromJson(Map<String, dynamic> json) =>
      Customergetservicemodel(
        servId: json["serv_Id"],
        servCode: json["serv_Code"],
        servName: json["serv_Name"],
        servDescription: json["serv_Description"],
        servTypeId: json["servType_Id"],
        isActive: json["isActive"],
        companyId: json["company_Id"],
        imagefile: json["imagefile"],
        createdOn: DateTime.parse(json["created_On"]),
        createdBy: json["created_By"],
        alteredOn: json["altered_On"],
        alteredBy: json["altered_By"],
      );

  Map<String, dynamic> toJson() => {
        "serv_Id": servId,
        "serv_Code": servCode,
        "serv_Name": servName,
        "serv_Description": servDescription,
        "servType_Id": servTypeId,
        "isActive": isActive,
        "company_Id": companyId,
        "imagefile": imagefile,
        "created_On": createdOn.toIso8601String(),
        "created_By": createdBy,
        "altered_On": alteredOn,
        "altered_By": alteredBy,
      };
}
