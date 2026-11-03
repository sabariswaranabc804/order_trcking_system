import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:map_launcher/map_launcher.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../API/api.dart';
import '../../Model/adm_orderdetails.dart';
import '../../Model/admgetallordermodel.dart';

class delivered extends StatefulWidget {
  const delivered({super.key});

  @override
  State<delivered> createState() => _deliveredState();
}

class _deliveredState extends State<delivered> {
  final getorderdetailsfunc apiService = getorderdetailsfunc();
  final Admorderdetailsfunc apiService2 = Admorderdetailsfunc();
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
                  .where((order) => order.statusName == "Completed")
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
                    DataColumn(label: Text('Order ID')),
                    DataColumn(label: Text('User Name')),
                    DataColumn(label: Text('Order Date')),
                    DataColumn(label: Text('Status')),
                    DataColumn(label: Text('Delivery Man')),
                  ],
                  rows: orders.map((order) {
                    return DataRow(
                      cells: [
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
                                                      order.orderStatusId ==
                                                                  3 ||
                                                              order.orderStatusId ==
                                                                  5 ||
                                                              order.orderStatusId ==
                                                                  6
                                                          ? Text(
                                                              'Deliveryman: ${order.deliverymanName} (${order.contact})')
                                                          : Container(),
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
                            color: Colors.green, // Blue for "Pending" status
                          ),
                        ))),
                        DataCell(Center(
                            child: Text(order.deliverymanName.toString()))),
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
      List<Location> locations = await locationFromAddress(address);

      if (locations.isNotEmpty) {
        final location = locations.first;

        // Get the list of installed map applications
        final availableMaps = await MapLauncher.installedMaps;

        if (availableMaps.isNotEmpty) {
          // Find Google Maps from the installed map apps
          final googleMaps = availableMaps.firstWhere(
                  (map) => map.mapType == MapType.google,
              orElse: () => throw 'Google Maps not available on this device.'
          );

          // Show the marker on Google Maps at the correct location
          await googleMaps.showMarker(
            title: address,
            coords: Coords(location.latitude, location.longitude),
          );
        } else {
          throw 'No map applications found on the device.';
        }
      } else {
        throw 'Could not find location for the address.';
      }
    } catch (e) {
      print('Error: $e');
    }
  }
}
