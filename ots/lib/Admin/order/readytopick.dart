import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart' as geo;
import 'package:map_launcher/map_launcher.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../API/api.dart';
import '../../Model/adm_orderdetails.dart';
import '../../Model/admgetallordermodel.dart';
import '../../Model/anchorgetdteills.dart';
import '../../Model/orderupdaterequest.dart';
import 'package:http/http.dart' as http;

import '../../main.dart';

class readytopick extends StatefulWidget {
  final int companyid;
  const readytopick({super.key, required this.companyid});

  @override
  State<readytopick> createState() => _readytopickState();
}

class _readytopickState extends State<readytopick> {
  final getorderdetailsfunc apiService = getorderdetailsfunc();
  final Admorderdetailsfunc apiService2 = Admorderdetailsfunc();

  List<DeliveryMan> deliveryMen = [];
  Set<int> selectedDeliveryMen = Set<int>();
  @override
  void initState() {
    // TODO: implement initState
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
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
              // Filter orders where statusName is "Pending"
              final orders = snapshot.data!
                  .where((order) => order.statusName == "Ready to Pick")
                  .toList();

              if (orders.isEmpty) {
                return Center(child: Text('No pending orders found.'));
              }

              return SingleChildScrollView(
                scrollDirection: Axis
                    .horizontal, // To handle overflow if there are many columns
                child: DataTable(
                  columnSpacing: 15,
                  columns: const [
                    DataColumn(label: Text('Assign')),
                    DataColumn(label: Text('Order ID')),
                    DataColumn(label: Text('User Name')),
                    DataColumn(label: Text('Order Date')),
                    DataColumn(label: Text('Status')),
                  ],
                  rows: orders.map((order) {
                    return DataRow(
                      cells: [
                        DataCell(Center(
                          child: IconButton(
                            onPressed: () {
                              print(
                                  order.orderId); // Prints orderId when clicked

                              showModalBottomSheet(
                                context: context,
                                builder: (context) {
                                  // Use StatefulBuilder to handle state updates within the modal
                                  return StatefulBuilder(
                                    builder: (BuildContext context,
                                        StateSetter modalSetState) {
                                      return Container(
                                        width: double.infinity,
                                        decoration: const BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: [
                                              Color.fromARGB(
                                                  115, 231, 231, 231),
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
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                'Anchor List',
                                                style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 15),
                                              ),
                                              Expanded(
                                                child: deliveryMen.isEmpty
                                                    ? Center(
                                                        child:
                                                            CircularProgressIndicator())
                                                    : SingleChildScrollView(
                                                        scrollDirection:
                                                            Axis.vertical,
                                                        child: ListView.builder(
                                                          shrinkWrap: true,
                                                          physics:
                                                              NeverScrollableScrollPhysics(),
                                                          itemCount: deliveryMen
                                                              .length,
                                                          itemBuilder:
                                                              (context, index) {
                                                            DeliveryMan
                                                                deliveryMan =
                                                                deliveryMen[
                                                                    index];
                                                            bool isSelected =
                                                                selectedDeliveryMen
                                                                    .contains(
                                                                        deliveryMan
                                                                            .deliverymanId);

                                                            return ListTile(
                                                              leading: Checkbox(
                                                                value:
                                                                    isSelected,
                                                                onChanged:
                                                                    (bool?
                                                                        value) {
                                                                  modalSetState(
                                                                      () {
                                                                    if (value ==
                                                                        true) {
                                                                      selectedDeliveryMen.add(
                                                                          deliveryMan
                                                                              .deliverymanId);
                                                                    } else {
                                                                      selectedDeliveryMen
                                                                          .remove(
                                                                              deliveryMan.deliverymanId);
                                                                    }
                                                                  });
                                                                },
                                                              ),
                                                              title: Text(
                                                                  deliveryMan
                                                                      .deliverymanName),
                                                            );
                                                          },
                                                        ),
                                                      ),
                                              ),
                                              // Display the selected delivery men
                                              selectedDeliveryMen.isNotEmpty
                                                  ? Padding(
                                                      padding:
                                                          const EdgeInsets.all(
                                                              8.0),
                                                      child: Text(
                                                        'Selected Delivery Men: ${selectedDeliveryMen.map((id) {
                                                          final selectedMan =
                                                              deliveryMen
                                                                  .firstWhere(
                                                                      (man) =>
                                                                          man.deliverymanId ==
                                                                          id);
                                                          return selectedMan
                                                              .deliverymanName;
                                                        }).join(', ')}',
                                                        style: TextStyle(
                                                            fontWeight:
                                                                FontWeight
                                                                    .bold),
                                                      ),
                                                    )
                                                  : Text(
                                                      'No delivery men selected'),
                                              // Add a Submit Button
                                              ElevatedButton(
                                                onPressed: () async {
                                                  // Print the selected delivery men IDs
                                                  print(
                                                      'Selected Delivery Men: ${selectedDeliveryMen.join(', ')}');

                                                  // Ensure selectedDeliveryMen is mapped to a List<int> of deliverymanId
                                                  List<int> deliverymanIdList =
                                                      selectedDeliveryMen
                                                          .map((id) {
                                                    DeliveryMan deliveryMan =
                                                        deliveryMen.firstWhere(
                                                            (man) =>
                                                                man.deliverymanId ==
                                                                id);
                                                    return deliveryMan
                                                        .deliverymanId; // Return the deliverymanId as int
                                                  }).toList(); // Return as a List<int>

                                                  // Create the OrderUpdateRequest object
                                                  OrderUpdateRequest
                                                      orderUpdate =
                                                      OrderUpdateRequest(
                                                    orderId: order.orderId,
                                                    statusName:
                                                        order.statusName,
                                                    deliverymanIds:
                                                        deliverymanIdList, // Pass the list of deliveryman IDs directly
                                                  );

                                                  RequestOrder requestOrder =
                                                      RequestOrder();
                                                  requestOrder.updateOrder(
                                                      context, orderUpdate);

                                                  fetchDeliveryMen(
                                                      widget.companyid);
                                                  selectedDeliveryMen.clear();
                                                  // Assuming you want to pop the context after the update
                                                  Navigator.pop(context);

                                                  // Print the JSON-like structure for debugging
                                                  print({
                                                    "orderId": order.orderId,
                                                    "status_Name":
                                                        order.statusName,
                                                    "deliverymanIds":
                                                        deliverymanIdList,
                                                  });
                                                },
                                                child: Text("Submit"),
                                              ),
                                            ],
                                          ),
                                        ),
                                      );
                                    },
                                  );
                                },
                              );
                            },
                            icon: Icon(
                              Icons.people,
                              color: Colors.orange,
                            ),
                          ),
                        )),
                        DataCell(
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
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Items Details',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 15),
                                        ),
                                        Expanded(
                                          child: Container(
                                            child:
                                                FutureBuilder<Adm_orderdetails>(
                                              future: apiService2
                                                  .Admorderdetailsfunctions(
                                                      order.orderId),
                                              builder: (context, snapshot) {
                                                if (snapshot.connectionState ==
                                                    ConnectionState.waiting) {
                                                  return Center(
                                                      child:
                                                          CircularProgressIndicator());
                                                } else if (snapshot.hasError) {
                                                  return Center(
                                                      child: Text(
                                                          'Error: ${snapshot.error}'));
                                                } else if (!snapshot.hasData) {
                                                  return Center(
                                                      child: Text(
                                                          'No order data found.'));
                                                } else {
                                                  final order = snapshot.data!;
                                                  return ListView(
                                                    padding:
                                                        EdgeInsets.all(16.0),
                                                    children: [
                                                      Text(
                                                        'Order #${order.orderId}',
                                                        style: TextStyle(
                                                            fontSize: 20,
                                                            fontWeight:
                                                                FontWeight
                                                                    .bold),
                                                      ),
                                                      SizedBox(height: 10),
                                                      Text(
                                                          'Total Price: Rs. ${order.totalPrice.toStringAsFixed(2)}'),
                                                      Text(
                                                          'Total Qty: ${order.totalItem}'),
                                                      Text(
                                                          'Order Date: ${order.orderDate.toString().substring(0, 10)}'),
                                                      SizedBox(height: 20),
                                                      Text(
                                                        'Products:',
                                                        style: TextStyle(
                                                            fontSize: 18,
                                                            fontWeight:
                                                                FontWeight
                                                                    .bold),
                                                      ),
                                                      ...order.products
                                                          .map((product) {
                                                        return ListTile(
                                                          title: Text(product
                                                              .productName),
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
                                                            fontSize: 18,
                                                            fontWeight:
                                                                FontWeight
                                                                    .bold),
                                                      ),
                                                      Text(
                                                          '${order.street}, ${order.area}, ${order.cityId}'),
                                                      Text(
                                                          'Floor/Door No: ${order.floorDoorNo}'),
                                                      Text(
                                                        'Contact :',
                                                        style: TextStyle(
                                                            fontSize: 20,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w600),
                                                      ),
                                                      Column(
                                                        crossAxisAlignment:
                                                            CrossAxisAlignment
                                                                .start,
                                                        children: [
                                                          order.mobileNumber
                                                                  .isNotEmpty
                                                              ? TextButton.icon(
                                                                  onPressed:
                                                                      () async {
                                                                    // Request CALL_PHONE permission
                                                                    PermissionStatus
                                                                        status =
                                                                        await Permission
                                                                            .phone
                                                                            .request();

                                                                    if (status
                                                                        .isGranted) {
                                                                      final Uri
                                                                          launchUri =
                                                                          Uri(
                                                                        scheme:
                                                                            'tel',
                                                                        path: order
                                                                            .mobileNumber,
                                                                      );
                                                                      try {
                                                                        await launchUrl(
                                                                            launchUri);
                                                                      } catch (e) {
                                                                        print(
                                                                            'Could not launch $launchUri');
                                                                      }
                                                                    } else {
                                                                      print(
                                                                          'Phone permission denied');
                                                                    }
                                                                  },
                                                                  icon: Icon(Icons
                                                                      .phone),
                                                                  label: Text(order
                                                                      .mobileNumber),
                                                                )
                                                              : Container(),
                                                          order.alternativeNumber
                                                                  .isNotEmpty
                                                              ? TextButton.icon(
                                                                  onPressed:
                                                                      () async {
                                                                    // Request CALL_PHONE permission
                                                                    PermissionStatus
                                                                        status =
                                                                        await Permission
                                                                            .phone
                                                                            .request();

                                                                    if (status
                                                                        .isGranted) {
                                                                      final Uri
                                                                          launchUri =
                                                                          Uri(
                                                                        scheme:
                                                                            'tel',
                                                                        path: order
                                                                            .alternativeNumber,
                                                                      );
                                                                      try {
                                                                        await launchUrl(
                                                                            launchUri);
                                                                      } catch (e) {
                                                                        print(
                                                                            'Could not launch $launchUri');
                                                                      }
                                                                    } else {
                                                                      print(
                                                                          'Phone permission denied');
                                                                    }
                                                                  },
                                                                  icon: Icon(Icons
                                                                      .phone),
                                                                  label: Text(order
                                                                      .alternativeNumber),
                                                                )
                                                              : Container(),
                                                        ],
                                                      ),
                                                      ElevatedButton.icon(
                                                        onPressed: () {
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
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Card(
                                child: Center(
                                    child: Text(order.orderId.toString()))),
                          ),
                        ),
                        DataCell(Center(child: Text(order.userName))),
                        DataCell(Center(
                            child: Text(
                                order.orderDate.toString().substring(0, 10)))),
                        DataCell(Center(
                            child: Text(
                          order.statusName,
                          style: TextStyle(
                            color: Colors.orange, // Blue for "Pending" status
                          ),
                        ))),
                      ],
                    );
                  }).toList(),
                ),
              );
            }
          },
        ),
      ),
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
