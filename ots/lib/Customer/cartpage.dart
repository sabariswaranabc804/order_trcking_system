import 'dart:async';
import 'dart:io';
import 'dart:ui';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:image_gallery_saver_plus/image_gallery_saver_plus.dart';
import 'package:lottie/lottie.dart';
import 'package:path_provider/path_provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:screenshot/screenshot.dart';
import 'package:share_plus/share_plus.dart';
import '../Admin/qrcode.dart';
import '../Model/addressgetmodel.dart';
import '../localstorage.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

import '../main.dart';
import 'Address_.dart';
import 'Homepage.dart';
import 'Signin.dart';
import 'cartdetails.dart';

Future<void> postCartData(Cart cart) async {
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

class CartItem {
  final String servSubTypeName;
  final String imagefile;
  final String serv_Name;
  final int quantity;
  final double rate;

  CartItem({
    required this.servSubTypeName,
    required this.quantity,
    required this.rate,
    required this.imagefile,
    required this.serv_Name,
  });

  Map<String, dynamic> toJson() {
    return {
      'servSubType_Name': servSubTypeName,
      'quantity': quantity,
      'rate': rate,
      'imagefile': imagefile,
      'serv_Name': serv_Name,
    };
  }
}

class Cart {
  final String userId;
  final String payment;

  final int addressId;
  final double totalPrice;
  final int totalquantity;
  String? userPhoneNumber;
  final List<CartItem> cartItems;

  Cart({
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

class CartPage extends StatefulWidget {
  final String userId;
  const CartPage({super.key, required this.userId});
  @override
  _CartPageState createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> with RouteAware {
  List<Map<String, dynamic>> cartItems = [];
  Timer? reloadTimer;
  String gpay = "9159079191";
  double totalPrice = 0.0;
  int totalQuantity = 0;
  Address? selectedAddress;
  DatabaseHelper dbHelper = DatabaseHelper();
  List<CartItem> cartItems1 = [];
  final ScreenshotController screenshotController = ScreenshotController();
  final ApiService apiService = ApiService();
  late Future<List<Address>> futureAddresses;
  final TextEditingController pinCodeController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    loadCartItems();
    _startAutoReload();
    futureAddresses = apiService.fetchAddresses(widget.userId);
  }

  @override
  void dispose() {
    _timer?.cancel();
    reloadTimer?.cancel(); // Cleanup when the page is disposed
    RouteObserver<PageRoute>()
        .unsubscribe(this); // Dispose of the controller when not needed
    super.dispose();
  }

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
        final result = await ImageGallerySaverPlus.saveImage(uint8List);
        print("Image saved to gallery: $result");

        // Share the image file using the share_plus package
        await Share.shareXFiles([XFile(filePath)],
            text: 'Here is my UPI QR code for payment!');
      });
    } catch (e) {
      print("Error capturing QR code: $e");
    }
  }

  String? _selectedOption;
  Timer? _timer;
  int count = 0;
  void _startAutoReload() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        loadCartItems();
        // openCustomSettings(context);
        //  futureAddresses = apiService.fetchAddresses(widget.userId);
      });
    });
  }

  Future<void> loadCartItems() async {
    final dbHelper = DatabaseHelper();
    List<Map<String, dynamic>> items = await dbHelper.getCartItems();

    setState(() {
      cartItems = items; // Raw items from the database

      // Convert the loaded items to CartItem instances
      cartItems1 = items.map((item) {
        return CartItem(
          servSubTypeName: item['servSubType_Name'],
          quantity: item['quantity'],
          rate: item['rate'],
          imagefile: item['imagefile'],
          serv_Name: item['serv_Name'],
        );
      }).toList();

      // Calculate total price and quantity
      totalPrice = cartItems1.fold(
          0.0, (sum, item) => sum + (item.rate * item.quantity));
      totalQuantity = cartItems1.fold(0, (sum, item) => sum + item.quantity);
    });
  }

  // Delete an item from the cart
  Future<void> deleteCartItem(int id) async {
    final dbHelper = DatabaseHelper();
    await dbHelper.deleteCartItem(id);
    loadCartItems();
  }

  Future<void> incrementQuantity(Map<String, dynamic> item) async {
    final dbHelper = DatabaseHelper();
    Map<String, dynamic> updatedItem = Map<String, dynamic>.from(item);

    setState(() {
      updatedItem['quantity'] += 1;
    });

    await dbHelper.updateCartItem(updatedItem);
    loadCartItems(); // Refresh cart after updating
  }

  Future<void> decrementQuantity(Map<String, dynamic> item) async {
    final dbHelper = DatabaseHelper();
    Map<String, dynamic> updatedItem = Map<String, dynamic>.from(item);

    if (updatedItem['quantity'] > 1) {
      setState(() {
        updatedItem['quantity'] -= 1;
      });
      await dbHelper.updateCartItem(updatedItem);
    } else {
      await deleteCartItem(updatedItem['id']);
    }
    loadCartItems(); // Refresh cart after updating
  }

  bool checkconnection(List<ConnectivityResult> result) {
    final hasInternet = result.any((r) => r != ConnectivityResult.none);
    if (hasInternet) {
      return true;
    } else {
      return false;
    }
  }

  bool qrpay = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Cart'),
        ),
        body: cartItems.isEmpty
            ? Center(child: Text('No items in the cart'))
            : Column(
                children: [
                  Expanded(
                    child: SingleChildScrollView(
                      child: Stack(
                        children: [
                          Column(
                            children: [
                              // List of items with their individual prices and quantities
                              ListView.builder(
                                shrinkWrap:
                                    true, // Make ListView take minimum space required
                                physics:
                                    NeverScrollableScrollPhysics(), // Disable inner scrolling
                                itemCount: cartItems.length,
                                itemBuilder: (context, index) {
                                  final item = cartItems[index];

                                  return Column(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Divider(),
                                      Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Container(
                                          width: double.infinity,
                                          child: Text(
                                            "Service : ${item['serv_Name']}",
                                            textAlign: TextAlign.start,
                                          ),
                                        ),
                                      ),
                                      ListTile(
                                        leading: Container(
                                          height: 60,
                                          child: item['imagefile'] != null
                                              ? Padding(
                                                  padding:
                                                      const EdgeInsets.all(8.0),
                                                  child: Image(
                                                    image: NetworkImage(
                                                      'http://$api/uploads/product-images/${item['imagefile']}',
                                                    ),
                                                  ),
                                                )
                                              : Padding(
                                                  padding:
                                                      const EdgeInsets.all(8.0),
                                                  child: Image(
                                                    image: AssetImage(
                                                        'assets/photo.png'),
                                                  ),
                                                ),
                                        ),
                                        title: Text(item['servSubType_Name'] ??
                                            'No Product'),
                                        subtitle: Text(
                                          'Quantity: ${item['quantity']}\nRate: ${item['rate']}',
                                        ),
                                        trailing: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            IconButton(
                                              icon: Icon(Icons.remove),
                                              onPressed: () {
                                                decrementQuantity(item);
                                              },
                                            ),
                                            Text(
                                              '${item['quantity']}',
                                              style: TextStyle(fontSize: 15),
                                            ),
                                            IconButton(
                                              icon: Icon(Icons.add),
                                              onPressed: () {
                                                incrementQuantity(item);
                                              },
                                            ),
                                            IconButton(
                                              icon: Icon(
                                                Icons.delete,
                                                color: Colors.red,
                                              ),
                                              onPressed: () async {
                                                await dbHelper
                                                    .deleteCartItem(item['id']);
                                                await loadCartItems(); // Ensure the deletion is awaited
                                                setState(() {
                                                  cartItems.remove(
                                                      item); // Remove from list after deletion
                                                });
                                              },
                                            ),
                                          ],
                                        ),
                                      ),
                                      Divider(),
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(left: 10.0),
                                        child: Text(
                                          'Item Total: Rs. ${(item['quantity'] * item['rate']).toStringAsFixed(2)}',
                                          style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ],
                                  );
                                },
                              ),
                              Divider(),
                              Padding(
                                padding: const EdgeInsets.all(4.0),
                                child: ListTile(
                                  leading: Text(
                                    'Total Price: Rs. ${totalPrice.toStringAsFixed(2)}',
                                    style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.blue),
                                  ),
                                  trailing: Text(
                                    'Total Item: ${cartItems.length}\nTotal Quantity: $totalQuantity',
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF1B5E20),
                                    ),
                                  ),
                                ),
                              ),
                              widget.userId == "" ? Container() : Divider(),
                              widget.userId == ""
                                  ? Container()
                                  : ListTile(
                                      title: Text("Select Address"),
                                      subtitle: selectedAddress != null
                                          ? Text(
                                              'Selected: ${selectedAddress!.area}, ${selectedAddress!.cityId}, ${selectedAddress!.stateId}')
                                          : Text('No address selected'),
                                      onTap: () {
                                        Timer? reloadTimer;

                                        showModalBottomSheet(
                                          context: context,
                                          builder: (context) {
                                            // Define a stateful widget to manage the timer and data
                                            return StatefulBuilder(
                                                builder: (context, setState) {
                                              // Initialize the future and timer when the bottom sheet is created
                                              Future<List<Address>>
                                                  futureAddresses =
                                                  apiService.fetchAddresses(
                                                      widget.userId);

                                              reloadTimer = Timer.periodic(
                                                  Duration(seconds: 5),
                                                  (timer) {
                                                setState(() {
                                                  futureAddresses =
                                                      apiService.fetchAddresses(
                                                          widget.userId);
                                                });
                                              });

                                              return WillPopScope(
                                                // Cleanup: Stop the timer when the bottom sheet is dismissed
                                                onWillPop: () async {
                                                  reloadTimer?.cancel();
                                                  return true;
                                                },
                                                child: Hero(
                                                  tag: 0,
                                                  child: Container(
                                                    width: double.infinity,
                                                    decoration:
                                                        const BoxDecoration(
                                                      gradient: LinearGradient(
                                                        colors: [
                                                          Color.fromARGB(115,
                                                              231, 231, 231),
                                                          Color.fromARGB(77,
                                                              131, 131, 131),
                                                        ],
                                                        begin: Alignment.center,
                                                        end: Alignment
                                                            .bottomRight,
                                                      ),
                                                      borderRadius:
                                                          BorderRadius.only(
                                                        topLeft:
                                                            Radius.circular(30),
                                                        topRight:
                                                            Radius.circular(30),
                                                      ),
                                                    ),
                                                    child: Padding(
                                                      padding:
                                                          EdgeInsets.all(20),
                                                      child: Column(
                                                        mainAxisSize:
                                                            MainAxisSize.max,
                                                        children: [
                                                          Text(
                                                            'Select Address',
                                                            style: TextStyle(
                                                                fontWeight:
                                                                    FontWeight
                                                                        .bold,
                                                                fontSize: 15),
                                                          ),
                                                          SizedBox(height: 20),
                                                          Container(
                                                            height: MediaQuery.of(
                                                                        context)
                                                                    .size
                                                                    .height /
                                                                2.8,
                                                            child: FutureBuilder<
                                                                List<Address>>(
                                                              future:
                                                                  futureAddresses, // Future is refreshed
                                                              builder: (context,
                                                                  snapshot) {
                                                                if (snapshot
                                                                    .hasError) {
                                                                  // Log the error and show a message or dialog
                                                                  print(
                                                                      "Error: No addresses found.");
                                                                  return Center(
                                                                      child: Text(
                                                                          "No addresses found"));
                                                                } else if (snapshot
                                                                        .hasData &&
                                                                    snapshot
                                                                        .data!
                                                                        .isEmpty) {
                                                                  // No addresses found
                                                                  return Center(
                                                                      child: Text(
                                                                          "No addresses found"));
                                                                } else if (snapshot
                                                                    .hasData) {
                                                                  final addresses =
                                                                      snapshot
                                                                          .data!;
                                                                  return ListView
                                                                      .builder(
                                                                    shrinkWrap:
                                                                        true,
                                                                    itemCount:
                                                                        addresses
                                                                            .length,
                                                                    itemBuilder:
                                                                        (context,
                                                                            index) {
                                                                      final address =
                                                                          addresses[
                                                                              index];
                                                                      return Card(
                                                                        margin:
                                                                            EdgeInsets.all(8.0),
                                                                        child:
                                                                            ListTile(
                                                                          onTap:
                                                                              () {
                                                                            setState(() {
                                                                              selectedAddress = address;
                                                                            });
                                                                            Navigator.of(context).pop();
                                                                          },
                                                                          title:
                                                                              Text('${address.area}, ${address.cityId}, ${address.stateId}'),
                                                                          subtitle:
                                                                              Column(
                                                                            crossAxisAlignment:
                                                                                CrossAxisAlignment.start,
                                                                            children: [
                                                                              Text('Street: ${address.street}'),
                                                                              Text('Floor/Door No: ${address.floorDoorNo}'),
                                                                              Text('Landmark: ${address.landmark}'),
                                                                              Text('Pin Code: ${address.pinCode}'),
                                                                              Text('Address Type: ${address.addressType}'),
                                                                            ],
                                                                          ),
                                                                        ),
                                                                      );
                                                                    },
                                                                  );
                                                                } else {
                                                                  // Handle any other unexpected state
                                                                  return Center(
                                                                      child:
                                                                          CircularProgressIndicator());
                                                                }
                                                              },
                                                            ),
                                                          ),
                                                          SizedBox(height: 20),
                                                          ElevatedButton(
                                                            onPressed: () {
                                                              showPinCodeDialog();
                                                            },
                                                            style:
                                                                ElevatedButton
                                                                    .styleFrom(
                                                              backgroundColor:
                                                                  Color(
                                                                      0xff004aad),
                                                              minimumSize: Size(
                                                                  double
                                                                      .infinity,
                                                                  50),
                                                              shape:
                                                                  RoundedRectangleBorder(
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            20),
                                                              ),
                                                            ),
                                                            child: Text(
                                                              'Add New Address',
                                                              style: TextStyle(
                                                                  color: Colors
                                                                      .white,
                                                                  fontSize: 16),
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              );
                                            });
                                          },
                                        ).whenComplete(() {
                                          // Ensure the timer is canceled when the bottom sheet is closed
                                          reloadTimer?.cancel();
                                        });
                                      },
                                    ),
                              Divider(),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  // First radio button with a label
                                  Radio<String>(
                                    value: "online",
                                    groupValue: _selectedOption,
                                    onChanged: (String? value) {
                                      setState(() {
                                        _selectedOption = value;
                                        qrpay = true;
                                        //  add.addressType = _selectedOption!;
                                      });
                                    },
                                  ),
                                  Text('Online'),

                                  SizedBox(
                                      width:
                                          20), // Space between the radio buttons

                                  // Second radio button with a label
                                  Radio<String>(
                                    value: "offline",
                                    groupValue: _selectedOption,
                                    onChanged: (String? value) {
                                      setState(() {
                                        qrpay = false;
                                        _selectedOption = value;
                                        //   add.addressType = _selectedOption!;
                                      });
                                    },
                                  ),
                                  Text('Cash On Delivery'),
                                ],
                              ),
                              widget.userId == ""
                                  ? Container()
                                  : qrpay == true
                                      ? Center(
                                          child: Column(
                                            children: [
                                              Center(
                                                child: RepaintBoundary(
                                                  key:
                                                      repaintKey, // Attach the GlobalKey here
                                                  child: Column(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      QrImageView(
                                                        data: Uri.encodeFull(
                                                          'upi://pay?pa=9159079191@okbizaxis&pn=Kirush Laundry&am=${totalPrice}&cu=INR&tn=${widget.userId}',
                                                        ),
                                                        version:
                                                            QrVersions.auto,
                                                        size: 200.0,
                                                        backgroundColor:
                                                            Colors.white,
                                                      ),
                                                      SizedBox(height: 20),
                                                      ElevatedButton(
                                                        onPressed:
                                                            _captureAndShareQrCode,
                                                        child: Text(
                                                            "Share QR Code"),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                              Text("Scan QR"),
                                              Text(
                                                "Or",
                                                style: TextStyle(
                                                    fontSize: 15,
                                                    fontWeight:
                                                        FontWeight.w600),
                                              ),
                                              Text("Pay to mobile number"),
                                              Center(
                                                child: Row(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.center,
                                                  children: [
                                                    Text(gpay),
                                                    IconButton(
                                                        onPressed: () {
                                                          // Text to be copied
                                                          String textToCopy =
                                                              gpay;

                                                          // Copy text to clipboard
                                                          Clipboard.setData(
                                                                  ClipboardData(
                                                                      text:
                                                                          textToCopy))
                                                              .then((_) {
                                                            // Show a snackbar to indicate the text has been copied
                                                            ScaffoldMessenger
                                                                    .of(context)
                                                                .showSnackBar(
                                                              SnackBar(
                                                                content: Text(
                                                                    'Copied to clipboard!'),
                                                              ),
                                                            );
                                                          });
                                                        },
                                                        icon: Icon(Icons.copy)),
                                                    IconButton(
                                                        onPressed: () {
                                                          String textToShare =
                                                              gpay;

                                                          // Share the text
                                                          Share.share(
                                                              textToShare);
                                                        },
                                                        icon: Icon(Icons.share))
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                        )
                                      : Container(),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orangeAccent,
                        minimumSize: Size(double.infinity, 50),
                      ),
                      onPressed: () async {
                        if (widget.userId == "") {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: Text("Signin"),
                                content: Text(
                                    'Please login to continue the process'),
                                actions: <Widget>[
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                    },
                                    child: Text("Cancel"),
                                  ),
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pushReplacement(
                                          context,
                                          MaterialPageRoute(
                                              builder: (context) =>
                                                  signIn())); // Close the dialog
                                    },
                                    child: Text("OK"),
                                  ),
                                ],
                              );
                            },
                          );
                        } else {
                          final result =
                              await Connectivity().checkConnectivity();
                          if (checkconnection(result)) {
                            if (selectedAddress != null) {
                              if (_selectedOption != null) {
                                Cart cartRequest = Cart(
                                  userId: widget.userId,
                                  addressId: selectedAddress!.addressId,
                                  totalPrice: totalPrice,
                                  totalquantity: totalQuantity,
                                  cartItems: cartItems1,
                                  payment: _selectedOption.toString(),
                                );
                                await postCartData(cartRequest);
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
                                              height: MediaQuery.of(context)
                                                      .size
                                                      .height /
                                                  6,
                                              width: MediaQuery.of(context)
                                                      .size
                                                      .height /
                                                  20,
                                              child: Lottie.asset(
                                                  "assets/orderaccept.json"),
                                            ),
                                            Text(
                                              "Order Placed",
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                  color: Colors.black,
                                                  fontSize: 20),
                                            ),
                                            Padding(
                                              padding:
                                                  const EdgeInsets.all(24.0),
                                              child: ElevatedButton(
                                                onPressed: () async {
                                                  await dbHelper.clearCart();
                                                  setState(() {});
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
                                ScaffoldMessenger.of(context)
                                    .showSnackBar(SnackBar(
                                  content: Text("Select payment mode"),
                                  duration: Duration(seconds: 1),
                                ));
                              }
                            } else {
                              ScaffoldMessenger.of(context)
                                  .showSnackBar(SnackBar(
                                content: Text("Please select an address."),
                                duration: Duration(seconds: 1),
                              ));
                            }
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text("Check Internet connection"),
                              backgroundColor: Colors.red,
                            ));
                          }
                        }
                      },
                      child: Text("Place Order"),
                    ),
                  )
                ],
              ));
  }

  void submitPinCode(String pinCode) {
    Navigator.of(context).pop(); // Close the dialog
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Pin code submitted: $pinCode'),
        duration: Duration(seconds: 2),
      ),
    );

    // Navigate to the next screen with the pin code
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => addressget(
          pincode: pinCode,
          userID: widget.userId,
        ), // Ensure the destination screen is defined
      ),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final route = ModalRoute.of(context);
    if (route is PageRoute<dynamic>) {
      RouteObserver<PageRoute<dynamic>>().subscribe(this, route);
    }
  }

  @override
  void didPushNext() {
    // Called when navigating to a new screen
    reloadTimer?.cancel();
    super.didPushNext();
  }

  void showPinCodeDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Enter Pin Code'),
          content: Form(
            key: _formKey, // Assign the form key for validation
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: pinCodeController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Enter Pin Code',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    // Validation logic for pin code
                    if (value == null || value.isEmpty) {
                      return 'Please enter a pin code';
                    } else if (value.length != 6) {
                      return 'Pin code must be 6 digits long';
                    } else if (!RegExp(r'^[0-9]+$').hasMatch(value)) {
                      return 'Only numeric values are allowed';
                    }
                    return null; // No error if validation passes
                  },
                ),
              ],
            ),
          ),
          actions: <Widget>[
            ElevatedButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  String pinCode = pinCodeController.text;
                  submitPinCode(pinCode); // Pass the pin code directly
                }
              },
              child: Text('Submit Pin Code'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text('Cancel'),
            ),
          ],
        );
      },
    );
  }
}
