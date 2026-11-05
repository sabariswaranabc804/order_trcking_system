import 'dart:async';
import 'dart:collection';
import 'dart:convert';
import 'package:badges/badges.dart' as badges;
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart' as geo;
import 'package:intl/intl.dart';
import 'package:lottie/lottie.dart';
import 'package:map_launcher/map_launcher.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import '../API/api.dart';
import '../Admin/order/Deliverd.dart';
import '../Admin/order/Pendingorders.dart';
import '../Admin/pickup_delivery/delivery.dart';
import '../Customer/Signin.dart';
import '../Model/acceptorderrequest.dart';
import '../Model/adm_assignedorder_toancgorpage.dart';
import '../Model/adm_orderdetails.dart';
import '../Model/admgetallordermodel.dart';
import '../Model/anchor_assignedorders.dart';
import '../Model/anchorprofile.dart';
import 'assigned_orders.dart';
import 'delivery_orders_detail.dart';
import 'dart:math' as math show pi;
import 'package:http/http.dart' as http;
import 'package:collapsible_sidebar/collapsible_sidebar.dart';

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

import 'myorders.dart';
import 'package:flutter/material.dart';

class DashboardScreen extends StatefulWidget {
  final int deliverymanid;
  final String userid;

  const DashboardScreen(
      {super.key, required this.deliverymanid, required this.userid});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final getorderdetailsfunc apiService = getorderdetailsfunc();
  final Admorderdetailsfunc apiService2 = Admorderdetailsfunc();
  final AnchorProfileAPIService apiService3 = AnchorProfileAPIService();

  Future<AnchorProfileModel?> fetchUserProfile() async {
    return await apiService3.fetchAnchorProfile(widget.userid);
  }

