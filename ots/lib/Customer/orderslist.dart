import 'dart:async';

import 'package:flutter/material.dart';

import '../API/api.dart';
import '../Model/totalorderlistmodel.dart';
import 'ordersdetails.dart';

class OrderProcess extends StatefulWidget {
  final String UserId;
  const OrderProcess({super.key, required this.UserId});

  @override
  State<OrderProcess> createState() => _OrderProcessState();
}

class _OrderProcessState extends State<OrderProcess> {
  late Future<OrderList> futureOrderList;
  final OrderlistService orderService = OrderlistService();

  @override
  void initState() {
    super.initState();
    futureOrderList = orderService.fetchOrders(widget.UserId);
    _startAutoReload();
  }

  Timer? _timer;
  @override
  void dispose() {
    _timer?.cancel(); // Dispose of the controller when not needed
    super.dispose();
  }

  void _startAutoReload() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        futureOrderList = orderService.fetchOrders(widget.UserId);
      });
    });
  }

  final setcomplete _orderService1 = setcomplete();
  bool _isLoading = false;
  final cancel _orderService = cancel();

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
      body: FutureBuilder<OrderList>(
        future: futureOrderList,
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            // Log the error and show a message or dialog
            print("Error: ${snapshot.error}");
            return Center(child: Text("No addresses found"));
          } else if (snapshot.hasData) {
            final orders = snapshot.data?.orders;

            if (orders == null || orders.isEmpty) {
              // No orders found
              return Center(child: Text("No addresses found"));
            }

            return ListView.builder(
              itemCount: orders.length,
              itemBuilder: (context, index) {
                final order = orders[index];
                return Card(
                    elevation: 2,
                    margin: EdgeInsets.symmetric(vertical: 10, horizontal: 16),
                    child: ListTile(
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => ordersdetails(
                                        orderid: order.orderId,
                                        total: order.totalPrice.toString(),
                                      )));
                        },
                        title: Text('Order ID: ${order.orderId}'),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                                'Order Date: ${order.orderDate.toString().substring(0, 10)}'),
                            Text(
                                'Total Price: Rs.${order.totalPrice.toStringAsFixed(2)}'),
                          ],
                        ),
                        trailing: order.orderStatusId == 6
                            ? Text(
                                "Delivered",
                                style: TextStyle(
                                  color: Color(0xFF1B5E20),
                                ),
                              )
                            : order.orderStatusId == 2 ||
                                    order.orderStatusId == 1
                                ? ElevatedButton(
                                    onPressed: () async {
                                      setState(() {
                                        _isLoading = true;
                                      });

                                      await _orderService
                                          .cancelfunc(order.orderId.toString());

                                      setState(() {
                                        _isLoading = false;
                                      });
                                    },
                                    child: Text("Cancel"),
                                  )
                                : order.orderStatusId == 5
                                    ? ElevatedButton(
                                        onPressed: () {
                                          showDialog(
                                            context: context,
                                            builder: (BuildContext context) {
                                              return AlertDialog(
                                                title: Text("Order Status"),
                                                content: Text(
                                                    "Have you confirmed that your order delivered?"),
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
                                                      setState(() {
                                                        _isLoading = true;
                                                      });

                                                      await _orderService1
                                                          .setcompletefunc(order
                                                              .orderId
                                                              .toString());

                                                      setState(() {
                                                        _isLoading = false;
                                                      });
                                                      Navigator.pop(context);
                                                    },
                                                    child: Text("OK"),
                                                  ),
                                                ],
                                              );
                                            },
                                          );
                                        },
                                        child: Text("Delivery"))
                                    : order.orderStatusId == 5
                                        ? Text("Delivered")
                                        : Text("")));
              },
            );
          } else {
            // Handle any other unexpected state
            return Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }
}
