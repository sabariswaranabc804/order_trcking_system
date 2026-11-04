import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart' as geo;
import 'package:map_launcher/map_launcher.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:url_launcher/url_launcher.dart';

import '../API/api.dart';
import '../Admin/qrcode.dart';
import '../Model/adm_orderdetails.dart';
import '../Model/anchor_assignedorders.dart';
import '../Model/rejectmodel.dart';

class myorders extends StatefulWidget {
  final int deliverymanid;
  const myorders({super.key, required this.deliverymanid});

  @override
  State<myorders> createState() => _myordersState();
}

class _myordersState extends State<myorders> {
  late Future<List<anchorassigned_orders_model>> _ordersFuture;

  @override
  void initState() {
    super.initState();
    _ordersFuture = anchorassignedorderslist()
        .anchorassignedorderslistfunc(widget.deliverymanid);
    _reloadOrders();
  }

  String selectedPayment = 'offline'; // Default to 'offline' (COD)
  bool isLoading = false;

  // Function to handle payment status change
  void handlePaymentChange(String? value) {
    setState(() {
      selectedPayment = value!;
    });
  }

  final rejecct _apiService = rejecct();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text(
          "My Orders",
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: FutureBuilder<List<anchorassigned_orders_model>>(
        future: _ordersFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text("No orders available"));
          }

          List<anchorassigned_orders_model> orders = snapshot.data!
              .where((order) =>
                  order.statusName == 'Pick' || order.statusName == 'Drop')
              .toList();

