import 'dart:io';
import 'dart:typed_data';
import 'dart:ui';

import 'package:connectivity/connectivity.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:image_gallery_saver/image_gallery_saver.dart';
import 'package:lottie/lottie.dart';
import 'package:path_provider/path_provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'dart:convert';

import '../Customer/cartpage.dart';
import '../main.dart';

class Cart1 {
  final String userId;
  final String payment;

  final int addressId;
  final double totalPrice;
  final int totalquantity;
  String? userPhoneNumber;
  final List<CartItem2> cartItems;

  Cart1({
    required this.userId,
    required this.payment,
    required this.addressId,
    required this.totalPrice,
    required this.totalquantity,
    required this.cartItems,
    this.userPhoneNumber,
  });

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'addressId': addressId,
      'totalPrice': totalPrice,
      'totalquantity': totalquantity,
      'payment': payment,
      'userPhoneNumber': userPhoneNumber,
      'cartItems': cartItems.map((item) => item.toJson()).toList(),
    };
  }
}

class CartItem2 {
  final String servSubTypeName;
  final String imagefile;
  final String serv_Name;
  final int quantity;
  final double rate;
  int? id;

  CartItem2({
    required this.servSubTypeName,
    required this.quantity,
    required this.rate,
    required this.imagefile,
    required this.serv_Name,
    required this.id,
  });

  Map<String, dynamic> toJson() {
    return {
      'servSubType_Name': servSubTypeName,
      'quantity': quantity,
      'rate': rate,
      'imagefile': imagefile,
      'serv_Name': serv_Name,
      'servSubType_Id': id,
    };
  }
}

class LaundryOrderScreen extends StatefulWidget {
  final int company_Id;
  const LaundryOrderScreen({Key? key, required this.company_Id})
      : super(key: key);
  @override
  _LaundryOrderScreenState createState() => _LaundryOrderScreenState();
}

class _LaundryOrderScreenState extends State<LaundryOrderScreen> {
  TextEditingController _controller = TextEditingController();
  String? _selectedService;
  String _paymentStatus = 'Paid';
  int totalPrice = 235;
  List<String> customerNames = [];
  List<dynamic> serviceTypes = [];
  bool isLoading = true;

  List<dynamic> serviceSubTypes = [];
  List<dynamic> filteredSubTypes = [];

  @override
  void initState() {
    super.initState();
    fetchServiceTypes();
    fetchCustomers();
  }

  List<Map<String, dynamic>> customers = []; // Store customer data
  String? selectedCustomerName;
  String? selectedCustomerId;
  String? selectedCustomerMobile;

