import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart' as geo;
import 'package:lottie/lottie.dart';
import 'package:map_launcher/map_launcher.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import '../API/api.dart';
import '../Model/acceptorderrequest.dart';
import '../Model/adm_assignedorder_toancgorpage.dart';
import '../Model/adm_orderdetails.dart';

class assignedorders extends StatefulWidget {
  final int deliverymanid;
  const assignedorders({super.key, required this.deliverymanid});

  @override
  State<assignedorders> createState() => _assignedordersState();
}

class _assignedordersState extends State<assignedorders> {
  int user_type = 0;
  String userID = "";
  int company_Id = 0;
  int deliveryman_id = 0;

  getuser() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    setState(() {
      user_type = pref.getInt("user_type")!;
      userID = pref.getString("userID")!;
      company_Id = pref.getInt("company_Id")!;
      deliveryman_id = pref.getInt("deliveryman_id")!;
      print(deliveryman_id);
    });
  }

  final assignedorder_anchor apiService = assignedorder_anchor();

  final Admorderdetailsfunc apiService2 = Admorderdetailsfunc();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getuser();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text(
          "Assigned Orders",
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: FutureBuilder<List<Assignedorder>>(
        future: apiService.assignedorder_anchorfunc(deliveryman_id),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('No orders found'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No orders found'));
          }

          List<Assignedorder> orders = snapshot.data!;

          return SingleChildScrollView(
            scrollDirection: Axis.vertical,
            child: SingleChildScrollView(
              scrollDirection: Axis
                  .horizontal, // Allow horizontal scrolling for larger tables
              child: DataTable(
                columnSpacing: 18,
                columns: [
                  DataColumn(label: Text('Order ID')),
                  DataColumn(label: Text('Accept')),
                  DataColumn(label: Text('User Name')),
                  DataColumn(label: Text('Order Date')),
                  DataColumn(label: Text('Status')),
                ],
                rows: orders
                    .map(
                      (order) =>
                      DataRow(cells: [
                        DataCell(
                          Padding(
                            padding: const EdgeInsets.all(5.0),
                            child: Card(
                              child: Center(
                                child: GestureDetector(
                                  onTap: () {
                                    showModalBottomSheet(
                                      context: context,
                                      builder: openCustomSettings(context,
                                          int.parse(order.orderId.toString())),
                                    );
                                  },
                                  child: Text(order.orderId.toString(),
                                      style: TextStyle(
                                        fontSize: 15,
                                      )),
                                ),
                              ),
                            ),
                          ),
                        ),
                        DataCell(Center(
                          child: TextButton.icon(
                            onPressed: () async {
                              OrderDeliverymanRequest request =
                              OrderDeliverymanRequest(
                                orderId: int.parse(order.orderId.toString()),
                                deliverymanId: widget.deliverymanid,
                              );
                              OrderDeliverymanRequestfunc service =
                              OrderDeliverymanRequestfunc();
                              await service.assignDeliveryman(request);
                              showDialog(
                                  context: context,
                                  barrierDismissible: false,
                                  builder: (context,) {
                                    return WillPopScope(
                                      onWillPop: () async => false,
                                      child: StatefulBuilder(
                                          builder: (context, setState) {
                                            return SimpleDialog(
                                              children: [
                                                Container(
                                                  height: MediaQuery
                                                      .of(context)
                                                      .size
                                                      .height /
                                                      6,
                                                  width: MediaQuery
                                                      .of(context)
                                                      .size
                                                      .height /
                                                      20,
                                                  child: Lottie.asset(
                                                    "assets/orderaccept.json",
                                                  ),
                                                  //color: Colors.red,
                                                ),
                                                Text(
                                                  "Order Accepted",
                                                  textAlign: TextAlign.center,
                                                  style: TextStyle(
                                                      color: Colors.black,
                                                      fontSize: 20),
                                                ),
                                                Padding(
                                                  padding:
                                                  const EdgeInsets.all(24.0),
                                                  child: ElevatedButton(
                                                      onPressed: () {
                                                        _reloadOrders();
                                                        Navigator.pop(context);
                                                      },
                                                      child: Text('OK',
                                                          style: TextStyle())),
                                                )
                                              ],
                                            );
                                          }),
                                    );
                                  });
                            },
                            icon: Icon(
                              Icons.check_circle,
                              color: Colors.green,
                            ),
                            label: Text("Accept"),
                          ),
                        )),
                        DataCell(Center(child: Text(order.userName!))),

                        DataCell(Center(
                          child: Text(order.orderDate.toString().split(' ')[0]),
                        )), // Display only date part
                        DataCell(Text(order.statusName!)),
                      ]),
                )
                    .toList(),
              ),
            ),
          );
        },
      ),
    );
  }

  String selectedPayment = 'offline'; // Default to 'offline' (COD)
  bool isLoading = false;

  // Function to handle payment status change
  void handlePaymentChange(String? value) {
    setState(() {
      selectedPayment = value!;
    });
  }

  void _reloadOrders() async {
    setState(() {
      apiService.assignedorder_anchorfunc(deliveryman_id);
    });
  }

  final Admorderdetailsfunc apiService3 = Admorderdetailsfunc();

  openCustomSettings(BuildContext context, int orerid) {
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
                  'Items Details',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
                Expanded(
                  child: Container(
                    child: FutureBuilder<Adm_orderdetails>(
                      future: apiService3.Admorderdetailsfunctions(orerid),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return Center(child: CircularProgressIndicator());
                        } else if (snapshot.hasError) {
                          return Center(
                              child: Text('Error: ${snapshot.error}'));
                        } else if (!snapshot.hasData) {
                          return Center(child: Text('No order data found.'));
                        } else {
                          final order = snapshot.data!;
                          return ListView(
                            padding: EdgeInsets.all(16.0),
                            children: [
                              Text(
                                'Order #${order.orderId}',
                                style: TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                              SizedBox(height: 10),
                              Text(
                                  'Total Price: Rs.${order.totalPrice
                                      .toStringAsFixed(2)}'),
                              Text('Total Qty: ${order.totalItem}'),
                              Text(
                                  'Order Date: ${order.orderDate.toString()
                                      .substring(0, 10)}'),
                              SizedBox(height: 20),
                              Text(
                                'Products:',
                                style: TextStyle(
                                    fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              ...order.products.map((product) {
                                return ListTile(
                                  title: Text(product.productName),
                                  subtitle: Text(
                                      'Quantity: ${product
                                          .quantity}\nService: ${product
                                          .category_name}'),
                                  trailing: Text(
                                      'Rs. ${product.totalPrice.toStringAsFixed(
                                          2)}'),
                                );
                              }).toList(),
                              SizedBox(height: 20),
                              Text(
                                'Address:',
                                style: TextStyle(
                                    fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                  '${order.street}, ${order.area}, ${order
                                      .cityId}'),
                              Text('Floor/Door No: ${order.floorDoorNo}'),
                              Text(
                                'Contact :',
                                style: TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.w600),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  order.mobileNumber.isNotEmpty
                                      ? TextButton.icon(
                                    onPressed: () async {
                                      // Request CALL_PHONE permission
                                      PermissionStatus status =
                                      await Permission.phone
                                          .request();

                                      if (status.isGranted) {
                                        final Uri launchUri = Uri(
                                          scheme: 'tel',
                                          path: order.mobileNumber,
                                        );
                                        try {
                                          await launchUrl(launchUri);
                                        } catch (e) {
                                          print(
                                              'Could not launch $launchUri');
                                        }
                                      } else {
                                        print('Phone permission denied');
                                      }
                                    },
                                    icon: Icon(Icons.phone),
                                    label: Text(order.mobileNumber),
                                  )
                                      : Container(),
                                  order.alternativeNumber.isNotEmpty
                                      ? TextButton.icon(
                                    onPressed: () async {
                                      // Request CALL_PHONE permission
                                      PermissionStatus status =
                                      await Permission.phone
                                          .request();

                                      if (status.isGranted) {
                                        final Uri launchUri = Uri(
                                          scheme: 'tel',
                                          path: order.alternativeNumber,
                                        );
                                        try {
                                          await launchUrl(launchUri);
                                        } catch (e) {
                                          print(
                                              'Could not launch $launchUri');
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
                              ElevatedButton.icon(
                                onPressed: () {
                                  openGoogleMaps(
                                      "${order.floorDoorNo},${order
                                          .street},${order.area},${order
                                          .cityId},${order.stateId},${order
                                          .pinCode}");
                                },
                                label: Text('Open in Google Maps'),
                                icon: Icon(Icons.location_on_sharp),
                              ),
                            ],
                          );
                        }
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
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
}