  late Future<List<anchorassigned_orders_model>> _ordersFuture;
  int myorder = 0;
  int assignedoorder = 0;
  int pending = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _ordersFuture = anchorassignedorderslist()
        .anchorassignedorderslistfunc(widget.deliverymanid);
    _startAutoReload();
  }

  @override
  void dispose() {
    _timer?.cancel(); // Cancel the timer when disposing the widget
    super.dispose();
  }

  void _startAutoReload() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        _ordersFuture = anchorassignedorderslist().anchorassignedorderslistfunc(
            widget.deliverymanid); // Re-fetch orders on timer
      });
    });
  }

  String selectedPayment = 'offline'; // Default to 'offline' (COD)
  bool isLoading = false;

  // Function to handle payment status change
  void handlePaymentChange(String? value) {
    setState(() {
      selectedPayment = value!;
    });
  }

  final assignedorder_anchor apiService4 = assignedorder_anchor();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          leading: Builder(builder: (context) {
            return InkWell(
              onTap: () {
                Scaffold.of(context).openDrawer();
              },
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: Container(
                  height: 40,
                  child: CircleAvatar(
                    backgroundImage: AssetImage('assets/anchorimg.jpg'),
                    backgroundColor: Colors.transparent,
                  ),
                ),
              ),
            );
          }),
          backgroundColor: Colors.transparent,
          title: FutureBuilder<AnchorProfileModel?>(
            future: fetchUserProfile(),
            builder: (context, snapshot) {
              if (snapshot.hasError ||
                  !snapshot.hasData ||
                  snapshot.data == null) {
                return Scaffold(
                  body: Center(child: Text('Error loading profile')),
                );
              }

              // Data is successfully loaded
              AnchorProfileModel? user = snapshot.data;
              return Text(
                "Hi, ${user?.userName}",
                style: TextStyle(
                  fontSize: 21,
                  color: Colors.black,
                  fontWeight: FontWeight.w700,
                ),
              );
            },
          ),
          actions: [
            Padding(
              padding: EdgeInsets.all(8.0),
              child: Container(
                alignment: Alignment.topRight,
                child: PopupMenuButton(
                  child: Image(
                      image: AssetImage(
                          "assets/OTSLOGO.png") // Optional: transparent background if image has rounded edges
                      ),
                  onSelected: (value) {
                    // your logic
                  },
                  itemBuilder: (BuildContext bc) {
                    return [
                      PopupMenuItem(
                        onTap: () {
                          showDialog<void>(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                                title: const Text('Logout'),
                                content:
                                    const Text('Do you really want to logout?'),
                                actions: <Widget>[
                                  TextButton(
                                    style: TextButton.styleFrom(
                                      textStyle: Theme.of(context)
                                          .textTheme
                                          .labelLarge,
                                    ),
                                    child: const Text(
                                      'No',
                                      style: TextStyle(color: Colors.black),
                                    ),
                                    onPressed: () {
                                      Navigator.of(context).pop();
                                    },
                                  ),
                                  TextButton(
                                    style: TextButton.styleFrom(
                                      textStyle: Theme.of(context)
                                          .textTheme
                                          .labelLarge,
                                    ),
                                    child: const Text(
                                      'Sure',
                                      style: TextStyle(color: Colors.green),
                                    ),
                                    onPressed: () async {
                                      SharedPreferences prefs =
                                          await SharedPreferences.getInstance();
                                      await prefs.remove('user_type');
                                      await prefs.remove('userID');
                                      await prefs.remove('company_Id');
                                      Navigator.of(context).pushAndRemoveUntil(
                                          MaterialPageRoute(builder: (context) {
                                        return signIn();
                                      }), (route) => false);
                                    },
                                  ),
                                ],
                              );
                            },
                          );
                        },
                        child: InkWell(child: Text("Logout")),
                        value: '/about',
                      ),
                    ];
                  },
                ),
              ),
            )
          ],
        ),
        drawer: Drawer(
          child: FutureBuilder<AnchorProfileModel?>(
            future: fetchUserProfile(),
            builder: (context, snapshot) {
              if (snapshot.hasError ||
                  !snapshot.hasData ||
                  snapshot.data == null) {
                return Scaffold(
                  body: Center(child: CircularProgressIndicator()),
                );
              }

              // Data is successfully loaded
              AnchorProfileModel? user = snapshot.data;
              return ListView(
                padding: EdgeInsets.zero,
                children: <Widget>[
                  Column(
                    children: [
                      DrawerHeader(
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Container(
                            width: 150, // Set width and height to control size
                            height: 150,
                            decoration: BoxDecoration(
                              color: Colors.red, // Background color
                              shape: BoxShape.circle, // Circular shape
                              image: DecorationImage(
                                image: AssetImage('assets/anchorimg.jpg'),
                                fit: BoxFit
                                    .fitHeight, // Ensures the image covers the entire space without stretching
                              ),
                            ),
                          ),
                        ),
                      ),
                      Text('User ID: ${user?.userId}'),
                      Text(
                        ' ${user?.userName}',
                        style: TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 15),
                      ),
                    ],
                  ),
                  ListTile(
                    leading: Icon(Icons.home),
                    title: Text('Home'),
                    onTap: () {
                      // Update the state of the app
                      Navigator.pop(context); // Close the drawer
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.phone),
                    title: Text('${user?.mobileNumber}'),
                    onTap: () {
                      // Update the state of the app
                      Navigator.pop(context); // Close the drawer
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.email_outlined),
                    title: Text('${user?.emailId}'),
                    onTap: () {
                      // Update the state of the app
                      Navigator.pop(context); // Close the drawer
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.logout),
                    title: Text('Logout'),
                    onTap: () {
                      showDialog<void>(
                        context: context,
                        builder: (BuildContext context) {
                          return AlertDialog(
                            title: const Text('Logout'),
                            content:
                                const Text('Do you Really want to logout?'),
                            actions: <Widget>[
                              TextButton(
                                style: TextButton.styleFrom(
                                  textStyle:
                                      Theme.of(context).textTheme.labelLarge,
                                ),
                                child: const Text(
                                  'No',
                                  style: TextStyle(color: Colors.black),
                                ),
                                onPressed: () {
                                  Navigator.of(context).pop();
                                },
                              ),
                              TextButton(
                                style: TextButton.styleFrom(
                                  textStyle:
                                      Theme.of(context).textTheme.labelLarge,
                                ),
                                child: const Text(
                                  'Sure',
                                  style: TextStyle(color: Colors.green),
                                ),
                                onPressed: () async {
                                  SharedPreferences prefs =
                                      await SharedPreferences.getInstance();
                                  await prefs.remove(
                                    'user_type',
                                  );
                                  await prefs.remove('userID');
                                  await prefs.remove('company_Id');
                                  Navigator.of(context).pushAndRemoveUntil(
                                      MaterialPageRoute(builder: (context) {
                                    return signIn();
                                  }), (route) => false);
                                },
                              ),
                            ],
                          );
                        },
                      ); // Close the drawer
                    },
                  ),
                ],
              );
            },
          ),
        ),
        body: Padding(
            padding: const EdgeInsets.all(8.0),
            child: ListView(children: [
              FutureBuilder<List<anchorassigned_orders_model>>(
                future: _ordersFuture,
                builder: (context, snapshot) {
                  if (snapshot.hasError) {
                    return Center(child: Text("Error: ${snapshot.error}"));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return Center(child: Text(""));
                  }
                  List<anchorassigned_orders_model> orders = snapshot.data!
                      .where((order) =>
                          order.statusName == 'Pick' ||
                          order.statusName == 'Drop')
                      .toList();
                  myorder = orders.length;
                  return Container();
                },
              ),
              FutureBuilder<List<Assignedorder>>(
                future:
                    apiService4.assignedorder_anchorfunc(widget.deliverymanid),
                builder: (context, snapshot) {
                  if (snapshot.hasError) {
                    return Center(child: Text(''));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return Center(child: Text(''));
                  }

                  List<Assignedorder> orders = snapshot.data!;
                  assignedoorder = orders.length;
                  return Container();
                },
              ),
              _buildTodayStatus(context),
              SizedBox(height: 20),
              FutureBuilder<List<Admorderdetailsmodel>>(
                future: apiService.getorderdetailsfunction(),
                builder: (context, snapshot) {
                  if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return Center(child: Text('No orders found.'));
                  } else {
                    // Filter orders where statusName is "Pending"
                    final orders = snapshot.data!
                        .where((order) =>
                            order.statusName == "Pending" ||
                            order.statusName == "Ready to Drop")
                        .toList();
                    pending = orders.length;
                    if (orders.isEmpty) {
                      return Center(child: Text('No pending orders found.'));
                    }

                    return SingleChildScrollView(
                      scrollDirection: Axis
                          .horizontal, // To handle overflow if there are many columns
                      child: DataTable(
                        columnSpacing: 10, // Reduce the space between columns
                        headingRowHeight:
                            30, // Reduce the height of the header row
                        dataRowHeight: 40, // Reduce the height of the data rows
                        columns: const [
                          DataColumn(
                            label: Center(
                              child: Text(
                                'Order ID',
                                style:
                                    TextStyle(fontSize: 12), // Reduce font size
                              ),
                            ),
                          ),
                          DataColumn(
                            label: Center(
                              child: Text(
                                'User Name',
                                style:
                                    TextStyle(fontSize: 12), // Reduce font size
                              ),
                            ),
                          ),
                          DataColumn(
                            label: Center(
                              child: Text(
                                'Order Date',
                                style:
                                    TextStyle(fontSize: 12), // Reduce font size
                              ),
                            ),
                          ),
                          DataColumn(
                            label: Center(
                              child: Text(
                                'Status',
                                style:
                                    TextStyle(fontSize: 12), // Reduce font size
                              ),
                            ),
                          ),
                          DataColumn(
                            label: Center(
                              child: Text(
                                'Accept',
                                style:
                                    TextStyle(fontSize: 12), // Reduce font size
                              ),
                            ),
                          ),
                        ],
                        rows: orders.map((order) {
                          return DataRow(
                            cells: [
                              DataCell(
                                Card(
                                  child: Padding(
                                    padding: const EdgeInsets.all(2.0),
                                    child: Center(
                                      child: GestureDetector(
                                        onTap: () {
                                          print(order.orderId);
                                          showModalBottomSheet(
                                            context: context,
                                            builder: (context) {
                                              return Container(
                                                width: double.infinity,
                                                decoration: const BoxDecoration(
                                                  gradient: LinearGradient(
                                                    colors: [
                                                      Color.fromARGB(
                                                          115, 231, 231, 231),
                                                      Color.fromARGB(
                                                          77, 131, 131, 131),
                                                    ],
                                                    begin: Alignment.center,
                                                    end: Alignment.bottomRight,
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
                                                  padding: EdgeInsets.all(
                                                      10), // Reduce padding
                                                  child: Column(
                                                    mainAxisSize:
                                                        MainAxisSize.max,
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .spaceBetween,
                                                    children: [
                                                      Text(
                                                        'Items Details',
                                                        style: TextStyle(
                                                            fontWeight:
                                                                FontWeight.bold,
                                                            fontSize: 14),
                                                      ),
                                                      Expanded(
                                                        child: FutureBuilder<
                                                            Adm_orderdetails>(
                                                          future: apiService2
                                                              .Admorderdetailsfunctions(
                                                                  order
                                                                      .orderId),
                                                          builder: (context,
                                                              snapshot) {
                                                            if (snapshot
                                                                    .connectionState ==
                                                                ConnectionState
                                                                    .waiting) {
                                                              return Center(
                                                                child:
                                                                    CircularProgressIndicator(),
                                                              );
                                                            } else if (snapshot
                                                                .hasError) {
                                                              return Center(
                                                                child: Text(
                                                                    'Error: ${snapshot.error}'),
                                                              );
                                                            } else if (!snapshot
                                                                    .hasData ||
                                                                snapshot.data ==
                                                                    null) {
                                                              return Center(
                                                                child: Text(
                                                                    'No order data found.'),
                                                              );
                                                            } else {
                                                              final order =
                                                                  snapshot
                                                                      .data!;
                                                              return ListView(
                                                                padding:
                                                                    EdgeInsets
                                                                        .all(
                                                                            10.0),
                                                                children: [
                                                                  Text(
                                                                    'Order #${order.orderId.toString()}',
                                                                    style:
                                                                        TextStyle(
                                                                      fontSize:
                                                                          16,
                                                                      fontWeight:
                                                                          FontWeight
                                                                              .bold,
                                                                    ),
                                                                  ),
                                                                  SizedBox(
                                                                      height:
                                                                          5),
                                                                  Text(
                                                                      'Total Price: Rs.${order.totalPrice.toStringAsFixed(2)}'),
                                                                  Text(
                                                                      'Total Qty: ${order.totalItem}'),
                                                                  Text(
                                                                      'Order Date: ${order.orderDate.toString().substring(0, 10)}'),
                                                                  SizedBox(
                                                                      height:
                                                                          10),
                                                                  Text(
                                                                    'Products:',
                                                                    style:
                                                                        TextStyle(
                                                                      fontSize:
                                                                          14,
                                                                      fontWeight:
                                                                          FontWeight
                                                                              .bold,
                                                                    ),
                                                                  ),
                                                                  ...order
                                                                      .products
                                                                      .map(
                                                                          (product) {
                                                                    return ListTile(
                                                                      title:
                                                                          Text(
                                                                        product
                                                                            .productName,
                                                                        style: TextStyle(
                                                                            fontSize:
                                                                                12),
                                                                      ),
                                                                      subtitle:
                                                                          Text(
                                                                        'Quantity: ${product.quantity}\nService: ${product.category_name}',
                                                                        style: TextStyle(
                                                                            fontSize:
                                                                                12),
                                                                      ),
                                                                      trailing:
                                                                          Text(
                                                                        'Rs. ${product.totalPrice.toStringAsFixed(2)}',
                                                                        style: TextStyle(
                                                                            fontSize:
                                                                                12),
                                                                      ),
                                                                    );
                                                                  }).toList(),
                                                                  SizedBox(
                                                                      height:
                                                                          10),
                                                                  Text(
                                                                    'Address:',
                                                                    style:
                                                                        TextStyle(
                                                                      fontSize:
                                                                          14,
                                                                      fontWeight:
                                                                          FontWeight
                                                                              .bold,
                                                                    ),
                                                                  ),
                                                                  Text(
                                                                      '${order.street}, ${order.area}, ${order.cityId}'),
                                                                  Text(
                                                                      'Floor/Door No: ${order.floorDoorNo}'),
                                                                  Text(
                                                                    'Contact :',
                                                                    style: TextStyle(
                                                                        fontSize:
                                                                            20,
                                                                        fontWeight:
                                                                            FontWeight.w600),
                                                                  ),
                                                                  Column(
                                                                    crossAxisAlignment:
                                                                        CrossAxisAlignment
                                                                            .start,
                                                                    children: [
                                                                      order.mobileNumber
                                                                              .isNotEmpty
                                                                          ? TextButton
                                                                              .icon(
                                                                              onPressed: () async {
                                                                                // Request CALL_PHONE permission
                                                                                PermissionStatus status = await Permission.phone.request();

                                                                                if (status.isGranted) {
                                                                                  final Uri launchUri = Uri(
                                                                                    scheme: 'tel',
                                                                                    path: order.mobileNumber,
                                                                                  );
                                                                                  try {
                                                                                    await launchUrl(launchUri);
                                                                                  } catch (e) {
                                                                                    print('Could not launch $launchUri');
                                                                                  }
                                                                                } else {
                                                                                  print('Phone permission denied');
                                                                                }
                                                                              },
                                                                              icon: Icon(Icons.phone),
                                                                              label: Text(order.mobileNumber),
                                                                            )
                                                                          : Container(),
                                                                      order.alternativeNumber
                                                                              .isNotEmpty
                                                                          ? TextButton
                                                                              .icon(
                                                                              onPressed: () async {
                                                                                // Request CALL_PHONE permission
                                                                                PermissionStatus status = await Permission.phone.request();

                                                                                if (status.isGranted) {
                                                                                  final Uri launchUri = Uri(
                                                                                    scheme: 'tel',
                                                                                    path: order.alternativeNumber,
                                                                                  );
                                                                                  try {
                                                                                    await launchUrl(launchUri);
                                                                                  } catch (e) {
                                                                                    print('Could not launch $launchUri');
                                                                                  }
                                                                                } else {
                                                                                  print('Phone permission denied');
                                                                                }
                                                                              },
                                                                              icon: Icon(Icons.phone),
                                                                              label: Text(order.alternativeNumber),
                                                                            )
                                                                          : Container(),
                                                                    ],
                                                                  ),
                                                                  ElevatedButton
                                                                      .icon(
                                                                    onPressed:
                                                                        () {
                                                                      openGoogleMaps(
                                                                          "${order.floorDoorNo},${order.street},${order.area},${order.cityId},${order.stateId},${order.pinCode}");
                                                                    },
                                                                    label: Text(
                                                                        'Open in Google Maps'),
                                                                    icon: Icon(Icons
                                                                        .location_on_sharp),
                                                                  ),
                                                                ],
                                                              );
                                                            }
                                                          },
                                                        ),
                                                      )
                                                    ],
                                                  ),
                                                ),
                                              );
                                            },
                                          );
                                        },
                                        child: Center(
                                          child: Text(
                                            order.orderId.toString(),
                                            style: TextStyle(
                                              fontSize: 15,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              DataCell(
                                Center(
                                  child: Text(order.userName,
                                      style: TextStyle(fontSize: 12)),
                                ),
                              ),
                              DataCell(
                                Center(
                                  child: Text(
                                    order.orderDate.toString().substring(0, 10),
                                    style: TextStyle(fontSize: 12),
                                  ),
                                ),
                              ),
                              DataCell(
                                Center(
                                  child: Text(
                                    order.statusName,
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors
                                          .blue, // Blue for "Pending" status
                                    ),
                                  ),
                                ),
                              ),
                              DataCell(
                                Center(
                                  child: TextButton(
                                    onPressed: () async {
                                      OrderDeliverymanRequest request =
                                          OrderDeliverymanRequest(
                                        orderId:
                                            int.parse(order.orderId.toString()),
                                        deliverymanId: widget.deliverymanid,
                                      );
                                      OrderDeliverymanRequestfunc service =
                                          OrderDeliverymanRequestfunc();
                                      await service.assignDeliveryman(request);
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
                                                          MediaQuery.of(context)
                                                                  .size
                                                                  .height /
                                                              6,
                                                      width:
                                                          MediaQuery.of(context)
                                                                  .size
                                                                  .height /
                                                              20,
                                                      child: Lottie.asset(
                                                          "assets/orderaccept.json"),
                                                    ),
                                                    Text(
                                                      "Order Accepted",
                                                      textAlign:
                                                          TextAlign.center,
                                                      style: TextStyle(
                                                          color: Colors.black,
                                                          fontSize: 16),
                                                    ),
                                                    Padding(
                                                      padding:
                                                          const EdgeInsets.all(
                                                              12.0),
                                                      child: ElevatedButton(
                                                        onPressed: () {
                                                          Navigator.pop(
                                                              context);
                                                        },
                                                        child: Text('OK'),
                                                      ),
                                                    )
                                                  ],
                                                );
                                              },
                                            ),
                                          );
                                        },
                                      );
                                    },
                                    child: Text(
                                      "Accept",
                                      style: TextStyle(
                                          fontSize: 12), // Reduce font size
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          );
                        }).toList(),
                      ),
                    );
                  }
                },
              ),
            ])));
  }

  void openGoogleMaps(String address) async {
    try {
      // Geocode the address to get the coordinates
      List<geo.Location> locations = await geo.Geocoding().locationFromAddress(address);

      if (locations.isNotEmpty) {
        final location = locations.first;

        await MapLauncher.marker(
          Location.coords(location.latitude, location.longitude, title: address),
        ).show(map: MapApp.google);
      } else {
        await MapLauncher.marker(
          Location.search(address),
        ).show(map: MapApp.google);
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  int count = 0;
  final assignedorder_anchor apiService1 = assignedorder_anchor();
  Widget _buildTodayStatus(BuildContext context) {
    return Card(
      elevation: 8,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Overall Status',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),

            SizedBox(height: 20),
            // Pie Chart for Status
            Container(
              height: 150,
              child: _buildPieChart(),
            ),
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatusCard(
                    'Assigning Orders', assignedoorder, Colors.orange),
                _buildStatusCard('Pending Orders', pending, Colors.blue),
                _buildStatusCard('My Orders', myorder, Colors.green),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Status Card Widget
  Widget _buildStatusCard(String title, int value, Color color) {
    return Column(
      children: [
        CircleAvatar(
          radius: 25,
          backgroundColor: color,
          child: Text(
            '$value',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        SizedBox(height: 8),
        Text(
          title,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  // Pie Chart Widget
  Widget _buildPieChart() {
    final total = myorder + pending + assignedoorder;
    if (total <= 0) {
      return PieChart(
        PieChartData(
          sections: [
            PieChartSectionData(
              value: 100,
              color: Colors.grey.shade300,
              title: '',
              radius: 50,
            ),
          ],
          sectionsSpace: 2,
        ),
      );
    }
    return PieChart(
      PieChartData(
        sections: [
          PieChartSectionData(
            value: myorder.toDouble(),
            color: Colors.green,
            title: 'My Orders',
            radius: 50,
            titleStyle: TextStyle(fontSize: 12, color: Colors.white),
          ),
          PieChartSectionData(
            value: pending.toDouble(),
            color: Colors.blue,
            title: 'Pending',
            radius: 50,
            titleStyle: TextStyle(fontSize: 12, color: Colors.white),
          ),
          PieChartSectionData(
            value: assignedoorder.toDouble(),
            color: Colors.orange,
            title: 'Assigning',
            radius: 50,
            titleStyle: TextStyle(fontSize: 12, color: Colors.white),
          ),
        ],
        sectionsSpace: 2,
      ),
    );
  }

  // Quick Access Buttons Grid
  Widget _buildQuickAccessGrid(BuildContext context) {
    return Container(
      child: SingleChildScrollView(
        child: GridView.count(
          shrinkWrap: true,
          crossAxisCount: 3,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            _buildDashboardButton(context, 'Take Orders',
                CupertinoIcons.cube_fill, Color(0xFFB71C1C)),
            _buildDashboardButton(
                context, 'My Orders', CupertinoIcons.cube_box, Colors.green),
            _buildDashboardButton(
                context, 'Payments', Icons.payments_rounded, Colors.purple),
            //   _buildDashboardButton(
            //       context, 'Delivery', Icons.delivery_dining, Colors.red),
            //   _buildDashboardButton(
            //       context, 'Cash Details', Icons.monetization_on, Colors.purple),
            //   _buildDashboardButton(
            //       context, 'Settings', Icons.settings, Colors.grey),
          ],
        ),
      ),
    );
  }

  // Dashboard Button Widget
  Widget _buildDashboardButton(
      BuildContext context, String title, IconData icon, Color color) {
    return InkWell(
      onTap: () {
        // Handle navigation or button action
      },
      child: Card(
        elevation: 5,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: color,
              size: 40,
            ),
            SizedBox(height: 10),
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class App2 extends StatefulWidget {
  const App2({
    Key? key,
  }) : super(key: key);

  @override
  State<App2> createState() => _App2State();
}

class _App2State extends State<App2> {
  ListQueue<int> _navigationQueue = ListQueue();
  int index = 0;
  int user_type = 0;
  String userID = "";
  int company_Id = 0;
  int deliveryman_id = 0;
  getuser() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    setState(() {
      user_type = pref.getInt("user_type") ?? 0;
      userID = pref.getString("userID") ?? "";
      company_Id = pref.getInt("company_Id") ?? 0;
      deliveryman_id = pref.getInt("deliveryman_id")!;
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getuser();
  }

  @override
  Widget build(BuildContext context) {
    ThemeData theme = Theme.of(context);

    return WillPopScope(
      onWillPop: () async {
        if (index == 0) {
          return true; // Exit the app
        } else {
          setState(() {
            index = 0; // Navigate back to the home tab when back is pressed
          });
          return false; // Prevent default back button behavior
        }
      },
      child: Scaffold(
        body: getBody(index),
        bottomNavigationBar: BottomNavigationBar(
          backgroundColor: Colors.white,
          selectedItemColor: Colors.black,
          type: BottomNavigationBarType.fixed,
          currentIndex: index,
          onTap: (value) {
            setState(() => index = value);
          },
          items: [
            BottomNavigationBarItem(
              icon: _buildIcon(Icons.home, 0, Color(0xFFB71C1C)),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: _buildIconWithBadge(Icons.person, 1, Colors.purple),
              label: 'Assigned to you',
            ),
            BottomNavigationBarItem(
              icon: _buildIcon(CupertinoIcons.cube_fill, 2, Color(0xFFB71C1C)),
              label: 'My Orders',
            ),
          ],
        ),
      ),
    );
  }

  // Method to build the icon with background color change
  Widget _buildIcon(IconData iconData, int itemIndex, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: index == itemIndex
            ? Color(0xff004aad)
            : Colors.transparent, // Change background color for selected item
        shape: BoxShape.circle,
      ),
      padding: EdgeInsets.all(8), // Padding to ensure icon is centered properly
      child: Icon(
        iconData,
        color: index == itemIndex
            ? Colors.white
            : color, // Icon color based on selection
        size: 28,
      ),
    );
  }

  // Method to build an icon with a badge (for the third item)
  Widget _buildIconWithBadge(IconData iconData, int itemIndex, Color color) {
    return Stack(
      children: [
        _buildIcon(iconData, itemIndex,
            color), // The main icon with the background color change
        if (itemIndex == 2) // Show badge only for the third item
          Positioned(
            top: 0.0,
            right: 0.0,
            child: Icon(
              Icons.brightness_1,
              size: 8.0,
              color: Colors.redAccent, // Badge color
            ),
          ),
      ],
    );
  }

  // Body content for different tabs
  getBody(int index) {
    switch (index) {
      case 0:
        return DashboardScreen(
          deliverymanid: deliveryman_id,
          userid: userID.toString(),
        );
      case 1:
        return assignedorders(
          deliverymanid: deliveryman_id,
        );
      case 2:
        return myorders(
          deliverymanid: deliveryman_id,
        );
    }
  }
}

class order_detailss extends StatefulWidget {
  const order_detailss({super.key});

  @override
  State<order_detailss> createState() => _order_detailssState();
}

class _order_detailssState extends State<order_detailss> {
  TextEditingController fromdateInput = TextEditingController();
  String fromdate = DateFormat("dd-MMM-yyyy").format(DateTime.now());
  var formatter = DateFormat('dd-MMM-yyyy');
  final place = <String>[
    'Woraiyur',
    'Thilainagar',
    'Mraket',
    'Juction',
    'Vayaulur'
  ];
  final List<String> name = <String>[
    'Karthi',
    'Ravi',
    'Kumar',
    'Ganesh',
    'Vijay'
  ];

  final cloth = <String>['4', '5', '2', '2', '1'];

  final Pickups = <String>[
    'Assign',
    'Assigned to Mike',
    'Assigned to Harry',
    'Assign',
    'Assign'
  ];

  final clothcount = <String>[
    '1.Cotton Kurti - 3\n2.Shirt - 2\n3.Vesti - 1\n4.Cotton Saree - 2',
    '1.Silk Kurti - 3\n2.T-Shirt - 2\n3.Vesti - 1\n4.Cotton Saree - 2\n5.Shirt - 2\n',
    '1.Cotton Saree - 2\n2.Shirt - 2',
    '1.Cotton Silk Saree - 2\n2.Cotton Shirt - 2',
    '1.Cotton Silk Saree'
  ];

  final service = <String>[
    'Washing\nIroning\nWashing & Ironing\nWashing',
    'Washing\nWashing\nIroning\nWashing&Ironing\nIroning\n',
    'Washing\nWashing&Ironing',
    'Washing&Ironing\nWashing',
    'Washing&Ironing'
  ];

  final List<String> myList = <String>[
    'Karthi',
    'Ravi',
    'Kumar',
    'Ganesh',
  ];
  final List<String> image = <String>[
    'assets/profile1.jpg',
    'assets/profile2.jpg',
    'assets/profile3.jpg',
    'assets/profile4.jpg',
  ];
  final List<String> time = <String>[
    '9.34 am',
    '3.03 pm',
    '10.55 am',
    '2.30 pm',
    '9.34 am',
  ];
  final number = <String>[
    '9876543210',
    '9876543211',
    '9876543212',
    '987654312',
    '9876543214'
  ];

  late List<CollapsibleItem> _items;
  late String _headline;
  AssetImage _avatarImg = AssetImage('assets/man.png');

  @override
  void initState() {
    super.initState();

    _headline = _items.firstWhere((item) => item.isSelected).text;
    fromdateInput.text = fromdate;
  }

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: Builder(builder: (context) {
          return InkWell(
            onTap: () {
              Scaffold.of(context).openDrawer();
            },
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Container(
                height: 40,
                child: CircleAvatar(
                  backgroundImage: AssetImage('assets/profile4.jpg'),
                  backgroundColor: Colors.transparent,
                ),
              ),
            ),
          );
        }),
        backgroundColor: Colors.transparent,
        title: Text(
          "Hi, John",
          style: TextStyle(
            fontSize: 21,
            color: Colors.black,
            fontWeight: FontWeight.w700,
          ),
        ),
        actions: [
          Padding(
            padding: EdgeInsets.all(8.0),
            child: Container(
              alignment: Alignment.topRight,
              child: PopupMenuButton(
                child: CircleAvatar(
                  child: Image(
                    image: AssetImage("assets/logo.jpg"),
                  ),
                ),
                onSelected: (value) {
                  // your logic
                },
                itemBuilder: (BuildContext bc) {
                  return [
                    // PopupMenuItem(
                    //   child: Text("Edit"),
                    //   value: '/hello',
                    // ),
                    PopupMenuItem(
                      onTap: () {
                        showDialog<void>(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              title: const Text('Logout'),
                              content:
                                  const Text('Do you Really want to logout?'),
                              actions: <Widget>[
                                TextButton(
                                  style: TextButton.styleFrom(
                                    textStyle:
                                        Theme.of(context).textTheme.labelLarge,
                                  ),
                                  child: const Text(
                                    'No',
                                    style: TextStyle(color: Colors.black),
                                  ),
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                  },
                                ),
                                TextButton(
                                  style: TextButton.styleFrom(
                                    textStyle:
                                        Theme.of(context).textTheme.labelLarge,
                                  ),
                                  child: const Text(
                                    'Sure',
                                    style: TextStyle(color: Colors.green),
                                  ),
                                  onPressed: () async {
                                    SharedPreferences prefs =
                                        await SharedPreferences.getInstance();
                                    await prefs.remove(
                                      'user_type',
                                    );
                                    await prefs.remove('userID');
                                    await prefs.remove('company_Id');
                                    Navigator.of(context).pushAndRemoveUntil(
                                        MaterialPageRoute(builder: (context) {
                                      return signIn();
                                    }), (route) => false);
                                  },
                                ),
                              ],
                            );
                          },
                        );
                      },
                      child: InkWell(child: Text("Logout")),
                      value: '/about',
                    ),
                  ];
                },
              ),
            ),
          )
        ],
      ),
      drawer: Drawer(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: ListView(
            padding: EdgeInsets.zero,
            children: <Widget>[
              SizedBox(
                height: 50,
              ),
              ListTile(
                leading: Icon(Icons.work_history),
                title: Text('History'),
                onTap: () {
                  // Update the state of the app.
                  // ...
                },
              ),
              ListTile(
                leading: Icon(Icons.currency_rupee),
                title: Text('Salary'),
                onTap: () {
                  // Update the state of the app.
                  // ...
                },
              ),
              ListTile(
                leading: Icon(Icons.logout),
                title: Text('Log out'),
                onTap: () {
                  // Update the state of the app.
                  // ...
                },
              ),
            ],
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: SingleChildScrollView(
            child: Column(
              children: [
                Card(
                  child: Container(
                    child: Column(
                      children: [
                        ListTile(
                          leading: Icon(Icons.calendar_month),
                          title: Text(
                            "Date ",
                            style: TextStyle(
                                fontWeight: FontWeight.w700, fontSize: 17),
                          ),
                          trailing: Text(
                            fromdate,
                            style: TextStyle(
                                fontWeight: FontWeight.w700, fontSize: 15),
                          ),
                          onTap: () async {
                            DateTime? date = await showDatePicker(
                              context: context,
                              initialDate: DateTime(DateTime.now().year,
                                  DateTime.now().month, DateTime.now().day),
                              firstDate: DateTime(
                                  DateTime.now().year,
                                  DateTime.now().month,
                                  DateTime.now().day - 180),
                              lastDate: new DateTime(
                                  DateTime.now().year,
                                  DateTime.now().month,
                                  DateTime.now().day + 30),
                            );
                            if (date != null) {
                              setState(() {
                                fromdate = formatter.format(date);
                                fromdateInput.text = fromdate;
                                // fromdate =
                                //     "${date.day}-${date.month}-${date.year}";
                                print(fromdate);
                              });
                            }
                          },
                        ),
                        ListTile(
                          leading: Icon(CupertinoIcons.cube_box_fill),
                          title: Text(
                            "Pick Up Orders ",
                            style: TextStyle(
                                fontWeight: FontWeight.w700, fontSize: 17),
                          ),
                          trailing: Text(
                            "50",
                            style: TextStyle(
                                fontWeight: FontWeight.w700, fontSize: 17),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    alignment: Alignment.topLeft,
                    child: Text(
                      "Pick Up order List",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Color(0xfffc7905),
                      ),
                    ),
                  ),
                ),
                Container(
                  child: ListView.builder(
                    shrinkWrap: true,
                    physics: BouncingScrollPhysics(),
                    itemCount: place.length,
                    itemBuilder: (context, index) => Card(
                      color: Colors.white,
                      child: ExpansionTile(
                        collapsedShape: RoundedRectangleBorder(
                          side: BorderSide.none,
                        ),
                        shape: RoundedRectangleBorder(
                          side: BorderSide.none,
                        ),
                        title: ListTile(
                          title: RichText(
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: 'Booking Time : ',
                                  style: TextStyle(
                                      color: Colors.blue, fontSize: 13),
                                ),
                                TextSpan(
                                  text: time[index] + '\n\n',
                                  style: TextStyle(
                                      color: Colors.black, fontSize: 13),
                                ),
                                TextSpan(
                                  text: name[index].toString(),
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black,
                                      fontSize: 14),
                                ),
                              ],
                            ),
                          ),
                          subtitle: Text(place[index].toString() +
                              "\nType.of clothes : " +
                              cloth[index].toString() +
                              "\n" +
                              number[index].toString()),
                        ),
                        subtitle: Pickups[index] == "Assign"
                            ? Container(
                                alignment: Alignment.topLeft,
                                width: 20,
                                child: ElevatedButton(
                                    style: ButtonStyle(
                                      backgroundColor:
                                          MaterialStateProperty.all(
                                        Color(0xFFFFCC80),
                                      ),
                                    ),
                                    onPressed: () {},
                                    child: Text(
                                      "Assign",
                                      style: TextStyle(color: Colors.white),
                                    )))
                            : Text(
                                Pickups[index],
                                style: TextStyle(
                                    color: Pickups[index] == "Assign"
                                        ? Color(0xffFF7D29)
                                        : Pickups[index] == "Delivery"
                                            ? Color(0xFF1B5E20)
                                            : Pickups[index] == "Pick up"
                                                ? Colors.blue
                                                : Colors.teal),
                              ),
                        children: <Widget>[
                          ListTile(
                            title: Container(
                              child: Text(
                                clothcount[index].toString(),
                                style: TextStyle(fontWeight: FontWeight.w700),
                              ),
                            ),
                            subtitle: Text(
                              service[index].toString(),
                              style: TextStyle(fontWeight: FontWeight.w700),
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  openCustomSettings(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color.fromARGB(115, 231, 231, 231),
                Color.fromARGB(77, 131, 131, 131),
              ],
              begin: Alignment.center,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(30),
              topRight: Radius.circular(30),
            ),
          ),
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Available People',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
                Container(
                  height: MediaQuery.of(context).size.height / 2.3,
                  // color: Colors.red,
                  child: LayoutBuilder(builder: (context, constraints) {
                    return ListView.builder(
                      itemCount: myList.length,
                      itemBuilder: (context, index) => Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Card(
                            child: ListTile(
                              leading: Container(
                                height: 40,
                                child: CircleAvatar(
                                  backgroundImage: AssetImage(image[index]),
                                  backgroundColor: Colors.transparent,
                                ),
                              ),
                              title: Text(
                                name[index],
                              ),
                              trailing: TextButton(
                                onPressed: () {},
                                child: Text("Assign"),
                              ),
                            ),
                          )),
                    );
                  }),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