          return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: SingleChildScrollView(
                scrollDirection: Axis.vertical, // Allows horizontal scrolling
                child: DataTable(
                  columnSpacing: 18, // Adjust spacing between columns
                  columns: [
                    DataColumn(
                        label:
                            Text('Order ID', style: TextStyle(fontSize: 12))),
                    DataColumn(
                        label:
                            Text('User Name', style: TextStyle(fontSize: 12))),
                    DataColumn(
                        label:
                            Text('Order Date', style: TextStyle(fontSize: 12))),
                    DataColumn(
                        label: Text('Your Status Name',
                            style: TextStyle(fontSize: 12))),
                    DataColumn(label: Center(child: Text('Payment'))),
                    DataColumn(
                        label: Text('Reject', style: TextStyle(fontSize: 12))),
                  ],
                  rows: orders.map((order) {
                    return DataRow(cells: [
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
                                        order.orderId, order.totalPrice),
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
                          child: Text(order.userName,
                              style: TextStyle(fontSize: 12)))),
                      DataCell(Center(
                          child: Text(order.orderDate.toString().split(' ')[0],
                              style: TextStyle(fontSize: 12)))),
                      DataCell(Center(
                          child: order.orderStatusId == 3
                              ? Text("Pick", style: TextStyle(fontSize: 12))
                              : Text("Drop", style: TextStyle(fontSize: 12)))),
                      DataCell(
                        Center(
                          child: TextButton(
                            onPressed: () {
                              // Show the dialog when the button is pressed
                              showDialog(
                                context: context,
                                builder: (context) => AlertDialog(
                                  title: Text('Select Payment Status'),
                                  content: Column(
                                    mainAxisSize: MainAxisSize
                                        .min, // Make the dialog's height fit the content
                                    children: [
                                      Text('Select Payment Status:'),
                                      SizedBox(
                                          height:
                                              10), // Add some space between the text and dropdown
                                      DropdownButton<String>(
                                        value: selectedPayment,
                                        onChanged: (String? newValue) {
                                          setState(() {
                                            selectedPayment = newValue!;
                                          });

                                          // Trigger the payment update inside the onChanged callback
                                          Future<void>
                                              updatePaymentStatus() async {
                                            setState(() {
                                              isLoading = true;
                                            });

                                            // Instantiate paymentApiService and call updatePaymentStatus
                                            paymentApiService apiService =
                                                paymentApiService();

                                            bool success = await apiService
                                                .updatePaymentStatus(
                                              order.orderId.toString(),
                                              selectedPayment,
                                            );

                                            setState(() {
                                              isLoading = false;
                                            });

                                            if (success) {
                                              ScaffoldMessenger.of(context)
                                                  .showSnackBar(
                                                SnackBar(
                                                    content: Text(
                                                        'Payment status updated successfully')),
                                              );
                                            } else {
                                              ScaffoldMessenger.of(context)
                                                  .showSnackBar(
                                                SnackBar(
                                                    content: Text(
                                                        'Failed to update payment status')),
                                              );
                                            }
                                            _reloadOrders();

                                            // Close the dialog
                                            Navigator.of(context).pop();
                                          }

                                          updatePaymentStatus(); // Call the function to update the payment status
                                        },
                                        isExpanded:
                                            true, // Ensure it takes up the full width
                                        items: [
                                          DropdownMenuItem(
                                            value: 'offline',
                                            child: Text('COD'),
                                          ),
                                          DropdownMenuItem(
                                            value: 'online',
                                            child: Text('Verify'),
                                          ),
                                          DropdownMenuItem(
                                            value: 'paid',
                                            child: Text('PAID'),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  actions: [
                                    TextButton(
                                      onPressed: () {
                                        // Close the dialog without saving
                                        Navigator.of(context).pop();
                                      },
                                      child: Text('Cancel'),
                                    ),
                                    TextButton(
                                      onPressed: () {
                                        // Save the selected value and close the dialog
                                        Navigator.of(context).pop();
                                        print(
                                            'Selected Payment Status: $selectedPayment');
                                      },
                                      child: Text('Save'),
                                    ),
                                  ],
                                ),
                              );
                            },
                            child: order.payment == "online"
                                ? Text("Verify")
                                : order.payment == "offline"
                                    ? Text("COD")
                                    : Text(order.payment),
                          ),
                        ),
                      ),
                      DataCell(
                        order.currentStatus == order.orderStatusId
                            ? Center(
                                child: TextButton(
                                  onPressed: () async {
                                    showDialog(
                                      context: context,
                                      builder: (BuildContext context) {
                                        return AlertDialog(
                                          title: Text("Reject"),
                                          content: Text(
                                              'Want to reject this order?'),
                                          actions: <Widget>[
                                            TextButton(
                                              onPressed: () {
                                                Navigator.of(context)
                                                    .pop(); // Close the dialog
                                              },
                                              child: Text("Cancel"),
                                            ),
                                            TextButton(
                                              onPressed: () async {
                                                print(order.orderId);
                                                print(order.statusName);
                                                rejectmodel rej = rejectmodel(
                                                    orderId: order.orderId,
                                                    statusName:
                                                        order.statusName);
                                                bool success = await _apiService
                                                    .rejectfunc(rej);
                                                if (success) {
                                                  ScaffoldMessenger.of(context)
                                                      .showSnackBar(
                                                    SnackBar(
                                                      backgroundColor:
                                                          Colors.red,
                                                      content: Text(
                                                          'Order Rejected'),
                                                    ),
                                                  );
                                                  _reloadOrders();
                                                } else {
                                                  ScaffoldMessenger.of(context)
                                                      .showSnackBar(
                                                    SnackBar(
                                                      backgroundColor:
                                                          Colors.red,
                                                      content: Text(
                                                          'Failed to reject order'),
                                                    ),
                                                  );
                                                }
                                                Navigator.of(context).pop();
                                              },
                                              child: Text("OK"),
                                            ),
                                          ],
                                        );
                                      },
                                    );
                                  },
                                  child: Text("Reject",
                                      style: TextStyle(fontSize: 12)),
                                ),
                              )
                            : Center(child: Text("N/A")),
                      ),
                    ]);
                  }).toList(),
                ),
              ));
        },
      ),
    );
  }

  void _reloadOrders() async {
    setState(() {
      _ordersFuture = anchorassignedorderslist()
          .anchorassignedorderslistfunc(widget.deliverymanid);
    });
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

  final Admorderdetailsfunc apiService2 = Admorderdetailsfunc();
  openCustomSettings(BuildContext context, int orerid, double total) {
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
                      future: apiService2.Admorderdetailsfunctions(orerid),
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
                                  'Total Price: Rs.${order.totalPrice.toStringAsFixed(2)}'),
                              Text('Total Qty: ${order.totalItem}'),
                              Text(
                                  'Order Date: ${order.orderDate.toString().substring(0, 10)}'),
                              Text(
                                  'C: ${order.deliverymanName} (${order.contact})'),
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
                                      'Quantity: ${product.quantity}\nService: ${product.category_name}'),
                                  trailing: Text(
                                      'Rs. ${product.totalPrice.toStringAsFixed(2)}'),
                                );
                              }).toList(),
                              SizedBox(height: 20),
                              Text(
                                'Address:',
                                style: TextStyle(
                                    fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                  '${order.street}, ${order.area}, ${order.cityId}'),
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
                                      "${order.floorDoorNo},${order.street},${order.area},${order.cityId},${order.stateId},${order.pinCode}");
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
                TextButton.icon(
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => UpiQrCode(
                                  amount: total,
                                  orderId: orerid.toString(),
                                )));
                  },
                  icon: Icon(Icons.qr_code_scanner_sharp),
                  label: Text(
                    'Total Amount ${total}',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                )
              ],
            ),
          ),
        );
      },
    );
  }
}
