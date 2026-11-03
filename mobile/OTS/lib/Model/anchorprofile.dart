class AnchorProfileModel {
  final int userId;
  final String userCode;
  final String userName;
  final int userTypeId;
  final int companyId;
  final String? gstin;
  final String? panId;
  final String? aadharId;
  final String? fssaiNumber;
  final bool? allowDiscount;
  final double? discountPercent;
  final String? paymentMode;
  final String? contactPerson;
  final String mobileNumber;
  final String? altMobileNumber;
  final String? phoneNumber;
  final String? address;
  final int? stateId;
  final int? cityId;
  final int? locationId;
  final String? pinCode;
  final String emailId;
  final String? altEmailId;
  final String? accountNumber;
  final bool activeFlag;
  final DateTime? dateBirth;
  final DateTime? dateJoining;
  final String? accountHolderName;
  final String? ifscCode;
  final String? bankName;
  final String? bankBranchName;
  final String? bankPhoneNo;
  final DateTime? openingDate;
  final String? username;
  final String? password;
  final int? creditDays;
  final double? creditAmount;
  final double? paymentLimit;
  final String? createdBy;
  final DateTime? createdDate;
  final String? modifiedBy;
  final DateTime? modifiedDate;
  final bool? canCreate;
  final bool? canEdit;
  final bool? canDelete;
  final bool? canView;
  final String? userImage;
  final String? userCodeString;
  final int? deliverymanId;

  AnchorProfileModel({
    required this.userId,
    required this.userCode,
    required this.userName,
    required this.userTypeId,
    required this.companyId,
    this.gstin,
    this.panId,
    this.aadharId,
    this.fssaiNumber,
    this.allowDiscount,
    this.discountPercent,
    this.paymentMode,
    this.contactPerson,
    required this.mobileNumber,
    this.altMobileNumber,
    this.phoneNumber,
    this.address,
    this.stateId,
    this.cityId,
    this.locationId,
    this.pinCode,
    required this.emailId,
    this.altEmailId,
    this.accountNumber,
    required this.activeFlag,
    this.dateBirth,
    this.dateJoining,
    this.accountHolderName,
    this.ifscCode,
    this.bankName,
    this.bankBranchName,
    this.bankPhoneNo,
    this.openingDate,
    this.username,
    this.password,
    this.creditDays,
    this.creditAmount,
    this.paymentLimit,
    this.createdBy,
    this.createdDate,
    this.modifiedBy,
    this.modifiedDate,
    this.canCreate,
    this.canEdit,
    this.canDelete,
    this.canView,
    this.userImage,
    this.userCodeString,
    this.deliverymanId,
  });

  factory AnchorProfileModel.fromJson(Map<String, dynamic> json) {
    return AnchorProfileModel(
      userId: json['user_ID'],
      userCode: json['user_Code'],
      userName: json['user_Name'],
      userTypeId: json['user_Type_ID'],
      companyId: json['company_Id'],
      gstin: json['GSTIN'],
      panId: json['pan_ID'],
      aadharId: json['aadhar_ID'],
      fssaiNumber: json['fssai_Number'],
      allowDiscount: json['allow_Discount'] ?? false, // Default to false
      discountPercent: json['discount_Percent']?.toDouble(),
      paymentMode: json['pmt_Mode'],
      contactPerson: json['contact_Person'],
      mobileNumber: json['mobile_Number'],
      altMobileNumber: json['alter_Mobile_number'],
      phoneNumber: json['phone_Number'],
      address: json['address'],
      stateId: json['state_Id'],
      cityId: json['city_Id'],
      locationId: json['location_Id'],
      pinCode: json['pin_Code'],
      emailId: json['email_ID'],
      altEmailId: json['alt_Email_ID'],
      accountNumber: json['acct_Number'],
      activeFlag: json['active_Flag'] ?? false, // Default to false
      dateBirth: json['date_Birth'] != null
          ? DateTime.parse(json['date_Birth'])
          : null,
      dateJoining: json['date_Joining'] != null
          ? DateTime.parse(json['date_Joining'])
          : null,
      accountHolderName: json['acct_Holder_Name'],
      ifscCode: json['ifsc_Code'],
      bankName: json['bank_Name'],
      bankBranchName: json['bank_Branch_Name'],
      bankPhoneNo: json['bank_phone_No'],
      openingDate: json['opening_Date'] != null
          ? DateTime.parse(json['opening_Date'])
          : null,
      username: json['username'],
      password: json['password'],
      creditDays: json['credit_Days'],
      creditAmount: json['credit_Amount']?.toDouble(),
      paymentLimit: json['payment_Limit']?.toDouble(),
      createdBy: json['created_By'],
      createdDate: json['created_Date'] != null
          ? DateTime.parse(json['created_Date'])
          : null,
      modifiedBy: json['modified_By'],
      modifiedDate: json['modified_Date'] != null
          ? DateTime.parse(json['modified_Date'])
          : null,
      canCreate: json['can_Create'] ?? false, // Default to false
      canEdit: json['can_Edit'] ?? false, // Default to false
      canDelete: json['can_Delete'] ?? false, // Default to false
      canView: json['can_View'] ?? false, // Default to false
      userImage: json['user_Image'],
      userCodeString: json['userCode'],
      deliverymanId: json['deliveryman_id'],
    );
  }
}
