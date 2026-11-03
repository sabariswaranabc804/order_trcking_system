import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../API/api.dart';
import '../Admin/qrcode.dart';
import '../Model/orderproductmodel.dart';

class Orderprocessmodel {
  final Order order;
  final List<Product> products;

  Orderprocessmodel({required this.order, required this.products});

  factory Orderprocessmodel.fromJson(Map<String, dynamic> json) {
    print('Order details response: $json'); // Log the raw response

    return Orderprocessmodel(
      order: Order.fromJson(json['order']),
      products: (json['products'] as List<dynamic>)
          .map((product) => Product.fromJson(product))
          .toList(),
    );
  }
}

class ordersdetails extends StatefulWidget {
  final int orderid;
  final String total;
  const ordersdetails({super.key, required this.orderid, required this.total});

  @override
  State<ordersdetails> createState() => _ordersdetailsState();
}

class _ordersdetailsState extends State<ordersdetails> {
  late Future<Orderprocessmodel> futureOrderDetails;
  final OrderService orderService = OrderService();

  @override
  void initState() {
    super.initState();
    futureOrderDetails = orderService.fetchOrderDetails(widget.orderid);
  }

  String gpay = "9159079191";
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: Icon(
            Icons.arrow_back,
            color: Colors.black,
          ),
        ),
        title: Text(
          "Your Orders",
          style: TextStyle(color: Colors.black),
        ),
      ),
      body: FutureBuilder<Orderprocessmodel>(
        future: futureOrderDetails,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data == null) {
            return Center(child: Text('No data available.'));
          }

          final orderData = snapshot.data!;
          final order = orderData.order;
          final products = orderData.products;

          return Stack(
            children: [
              SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 100.0),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Products:',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        ...products.map((product) {
                          return ListTile(
                            title: Text(product.productName),
                            subtitle: Text(
                                'Quantity: ${product.quantity}\nService: ${product.category_name}'),
                            trailing: Text(
                                'Total: Rs.${product.totalPrice.toStringAsFixed(2)}'), // Ensure it's displayed as a double
                          );
                        }).toList(),
                        Divider(),
                        ListTile(
                          title: Text('Total Amount'),
                          trailing: Text(
                            widget.total,
                            style: TextStyle(fontSize: 14),
                          ),
                        ),
                        Divider(),
                        order.orderStatusId == 1
                            ? Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceEvenly,
                                children: [
                                  CircleAvatar(
                                    backgroundColor: Colors.green,
                                    child: ColorFiltered(
                                      colorFilter: ColorFilter.mode(
                                        Colors
                                            .white, // Apply a white color filter
                                        BlendMode
                                            .srcATop, // Blend mode to apply the color
                                      ),
                                      child: Padding(
                                        padding: const EdgeInsets.all(7.5),
                                        child: Image(
                                          image:
                                              AssetImage("assets/booking.png"),
                                        ),
                                      ),
                                    ),
                                  ),
                                  Icon(Icons.linear_scale_sharp),
                                  CircleAvatar(
                                    child: Padding(
                                      padding: const EdgeInsets.all(6.0),
                                      child: Image(
                                        image: AssetImage("assets/shipped.png"),
                                      ),
                                    ),
                                  ),
                                  Icon(Icons.linear_scale_sharp),
                                  CircleAvatar(
                                    child: Padding(
                                      padding: const EdgeInsets.all(4.0),
                                      child: Image(
                                        image:
                                            AssetImage("assets/transport.png"),
                                      ),
                                    ),
                                  ),
                                  Icon(Icons.linear_scale_sharp),
                                  CircleAvatar(
                                    child: Padding(
                                      padding: const EdgeInsets.all(5.0),
                                      child: Image(
                                        image: AssetImage("assets/receipt.png"),
                                      ),
                                    ),
                                  ),
                                ],
                              )
                            : order.orderStatusId == 3 ||
                                    order.orderStatusId == 2
                                ? Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceEvenly,
                                    children: [
                                      CircleAvatar(
                                        backgroundColor: Colors.green,
                                        child: ColorFiltered(
                                          colorFilter: ColorFilter.mode(
                                            Colors
                                                .white, // Apply a white color filter
                                            BlendMode
                                                .srcATop, // Blend mode to apply the color
                                          ),
                                          child: Padding(
                                            padding: const EdgeInsets.all(7.5),
                                            child: Image(
                                              image: AssetImage(
                                                  "assets/booking.png"),
                                            ),
                                          ),
                                        ),
                                      ),
                                      Icon(Icons.linear_scale_sharp),
                                      CircleAvatar(
                                        backgroundColor: Colors.green,
                                        child: ColorFiltered(
                                          colorFilter: ColorFilter.mode(
                                            Colors
                                                .white, // Apply a white color filter
                                            BlendMode
                                                .srcATop, // Blend mode to apply the color
                                          ),
                                          child: Padding(
                                            padding: const EdgeInsets.all(6.0),
                                            child: Image(
                                              image: AssetImage(
                                                  "assets/shipped.png"),
                                            ),
                                          ),
                                        ),
                                      ),
                                      Icon(Icons.linear_scale_sharp),
                                      CircleAvatar(
                                        child: Padding(
                                          padding: const EdgeInsets.all(4.0),
                                          child: Image(
                                            image: AssetImage(
                                                "assets/transport.png"),
                                          ),
                                        ),
                                      ),
                                      Icon(Icons.linear_scale_sharp),
                                      CircleAvatar(
                                        child: Padding(
                                          padding: const EdgeInsets.all(5.0),
                                          child: Image(
                                            image: AssetImage(
                                                "assets/receipt.png"),
                                          ),
                                        ),
                                      ),
                                    ],
                                  )
                                : order.orderStatusId == 5 ||
                                        order.orderStatusId == 4
                                    ? Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceEvenly,
                                        children: [
                                          CircleAvatar(
                                            backgroundColor: Colors.green,
                                            child: ColorFiltered(
                                              colorFilter: ColorFilter.mode(
                                                Colors
                                                    .white, // Apply a white color filter
                                                BlendMode
                                                    .srcATop, // Blend mode to apply the color
                                              ),
                                              child: Padding(
                                                padding:
                                                    const EdgeInsets.all(7.5),
                                                child: Image(
                                                  image: AssetImage(
                                                      "assets/booking.png"),
                                                ),
                                              ),
                                            ),
                                          ),
                                          Icon(Icons.linear_scale_sharp),
                                          CircleAvatar(
                                            backgroundColor: Colors.green,
                                            child: ColorFiltered(
                                              colorFilter: ColorFilter.mode(
                                                Colors
                                                    .white, // Apply a white color filter
                                                BlendMode
                                                    .srcATop, // Blend mode to apply the color
                                              ),
                                              child: Padding(
                                                padding:
                                                    const EdgeInsets.all(7.5),
                                                child: Image(
                                                  image: AssetImage(
                                                      "assets/shipped.png"),
                                                ),
                                              ),
                                            ),
                                          ),
                                          Icon(Icons.linear_scale_sharp),
                                          CircleAvatar(
                                            backgroundColor: Colors.green,
                                            child: ColorFiltered(
                                              colorFilter: ColorFilter.mode(
                                                Colors
                                                    .white, // Apply a white color filter
                                                BlendMode
                                                    .srcATop, // Blend mode to apply the color
                                              ),
                                              child: Padding(
                                                padding:
                                                    const EdgeInsets.all(4.0),
                                                child: Image(
                                                  image: AssetImage(
                                                      "assets/transport.png"),
                                                ),
                                              ),
                                            ),
                                          ),
                                          Icon(Icons.linear_scale_sharp),
                                          CircleAvatar(
                                            child: Padding(
                                              padding:
                                                  const EdgeInsets.all(5.0),
                                              child: Image(
                                                image: AssetImage(
                                                    "assets/receipt.png"),
                                              ),
                                            ),
                                          ),
                                        ],
                                      )
                                    : order.orderStatusId == 6
                                        ? Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceEvenly,
                                            children: [
                                              CircleAvatar(
                                                backgroundColor: Colors.green,
                                                child: ColorFiltered(
                                                  colorFilter: ColorFilter.mode(
                                                    Colors
                                                        .white, // Apply a white color filter
                                                    BlendMode
                                                        .srcATop, // Blend mode to apply the color
                                                  ),
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            7.5),
                                                    child: Image(
                                                      image: AssetImage(
                                                          "assets/booking.png"),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Icon(Icons.linear_scale_sharp),
                                              CircleAvatar(
                                                backgroundColor: Colors.green,
                                                child: ColorFiltered(
                                                  colorFilter: ColorFilter.mode(
                                                    Colors
                                                        .white, // Apply a white color filter
                                                    BlendMode
                                                        .srcATop, // Blend mode to apply the color
                                                  ),
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            6.0),
                                                    child: Image(
                                                      image: AssetImage(
                                                          "assets/shipped.png"),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Icon(Icons.linear_scale_sharp),
                                              CircleAvatar(
                                                backgroundColor: Colors.green,
                                                child: ColorFiltered(
                                                  colorFilter: ColorFilter.mode(
                                                    Colors
                                                        .white, // Apply a white color filter
                                                    BlendMode
                                                        .srcATop, // Blend mode to apply the color
                                                  ),
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            4.0),
                                                    child: Image(
                                                      image: AssetImage(
                                                          "assets/transport.png"),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Icon(Icons.linear_scale_sharp),
                                              CircleAvatar(
                                                backgroundColor: Colors.green,
                                                child: ColorFiltered(
                                                  colorFilter: ColorFilter.mode(
                                                    Colors
                                                        .white, // Apply a white color filter
                                                    BlendMode
                                                        .srcATop, // Blend mode to apply the color
                                                  ),
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            5.0),
                                                    child: Image(
                                                      image: AssetImage(
                                                          "assets/receipt.png"),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          )
                                        : Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceEvenly,
                                            children: [
                                              CircleAvatar(
                                                backgroundColor: Colors.red,
                                                child: ColorFiltered(
                                                  colorFilter: ColorFilter.mode(
                                                    Colors
                                                        .white, // Apply a white color filter
                                                    BlendMode
                                                        .srcATop, // Blend mode to apply the color
                                                  ),
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            7.5),
                                                    child: Image(
                                                      image: AssetImage(
                                                          "assets/booking.png"),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Icon(Icons.linear_scale_sharp),
                                              CircleAvatar(
                                                backgroundColor: Colors.red,
                                                child: ColorFiltered(
                                                  colorFilter: ColorFilter.mode(
                                                    Colors
                                                        .white, // Apply a white color filter
                                                    BlendMode
                                                        .srcATop, // Blend mode to apply the color
                                                  ),
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            6.0),
                                                    child: Image(
                                                      image: AssetImage(
                                                          "assets/shipped.png"),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Icon(Icons.linear_scale_sharp),
                                              CircleAvatar(
                                                backgroundColor: Colors.red,
                                                child: ColorFiltered(
                                                  colorFilter: ColorFilter.mode(
                                                    Colors
                                                        .white, // Apply a white color filter
                                                    BlendMode
                                                        .srcATop, // Blend mode to apply the color
                                                  ),
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            4.0),
                                                    child: Image(
                                                      image: AssetImage(
                                                          "assets/transport.png"),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Icon(Icons.linear_scale_sharp),
                                              CircleAvatar(
                                                backgroundColor: Colors.red,
                                                child: ColorFiltered(
                                                  colorFilter: ColorFilter.mode(
                                                    Colors
                                                        .white, // Apply a white color filter
                                                    BlendMode
                                                        .srcATop, // Blend mode to apply the color
                                                  ),
                                                  child: Padding(
                                                    padding:
                                                        const EdgeInsets.all(
                                                            5.0),
                                                    child: Image(
                                                      image: AssetImage(
                                                          "assets/receipt.png"),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Row(
                            children: [
                              Text(
                                "Status : ",
                                style: TextStyle(
                                    fontWeight: FontWeight.w500, fontSize: 15),
                              ),
                              order.orderStatusId == 1
                                  ? Text(
                                      "Order Placed",
                                      style: TextStyle(color: Colors.green),
                                    )
                                  : order.orderStatusId == 2
                                      ? Text(
                                          "Ready To Pick Up your Order",
                                          style: TextStyle(color: Colors.green),
                                        )
                                      : order.orderStatusId == 3
                                          ? Text(
                                              "Order Picked",
                                              style: TextStyle(
                                                  color: Colors.green),
                                            )
                                          : order.orderStatusId == 4
                                              ? Text(
                                                  "Ready To Drop your Orders",
                                                  style: TextStyle(
                                                      color: Colors.green),
                                                )
                                              : order.orderStatusId == 5
                                                  ? Text(
                                                      "Drop your Orders",
                                                      style: TextStyle(
                                                          color: Colors.green),
                                                    )
                                                  : order.orderStatusId == 6
                                                      ? Text(
                                                          "Order Delivered",
                                                          style: TextStyle(
                                                              color:
                                                                  Colors.green),
                                                        )
                                                      : Text(
                                                          "Order Cancelled",
                                                          style: TextStyle(
                                                              color:
                                                                  Colors.red),
                                                        ),
                            ],
                          ),
                        ),
                        Divider(),
                        Text(
                          'Order ID: ${order.orderId}',
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        Text(
                            'Order Date: ${order.orderDate.toString().substring(0, 10)}'),
                        Text('City: ${order.cityId}'),
                        Text('Area: ${order.area}'),
                        Text('Street: ${order.street}'),
                        Text('Floor/Door No: ${order.floorDoorNo}'),
                        Text('Address Type: ${order.addressType}'),
                        order.orderStatusId == 3 || order.orderStatusId == 5
                            ? Text('Deliveryman: ${order.deliverymanName}')
                            : Text(""),
                        order.orderStatusId == 3 || order.orderStatusId == 5
                            ? Row(
                                children: [
                                  Text(
                                    'Contact :',
                                    style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w600),
                                  ),
                                  TextButton.icon(
                                    onPressed: () async {
                                      // Request CALL_PHONE permission
                                      PermissionStatus status =
                                          await Permission.phone.request();

                                      if (status.isGranted) {
                                        final Uri launchUri = Uri(
                                          scheme: 'tel',
                                          path: order.contact,
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
                                    label: Text(order.contact),
                                  ),
                                ],
                              )
                            : Text(""),
                      ],
                    ),
                  ),
                ),
              ),
              // Container(
              //   height: 200,
              //   child: UpiQrCode(
              //     amount: double.parse(widget.total),
              //     orderId: widget.orderid.toString(),
              //   ),
              // ),
              // Align(
              //   alignment: Alignment.bottomCenter,
              //   child: Container(
              //     color: Colors.white,
              //     padding: EdgeInsets.symmetric(vertical: 20, horizontal: 16),
              //     child: ElevatedButton(
              //       onPressed: () {
              //         // Button action here
              //         print('Order confirmed');
              //       },
              //       style: ElevatedButton.styleFrom(
              //         backgroundColor: Colors.orangeAccent, // Button color
              //         minimumSize:
              //             Size(double.infinity, 50), // Full-width button
              //       ),
              //       child: Text(
              //         'Deleivery Here',
              //         style: TextStyle(fontSize: 16),
              //       ),
              //     ),
              //   ),
              // ),
            ],
          );
        },
      ),
    );
  }

  Future<Uint8List> loadImage(String path) async {
    final ByteData bytes = await rootBundle.load(path);
    return bytes.buffer.asUint8List();
  }
}