  Future<void> fetchCustomers() async {
    try {
      final url = Uri.parse('http://$api/api/customer');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);

        if (jsonData is Map &&
            jsonData.containsKey('data') &&
            jsonData['data'] is List) {
          setState(() {
            customers = List<Map<String, dynamic>>.from(jsonData['data']);
          });
          print("Customers loaded successfully: $customers");
        } else {
          print("Unexpected JSON format");
        }
      } else {
        print('Failed to load customers: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching customers: $e');
    }
  }

  /// Fetch service types from API (company services)
  Future<void> fetchServiceTypes() async {
    try {
      final response = await http
          .get(Uri.parse('http://$api/api/company/${widget.company_Id}'));

      if (response.statusCode == 200) {
        setState(() {
          serviceTypes = jsonDecode(response.body);
        });
      } else {
        print('Failed to load service types');
      }
    } catch (e) {
      print('Error fetching service types: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  /// Fetch service subtypes from API
  Future<void> fetchServiceSubTypes(int selectedServiceId) async {
    try {
      final response = await http.get(
          Uri.parse('http://$api/api/serviceSubTypes/${widget.company_Id}'));

      if (response.statusCode == 200) {
        setState(() {
          serviceSubTypes = jsonDecode(response.body);
          filterServiceSubTypes();
        });
      } else {
        print('Failed to load service subtypes');
      }
    } catch (e) {
      print('Error fetching service subtypes: $e');
    }
  }

  /// Filter service subtypes based on selected service name
  void filterServiceSubTypes() {
    setState(() {
      filteredSubTypes = serviceSubTypes
          .where((subtype) =>
              subtype['serv_Name'].toString().toUpperCase() == _selectedService)
          .toList();
    });
  }

  String gpay = "9159079191";
  List<Map<String, dynamic>> selectedItems = [];
  GlobalKey repaintKey = GlobalKey();
  Future<void> _captureAndShareQrCode() async {
    try {
      // Wait until the frame is painted
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        // Get the render object of the RepaintBoundary
        RenderRepaintBoundary boundary = repaintKey.currentContext!
            .findRenderObject() as RenderRepaintBoundary;

        // Capture the image from the RepaintBoundary widget
        var image = await boundary.toImage(
            pixelRatio: 3.0); // Increase pixel ratio for better quality
        ByteData? byteData =
            await image.toByteData(format: ImageByteFormat.png);
        Uint8List uint8List = byteData!.buffer.asUint8List();

        // Save the captured image as a file in the temporary directory
        final directory = await getTemporaryDirectory();
        final filePath = '${directory.path}/qr_code.png';
        final file = File(filePath);

        // Write the Uint8List (image) to the file
        await file.writeAsBytes(uint8List);

        // Optionally, save the image to the gallery (if needed)
        final result = await ImageGallerySaver.saveImage(uint8List);
        print("Image saved to gallery: $result");

        // Share the image file using the share_plus package
        await Share.shareFiles([filePath],
            text: 'Here is my UPI QR code for payment!');
      });
    } catch (e) {
      print("Error capturing QR code: $e");
    }
  }

  bool qrpay = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Laundry Care')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Autocomplete<String>(
                optionsBuilder: (TextEditingValue textEditingValue) {
                  if (textEditingValue.text.isEmpty) {
                    return customers
                        .map((item) => item['user_Name'].toString());
                  }
                  return customers
                      .where((item) => item['user_Name']
                          .toString()
                          .toLowerCase()
                          .contains(textEditingValue.text.toLowerCase()))
                      .map((item) => item['user_Name'].toString());
                },
                onSelected: (String selection) {
                  setState(() {
                    selectedCustomerName = selection;
                    final selectedCustomer = customers.firstWhere(
                        (customer) => customer['user_Name'] == selection,
                        orElse: () => {});
                    selectedCustomerId =
                        selectedCustomer['user_Code']?.toString();
                    selectedCustomerMobile =
                        selectedCustomer['mobile_Number']?.toString();
                  });

                  print("Selected Customer ID: $selectedCustomerId");
                  print("Selected Customer Mobile: $selectedCustomerMobile");
                },
                fieldViewBuilder: (context, textEditingController, focusNode,
                    onFieldSubmitted) {
                  _controller = textEditingController; // Assign controller
                  return TextField(
                    controller: _controller,
                    focusNode: focusNode,
                    decoration: InputDecoration(
                      labelText: 'Search Customer',
                      border: OutlineInputBorder(),
                    ),
                  );
                },
              ),

              SizedBox(height: 15),
              isLoading
                  ? CircularProgressIndicator()
                  : DropdownButtonFormField<String>(
                      value: _selectedService,
                      items:
                          serviceTypes.map<DropdownMenuItem<String>>((service) {
                        return DropdownMenuItem<String>(
                          value: service['serv_Name'],
                          child: Text(service['serv_Name'] ?? 'Unnamed'),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedService = value;
                        });

                        // Find the corresponding service ID and fetch subtypes
                        int? selectedServiceId = serviceTypes.firstWhere(
                            (service) => service['serv_Name'] == value,
                            orElse: () => {})?['serv_Id'];

                        if (selectedServiceId != null) {
                          fetchServiceSubTypes(selectedServiceId);
                        }
                      },
                      decoration: InputDecoration(
                        labelText: 'Service Type',
                        border: OutlineInputBorder(),
                      ),
                    ),
              SizedBox(height: 20),

              // Filtered service subtypes
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text('Selected Items',
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),

              isLoading
                  ? CircularProgressIndicator()
                  : Wrap(
                      spacing: 8.0,
                      children: filteredSubTypes.isEmpty
                          ? [Text("No matching subtypes found")]
                          : filteredSubTypes.map((subtype) {
                              return ElevatedButton(
                                onPressed: () => addItem(
                                  subtype["servSubType_Name"],
                                  subtype["rate"],
                                  subtype["serv_Name"],
                                  subtype["servSubType_Id"],
                                ),
                                child: Text(
                                    '${subtype['servSubType_Name']} - ₹${subtype['rate']}'),
                              );
                            }).toList(),
                    ),
              SizedBox(height: 20),
              if (orderItems.isNotEmpty)
                Text("Order Summary",
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              //     Text("Total Price: ₹$totalPrice", style: TextStyle(fontSize: 16)),
              SizedBox(height: 10),
              if (orderItems.isNotEmpty) buildOrderSummaryTable(),

              SizedBox(height: 20),
              if (orderItems.isNotEmpty)
                Text('Total Price: ₹$totalPrice',
                    style: TextStyle(fontSize: 16)),
              SizedBox(height: 10),
              if (orderItems.isNotEmpty)
                Text('Payment Status',
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              if (orderItems.isNotEmpty)
                Row(
                  children: [
                    Radio(
                      value: 'Paid',
                      groupValue: _paymentStatus,
                      onChanged: (value) {
                        setState(() {
                          _paymentStatus = value.toString();
                        });
                      },
                    ),
                    Text('Paid'),
                    Radio(
                      value: 'Pending',
                      groupValue: _paymentStatus,
                      onChanged: (value) {
                        setState(() {
                          _paymentStatus = value.toString();
                        });
                      },
                    ),
                    Text('Pending'),
                  ],
                ),
              SizedBox(height: 20),
              qrpay == true
                  ? Column(
                      children: [
                        RepaintBoundary(
                          key: repaintKey, // Attach the GlobalKey here
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              QrImageView(
                                data: Uri.encodeFull(
                                  'upi://pay?pa=9159079191@okbizaxis&pn=Kirush Laundry&am=${totalPrice}&cu=INR&tn=${selectedCustomerId}',
                                ),
                                version: QrVersions.auto,
                                size: 200.0,
                                backgroundColor: Colors.white,
                              ),
                              SizedBox(height: 20),
                              ElevatedButton(
                                onPressed: _captureAndShareQrCode,
                                child: Text("Share QR Code"),
                              ),
                            ],
                          ),
                        ),
                        Text("Scan QR"),
                        Text(
                          "Or",
                          style: TextStyle(
                              fontSize: 15, fontWeight: FontWeight.w600),
                        ),
                        Text("Pay to mobile number"),
                        Center(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(gpay),
                              IconButton(
                                  onPressed: () {
                                    // Text to be copied
                                    String textToCopy = gpay;

                                    // Copy text to clipboard
                                    Clipboard.setData(
                                            ClipboardData(text: textToCopy))
                                        .then((_) {
                                      // Show a snackbar to indicate the text has been copied
                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(
                                        SnackBar(
                                          content: Text('Copied to clipboard!'),
                                        ),
                                      );
                                    });
                                  },
                                  icon: Icon(Icons.copy)),
                              IconButton(
                                  onPressed: () {
                                    String textToShare = gpay;

                                    // Share the text
                                    Share.share(textToShare);
                                  },
                                  icon: Icon(Icons.share))
                            ],
                          ),
                        ),
                      ],
                    )
                  : Container(),
              if (orderItems.isNotEmpty)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.purple),
                      onPressed: () {
                        setState(() {
                          qrpay = true;
                        });
                      },
                      child: Text('GENERATE QR CODE',
                          style: TextStyle(color: Colors.white)),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue),
                      onPressed: () async {
                        final result = await Connectivity().checkConnectivity();
                        if (checkconnection(result)) {
                          Cart1 cartRequest = Cart1(
                            userId: selectedCustomerId.toString(),
                            userPhoneNumber: selectedCustomerMobile,
                            addressId: 1,
                            totalPrice: totalPrice.toDouble(),
                            totalquantity: 3,
                            cartItems: orderItems
                                .map((item) => CartItem2(
                                      id: item["servSubType_Id"],
                                      servSubTypeName: item["item"] ?? "",
                                      quantity: item["qty"] ?? 0,
                                      rate: (item["rate"] ?? 0).toDouble(),
                                      imagefile: item["imagefile"] ?? "",
                                      serv_Name: item["serv_Name"] ?? "",
                                    ))
                                .toList(),
                            payment: _paymentStatus.toString(),
                          );

                          // **Print all items in the cart**
                          for (var item in cartRequest.cartItems) {
                            print(
                                "Item: ${item.serv_Name}, Quantity: ${item.quantity}, Rate: ${item.rate}, SubType: ${item.servSubTypeName}id:${item.id}");
                          }

                          await postCartData1(cartRequest);

                          showDialog(
                            context: context,
                            barrierDismissible: false,
                            builder: (context) {
                              return WillPopScope(
                                onWillPop: () async => false,
                                child: StatefulBuilder(
                                    builder: (context, setState) {
                                  return SimpleDialog(
                                    children: [
                                      Container(
                                        height:
                                            MediaQuery.of(context).size.height /
                                                6,
                                        width:
                                            MediaQuery.of(context).size.height /
                                                20,
                                        child: Lottie.asset(
                                            "assets/orderaccept.json"),
                                      ),
                                      Text(
                                        "Order Placed",
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                            color: Colors.black, fontSize: 20),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(24.0),
                                        child: ElevatedButton(
                                          onPressed: () async {
                                            // await dbHelper.clearCart();
                                            // setState(() {});
                                            Navigator.pop(context);
                                            Navigator.pop(context);
                                          },
                                          child: Text('OK'),
                                        ),
                                      )
                                    ],
                                  );
                                }),
                              );
                            },
                          );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                            content: Text("Check Internet connection"),
                            backgroundColor: Colors.red,
                          ));
                        }
                      },
                      child: Text('SUBMIT ORDER',
                          style: TextStyle(color: Colors.white)),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }

  bool checkconnection(ConnectivityResult result) {
    final hasInternet = result != ConnectivityResult.none;
    if (hasInternet) {
      return true;
    } else {
      return false;
    }
  }

  Widget buildOrderSummaryTable() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: DataTable(
        columnSpacing: 10,
        columns: [
          DataColumn(label: Center(child: Text("Item"))),
          DataColumn(label: Center(child: Text("Qty"))),
          DataColumn(label: Center(child: Text("Rate"))),
          DataColumn(label: Center(child: Text("Total Price"))),
          DataColumn(label: Center(child: Text("Actions"))),
        ],
        rows: orderItems.asMap().entries.map((entry) {
          int index = entry.key;
          var item = entry.value;
          int totalPrice = item['qty'] * item['rate'];

          return DataRow(cells: [
            DataCell(Center(child: Text(item['item']))),
            DataCell(Center(
              child: Row(
                children: [
                  IconButton(
                    icon: Icon(Icons.remove, color: Colors.red),
                    onPressed: () => updateQuantity(index, -1),
                  ),
                  Text(item['qty'].toString(), style: TextStyle(fontSize: 16)),
                  IconButton(
                    icon: Icon(Icons.add, color: Colors.green),
                    onPressed: () => updateQuantity(index, 1),
                  ),
                ],
              ),
            )),
            DataCell(Center(child: Text("₹${item['rate']}"))),
            DataCell(Center(child: Text("₹$totalPrice"))),
            DataCell(
              Center(
                child: IconButton(
                  icon: Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    setState(() {
                      orderItems.removeAt(index);
                      updateTotalPrice();
                    });
                  },
                ),
              ),
            ),
          ]);
        }).toList(),
      ),
    );
  }

  void addItem(String itemName, int rate, String servname, int id) {
    setState(() {
      var existingItem = orderItems.firstWhere(
        (item) => item['item'] == itemName,
        orElse: () => {},
      );

      if (existingItem.isNotEmpty) {
        existingItem['qty'] += 1;
      } else {
        orderItems.add({
          "item": itemName,
          "qty": 1,
          "rate": rate,
          "serv_Name": servname,
          "servSubType_Id": id
        });
      }
      updateTotalPrice();
    });
  }

  void updateQuantity(int index, int change) {
    setState(() {
      int newQty = orderItems[index]['qty'] + change;
      if (newQty > 0) {
        orderItems[index]['qty'] = newQty;
      } else {
        orderItems.removeAt(index);
      }
      updateTotalPrice();
    });
  }

  void updateTotalPrice() {
    totalPrice = orderItems.fold(
        0, (sum, item) => sum + (item['qty'] * item['rate']) as int);
  }

  List<Map<String, dynamic>> orderItems = [];
}

Future<void> postCartData1(Cart1 cart) async {
  final url = 'http://$api/api/orders'; // Replace with your API URL

  try {
    final response = await http.post(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.encode(cart.toJson()),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      // Handle success
      print('Data posted successfully${response.body}');
    } else {
      // Handle error
      print('Failed to post data: ${response.body}');
    }
  } catch (e) {
    print('Error occurred: $e');
  }
}
