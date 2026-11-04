import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:geocoding/geocoding.dart' as geo;
import 'package:intl/intl.dart';
import 'package:map_launcher/map_launcher.dart';
import 'package:ots/Admin/order/readytodrop.dart';
import 'package:ots/Admin/order/readytopick.dart';
import 'package:ots/Admin/order/rejectview.dart';

import 'package:permission_handler/permission_handler.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;
import '../../API/api.dart';
import '../../Model/adm_orderdetails.dart';
import '../../Model/admgetallordermodel.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

import '../../Model/anchorgetdteills.dart';
import '../../Model/orderupdaterequest.dart';
import '../../main.dart';
import 'Deliverd.dart';
import 'Pendingorders.dart';
import 'Pickorders.dart';
import 'drop.dart';
import 'package:http/http.dart' as http;

class ordersHomePage extends StatefulWidget {
  final int companyid;
  const ordersHomePage({super.key, required this.companyid});
  @override
  _ordersHomePageState createState() => _ordersHomePageState();
}

class _ordersHomePageState extends State<ordersHomePage>
    with SingleTickerProviderStateMixin {
  late List<Widget> tabsContent;

  @override
  void initState() {
    super.initState();

    // Initialize the tabsContent inside initState, where widget.companyid can be accessed
    tabsContent = [
      view_order(
        companyid: widget.companyid,
      ),
      readytodrop(
        companyid: widget.companyid,
      ),
      drop(),
      delivered(),
    ];
  }

  List<Tab> tabs = [
    Tab(child: Text("All")),
    Tab(child: Text("Ready to Deliver")),
    Tab(child: Text("Deliver")),
    Tab(child: Text("Delivered")),
  ];

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: tabs.length,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: CupertinoColors.white,
          elevation: 5,
          title: Text(
            "Overall Orders",
            style: TextStyle(color: Colors.black, fontWeight: FontWeight.w700),
          ),
          leading: IconButton(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: Icon(
              Icons.arrow_back,
              color: Colors.black,
            ),
          ),
          centerTitle: true,
          bottom: PreferredSize(
            preferredSize: Size.fromHeight(30),
            child: TabBar(
              isScrollable: true,
              unselectedLabelColor: Color(0xFF1B5E20),
              tabs: tabs.toList(),
            ),
          ),
          //      systemOverlayStyle: SystemUiOverlayStyle.light,
        ),
        body: TabBarView(
          children: tabsContent,
        ),
      ),
    );
  }
}

class view_order extends StatefulWidget {
  final int companyid;
  const view_order({super.key, required this.companyid});

  @override
  State<view_order> createState() => _view_orderState();
}

class _view_orderState extends State<view_order> {
  final getorderdetailsfunc apiService = getorderdetailsfunc();
  DateTime? startDate;
  DateTime? endDate;
  String? statusFilter; // Variable for status filtering
  final setcomplete _orderService1 = setcomplete();
  bool _isLoading = false;
  List<DeliveryMan> deliveryMen = [];
  Set<int> selectedDeliveryMen = Set<int>();
  List<Admorderdetailsmodel> filterOrdersByDateRange(
      List<Admorderdetailsmodel> orders) {
    return orders.where((order) {
      DateTime orderDate;
      try {
        orderDate =
            order.orderDate; // This assumes the orderDate is in a valid format
      } catch (e) {
        return false; // If the date format is invalid, exclude this order
      }

      // Normalize the orderDate to ignore time part (set time to midnight)
      orderDate = DateTime(orderDate.year, orderDate.month, orderDate.day);

      // Normalize startDate and endDate to ignore the time part
      DateTime? startDateNormalized = startDate == null
          ? null
          : DateTime(startDate!.year, startDate!.month, startDate!.day);
      DateTime? endDateNormalized = endDate == null
          ? null
          : DateTime(endDate!.year, endDate!.month, endDate!.day);

      // Check if the orderDate is within the selected date range
      bool isInDateRange =
          (startDateNormalized == null || endDateNormalized == null) ||
              (orderDate.isAfter(startDateNormalized!) &&
                  orderDate.isBefore(endDateNormalized!)) ||
              orderDate.isAtSameMomentAs(startDateNormalized!) ||
              orderDate.isAtSameMomentAs(endDateNormalized!);

      // Check if the order matches the selected status
      bool matchesStatus =
          statusFilter == null || order.statusName == statusFilter;

      return isInDateRange && matchesStatus;
    }).toList();
  }

