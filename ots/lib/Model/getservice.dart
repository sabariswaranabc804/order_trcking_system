import 'dart:convert';

class getService {
  final int servId;
  final String servCode;
  final String servName;
  final String servDescription;
  final String imagefile;
  final int servTypeId;
  final bool isActive;

  getService({
    required this.servId,
    required this.servCode,
    required this.servName,
    required this.servDescription,
    required this.servTypeId,
    required this.isActive,
    required this.imagefile,
  });

  factory getService.fromJson(Map<String, dynamic> json) {
    return getService(
      servId: json['serv_Id'],
      servCode: json['serv_Code'],
      servName: json['serv_Name'],
      servDescription: json['serv_Description'],
      servTypeId: json['servType_Id'],
      isActive: json['isActive'],
      imagefile: json['imagefile'],
    );
  }
}
