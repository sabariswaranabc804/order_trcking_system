class Customer {
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
  final String? mobileNumber;
  final String? alterMobileNumber;
  final String? phoneNumber;
  final String? address;
  final int? stateId;
  final int? cityId;
  final int? locationId;
  final String? pinCode;
  final String? emailId;
  final String? altEmailId;
  final String? accountNumber;
  final bool? activeFlag;
  final DateTime? dateBirth;
  final DateTime? dateJoining;
  final String? accountHolderName;
  final String? ifscCode;
  final String? bankName;
  final String? bankBranchName;
  final String? bankPhoneNumber;
  final DateTime? openingDate;
  final String? username;
  final String? password;
  final int? creditDays;
  final double? creditAmount;
  final double? paymentLimit;
  final int? createdBy;
  final DateTime? createdDate;
  final int? modifiedBy;
  final DateTime? modifiedDate;
  final bool? canCreate;
  final bool? canEdit;
  final bool? canDelete;
  final bool? canView;
  final String? userImage;
  final String? userCodeAlt;
  final int deliverymanId;

  Customer({
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
    this.mobileNumber,
    this.alterMobileNumber,
    this.phoneNumber,
    this.address,
    this.stateId,
    this.cityId,
    this.locationId,
    this.pinCode,
    this.emailId,
    this.altEmailId,
    this.accountNumber,
    this.activeFlag,
    this.dateBirth,
    this.dateJoining,
    this.accountHolderName,
    this.ifscCode,
    this.bankName,
    this.bankBranchName,
    this.bankPhoneNumber,
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
    this.userCodeAlt,
    required this.deliverymanId,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      userId: json['user_ID'],
      userCode: json['user_Code'],
      userName: json['user_Name'],
      userTypeId: json['user_Type_ID'],
      companyId: json['company_Id'],
      gstin: json['GSTIN'],
      panId: json['pan_ID'],
      aadharId: json['aadhar_ID'],
      fssaiNumber: json['fssai_Number'],
      allowDiscount: json['allow_Discount'],
      discountPercent: json['discount_Percent']?.toDouble(),
      paymentMode: json['pmt_Mode'],
      contactPerson: json['contact_Person'],
      mobileNumber: json['mobile_Number'],
      alterMobileNumber: json['alter_Mobile_number'],
      phoneNumber: json['phone_Number'],
      address: json['address'],
      stateId: json['state_Id'],
      cityId: json['city_Id'],
      locationId: json['location_Id'],
      pinCode: json['pin_Code'],
      emailId: json['email_ID'],
      altEmailId: json['alt_Email_ID'],
      accountNumber: json['acct_Number'],
      activeFlag: json['active_Flag'],
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
      bankPhoneNumber: json['bank_phone_No'],
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
      canCreate: json['can_Create'],
      canEdit: json['can_Edit'],
      canDelete: json['can_Delete'],
      canView: json['can_View'],
      userImage: json['user_Image'],
      userCodeAlt: json['userCode'],
      deliverymanId: json['deliveryman_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_ID': userId,
      'user_Code': userCode,
      'user_Name': userName,
      'user_Type_ID': userTypeId,
      'company_Id': companyId,
      'GSTIN': gstin,
      'pan_ID': panId,
      'aadhar_ID': aadharId,
      'fssai_Number': fssaiNumber,
      'allow_Discount': allowDiscount,
      'discount_Percent': discountPercent,
      'pmt_Mode': paymentMode,
      'contact_Person': contactPerson,
      'mobile_Number': mobileNumber,
      'alter_Mobile_number': alterMobileNumber,
      'phone_Number': phoneNumber,
      'address': address,
      'state_Id': stateId,
      'city_Id': cityId,
      'location_Id': locationId,
      'pin_Code': pinCode,
      'email_ID': emailId,
      'alt_Email_ID': altEmailId,
      'acct_Number': accountNumber,
      'active_Flag': activeFlag,
      'date_Birth': dateBirth?.toIso8601String(),
      'date_Joining': dateJoining?.toIso8601String(),
      'acct_Holder_Name': accountHolderName,
      'ifsc_Code': ifscCode,
      'bank_Name': bankName,
      'bank_Branch_Name': bankBranchName,
      'bank_phone_No': bankPhoneNumber,
      'opening_Date': openingDate?.toIso8601String(),
      'username': username,
      'password': password,
      'credit_Days': creditDays,
      'credit_Amount': creditAmount,
      'payment_Limit': paymentLimit,
      'created_By': createdBy,
      'created_Date': createdDate?.toIso8601String(),
      'modified_By': modifiedBy,
      'modified_Date': modifiedDate?.toIso8601String(),
      'can_Create': canCreate,
      'can_Edit': canEdit,
      'can_Delete': canDelete,
      'can_View': canView,
      'user_Image': userImage,
      'userCode': userCodeAlt,
      'deliveryman_id': deliverymanId,
    };
  }
}