  Future<void> _selectStartDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != startDate) {
      setState(() {
        startDate = picked;
        print(startDate);
      });
    }
  }

  Future<void> _selectEndDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != endDate) {
      setState(() {
        endDate = picked;
        print(picked);
      });
    }
  }

  @override
  void initState() {
    super.initState();
    fetchDeliveryMen(widget.companyid);
  }

  Future<void> fetchDeliveryMen(int companyid) async {
    final response =
        await http.get(Uri.parse("http://$api/api//deliveryman/${companyid}"));

    if (response.statusCode == 200) {
      List<dynamic> data = jsonDecode(response.body);
      setState(() {
        deliveryMen = data.map((json) => DeliveryMan.fromJson(json)).toList();
      });
    } else {
      throw Exception('Failed to load delivery men data');
    }
  }

  String selectedPayment = 'offline'; // Default to 'offline' (COD)
  bool isLoading = false;

  // Function to handle payment status change
  void handlePaymentChange(String? value) {
    setState(() {
      selectedPayment = value!;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: RefreshIndicator(
        onRefresh: _refreshData,
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () => _selectStartDate(context),
                  child: Text(
                    startDate == null
                        ? "Select Start Date"
                        : "Start Date: ${DateFormat('yyyy-MM-dd').format(startDate!)}",
                    style: TextStyle(fontSize: 13),
                  ),
                ),
                TextButton(
                  onPressed: () => _selectEndDate(context),
                  child: Text(
                    endDate == null
                        ? "Select End Date"
                        : "End Date: ${DateFormat('yyyy-MM-dd').format(endDate!)}",
                    style: TextStyle(fontSize: 13),
                  ),
                ),
                IconButton(
                    onPressed: () {
                      _refreshData();
                    },
                    icon: Icon(
                      Icons.refresh,
                      color: Colors.green,
                    ))
                // Dropdown for selecting status
              ],
            ),
            Expanded(
              child: FutureBuilder<List<Admorderdetailsmodel>>(
                future: apiService.getorderdetailsfunction(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return Center(child: Text('No orders found.'));
                  } else {
                    final orders = filterOrdersByDateRange(snapshot.data!);
                    final orderCount = orders.length;

                    return Column(
                      children: [
                        Row(
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: DropdownButton<String>(
                                hint: Text(
                                  "Select Status",
                                  style: TextStyle(fontSize: 12),
                                ),
                                value: statusFilter,
                                items: [
                                  //      "Ready to Pick",
                                  //    "Pick",
                                  "Ready to Drop", "Drop", "Completed",
                                  //    "Pending",
                                  "User Cancelled"
                                ].map((status) {
                                  return DropdownMenuItem<String>(
                                    value: status,
                                    child: Text(status),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  setState(() {
                                    statusFilter = value;
                                  });
                                },
                              ),
                            ),
                            Text(
                              'Filtered Orders Count: $orderCount',
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        Expanded(
                          child: SingleChildScrollView(
                            scrollDirection: Axis.vertical,
                            child: SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: DataTable(
                                columnSpacing: 13,
                                columns: const [
                                  DataColumn(
                                      label: Center(child: Text('Order ID'))),
                                  DataColumn(
                                      label: Center(child: Text('User Name'))),
                                  DataColumn(
                                      label: Center(child: Text('Order Date'))),
                                  DataColumn(
                                      label: Center(child: Text('Status'))),
                                  DataColumn(
                                      label: Center(child: Text('Payment'))),
                                  DataColumn(
                                      label:
                                          Center(child: Text('Delivery Man'))),
                                ],
                                rows: orders.map((order) {
                                  return DataRow(
                                    cells: [
                                      DataCell(
                                        Padding(
                                          padding: const EdgeInsets.all(8.0),
                                          child: Card(
                                            child: Center(
                                                child: GestureDetector(
                                                    onTap: () {
                                                      openCustomSettings(
                                                          context,
                                                          int.parse(order
                                                              .orderId
                                                              .toString()),
                                                          order.statusName);
                                                    },
                                                    child: Text(order.orderId
                                                        .toString()))),
                                          ),
                                        ),
                                      ),
                                      DataCell(
                                          Center(child: Text(order.userName))),
                                      DataCell(
                                        Center(
                                          child: Text(order.orderDate
                                              .toString()
                                              .substring(0, 10)),
                                        ),
                                      ),
                                      DataCell(
                                        Center(
                                          child: Text(
                                            order.statusName,
                                            style: TextStyle(
                                              color: order.statusName ==
                                                      "Completed"
                                                  ? Color(0xFF2E7D32)
                                                  : order.statusName ==
                                                          "Ready to Drop"
                                                      ? Colors.red
                                                      : order.statusName ==
                                                              "Drop"
                                                          ? Colors.blue
                                                          : Colors.purple,
                                            ),
                                          ),
                                        ),
                                      ),
                                      DataCell(
                                        Center(
                                          child: TextButton(
                                            onPressed: () {
                                              // Show the dialog when the button is pressed
                                              showDialog(
                                                context: context,
                                                builder: (context) =>
                                                    AlertDialog(
                                                  title: Text(
                                                      'Select Payment Status'),
                                                  content: Column(
                                                    mainAxisSize: MainAxisSize
                                                        .min, // Make the dialog's height fit the content
                                                    children: [
                                                      Text(
                                                          'Select Payment Status:'),
                                                      SizedBox(
                                                          height:
                                                              10), // Add some space between the text and dropdown
                                                      DropdownButton<String>(
                                                        value: selectedPayment,
                                                        onChanged:
                                                            (String? newValue) {
                                                          setState(() {
                                                            selectedPayment =
                                                                newValue!;
                                                          });

                                                          // Trigger the payment update inside the onChanged callback
                                                          Future<void>
                                                              updatePaymentStatus() async {
                                                            setState(() {
                                                              isLoading = true;
                                                            });

                                                            // Instantiate paymentApiService and call updatePaymentStatus
                                                            paymentApiService
                                                                apiService =
                                                                paymentApiService();

                                                            bool success =
                                                                await apiService
                                                                    .updatePaymentStatus(
                                                              order.orderId
                                                                  .toString(),
                                                              selectedPayment,
                                                            );

                                                            setState(() {
                                                              isLoading = false;
                                                            });

                                                            if (success) {
                                                              ScaffoldMessenger
                                                                      .of(context)
                                                                  .showSnackBar(
                                                                SnackBar(
                                                                    content: Text(
                                                                        'Payment status updated successfully')),
                                                              );
                                                            } else {
                                                              ScaffoldMessenger
                                                                      .of(context)
                                                                  .showSnackBar(
                                                                SnackBar(
                                                                    content: Text(
                                                                        'Failed to update payment status')),
                                                              );
                                                            }

                                                            // Close the dialog
                                                            Navigator.of(
                                                                    context)
                                                                .pop();
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
                                                            child:
                                                                Text('Verify'),
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
                                                        Navigator.of(context)
                                                            .pop();
                                                      },
                                                      child: Text('Cancel'),
                                                    ),
                                                    TextButton(
                                                      onPressed: () {
                                                        // Save the selected value and close the dialog
                                                        Navigator.of(context)
                                                            .pop();
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
                                      DataCell(Center(
                                          child: order.statusName == "Completed"
                                              ? Text("Done")
                                              : order.statusName ==
                                                      "Ready to Drop"
                                                  ? ElevatedButton(
                                                      style: ElevatedButton
                                                          .styleFrom(
                                                              backgroundColor:
                                                                  Colors.green),
                                                      onPressed: () async {
                                                        if (order.mobileNumber ==
                                                                null ||
                                                            order.mobileNumber!
                                                                .isEmpty) {
                                                          ScaffoldMessenger.of(
                                                                  context)
                                                              .showSnackBar(
                                                            SnackBar(
                                                              content: Text(
                                                                  "Customer mobile number is missing"),
                                                              backgroundColor:
                                                                  Colors.red,
                                                            ),
                                                          );
                                                          return;
                                                        }

                                                        bool success =
                                                            await _orderService
                                                                .markOrderReadyToDrop(
                                                                    order
                                                                        .orderId,
                                                                    order
                                                                        .mobileNumber);
                                                        print(
                                                            "${order.orderId}");
                                                        print(
                                                            "${order.mobileNumber}");

                                                        if (success) {
                                                          ScaffoldMessenger.of(
                                                                  context)
                                                              .showSnackBar(
                                                            SnackBar(
                                                              content: Text(
                                                                  "Order marked as Ready to Drop"),
                                                              backgroundColor:
                                                                  Colors.green,
                                                            ),
                                                          );

                                                          // Call refresh function if needed
                                                        } else {
                                                          ScaffoldMessenger.of(
                                                                  context)
                                                              .showSnackBar(
                                                            SnackBar(
                                                              content: Text(
                                                                  "Failed to update order"),
                                                              backgroundColor:
                                                                  Colors.red,
                                                            ),
                                                          );
                                                        }
                                                      },
                                                      child: Text(
                                                          "Mark Ready to Drop",
                                                          style: TextStyle(
                                                              color: Colors
                                                                  .white)),
                                                    )
                                                  : order.statusName == "Drop"
                                                      ? Center(
                                                          child:
                                                              TextButton.icon(
                                                          onPressed: () async {
                                                            showDialog(
                                                              context: context,
                                                              builder:
                                                                  (BuildContext
                                                                      context) {
                                                                return AlertDialog(
                                                                  title: Text(
                                                                      "Order Status"),
                                                                  content: Text(
                                                                      'Order Status move to Completed'),
                                                                  actions: <Widget>[
                                                                    TextButton(
                                                                      onPressed:
                                                                          () {
                                                                        Navigator.of(context)
                                                                            .pop(); // Close the dialog
                                                                      },
                                                                      child: Text(
                                                                          "Cancel"),
                                                                    ),
                                                                    TextButton(
                                                                      onPressed:
                                                                          () async {
                                                                        setState(
                                                                            () {
                                                                          _isLoading =
                                                                              true;
                                                                        });

                                                                        await _orderService1.setcompletefunc(order
                                                                            .orderId
                                                                            .toString());

                                                                        setState(
                                                                            () {
                                                                          _isLoading =
                                                                              false;
                                                                        });
                                                                        Navigator.pop(
                                                                            context);
                                                                      },
                                                                      child: Text(
                                                                          "OK"),
                                                                    ),
                                                                  ],
                                                                );
                                                              },
                                                            );
                                                          },
                                                          icon: Icon(
                                                            Icons.verified,
                                                            color: Colors.green,
                                                          ),
                                                          label: Text(
                                                              "Set Complete"),
                                                        ))
                                                      : order.statusName ==
                                                              "User Cancelled"
                                                          ? Text("Cancelled")
                                                          : Text("Complete"))),
                                    ],
                                  );
                                }).toList(),
                              ),
                            ),
                          ),
                        ),
                      ],
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  final OrderService _orderService = OrderService();
  Future<void> _refreshData() async {
    await Future.delayed(Duration(seconds: 1)); // Simulate network request
    setState(() {
      startDate = null; // Reset start date
      endDate = null; // Reset end date
      statusFilter = null; // Reset status filter
    });
    apiService.getorderdetailsfunction(); // Refresh data
  }

  final Admorderdetailsfunc apiService2 = Admorderdetailsfunc();
  openCustomSettings(BuildContext context, int orerid, String oderstsid) {
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
                                  'Total Price: Rs. ${order.totalPrice.toStringAsFixed(2)}'),
                              Text('Total Qty: ${order.totalItem}'),
                              Text(
                                  'Order Date: ${order.orderDate.toString().substring(0, 10)}'),
                              oderstsid == "Pick" ||
                                      oderstsid == "Drop" ||
                                      oderstsid == "Completed"
                                  ? Text(
                                      'Deliveryman: ${order.deliverymanName} (${order.contact})')
                                  : Container(),
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

class OrderService {
  // ✅ Replace with actual API

  Future<bool> markOrderReadyToDrop(int orderId, String mobileNumber) async {
    final url =
        Uri.parse("http://136.185.14.8:8099/api/orders/$orderId/ready-to-drop");

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"mobile_Number": mobileNumber}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print("Order Updated: ${data['message']}");
        return true;
      } else {
        print("Failed to update order: ${response.body}");
        return false;
      }
    } catch (e) {
      print("Error updating order: $e");
      return false;
    }
  }
}
