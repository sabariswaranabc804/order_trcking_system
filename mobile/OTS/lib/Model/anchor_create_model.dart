class createanchormodel {
  final String userName;
  final String mobileNumber;
  final String emailId;
  final String alternativeNumber;
  final String city;
  final String address;
  final String companyId;

  createanchormodel({
    required this.userName,
    required this.mobileNumber,
    required this.emailId,
    required this.alternativeNumber,
    required this.city,
    required this.address,
    required this.companyId,
  });

  // Convert a User object into a JSON map
  Map<String, dynamic> toJson() {
    return {
      'user_Name': userName,
      'mobile_Number': mobileNumber,
      'email_ID': emailId,
      'alternativeNumber': alternativeNumber,
      'city': city,
      'address': address,
      'company_Id': companyId,
    };
  }
}
