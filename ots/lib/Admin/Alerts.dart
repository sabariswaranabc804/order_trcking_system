import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart'; // Import the provider package
import 'package:http/http.dart' as http;

import '../API/api.dart';
import '../Model/admgetallordermodel.dart';

class paymentys extends StatefulWidget {
  const paymentys({super.key});

  @override
  State<paymentys> createState() => _paymentysState();
}

class _paymentysState extends State<paymentys> {
  final getorderdetailsfunc apiService = getorderdetailsfunc();
  DateTime? startDate;
  DateTime? endDate;
  String? statusFilter; // Variable for status filtering

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

  Future<void> _refreshData() async {
    await Future.delayed(Duration(seconds: 1)); // Simulate network request
    setState(() {
      startDate = null; // Reset start date
      endDate = null; // Reset end date
      statusFilter = null; // Reset status filter
    });
    apiService.getorderdetailsfunction(); // Refresh data
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
      appBar: AppBar(
        title: Text("Payments"),
      ),
      body: Column(
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
                  final nonCancelledOrders = orders
                      .where((order) => order.statusName != "User Cancelled")
                      .toList();
                  final cancelledOrders = orders
                      .where((order) => order.statusName == "User Cancelled")
                      .toList();

                  // Calculate totals for each payment type and status
                  int countByPaymentType(String type) => nonCancelledOrders
                      .where((order) => order.payment == type)
                      .length;
                  double totalByPaymentType(String type) => nonCancelledOrders
                      .where((order) => order.payment == type)
                      .fold(
                          0.0, (sum, order) => sum + (order.totalPrice ?? 0.0));

                  final codCount = countByPaymentType("offline");
                  final onlineCount = countByPaymentType("online");
                  final paidCount = countByPaymentType("paid");
                  final codTotal = totalByPaymentType("offline");
                  final onlineTotal = totalByPaymentType("online");
                  final paidTotal = totalByPaymentType("paid");

                  // Calculate user cancelled orders count and total amount
                  final cancelledCount = cancelledOrders.length;
                  final cancelledTotal = cancelledOrders.fold(
                      0.0, (sum, order) => sum + (order.totalPrice ?? 0.0));

                  // Calculate overall total orders and amount
                  final totalOrders = orders.length;
                  final totalAmount = orders.fold(
                      0.0, (sum, order) => sum + (order.totalPrice ?? 0.0));

                  return Column(
                    children: [
                      // Status Filter Dropdown and Order Count Display

                      // Display overall total orders and amount
                      Expanded(
                        child: FutureBuilder<List<Admorderdetailsmodel>>(
                          future: apiService.getorderdetailsfunction(),
                          builder: (context, snapshot) {
                            if (snapshot.connectionState ==
                                ConnectionState.waiting) {
                              return Center(child: CircularProgressIndicator());
                            } else if (snapshot.hasError) {
                              return Center(
                                  child: Text('Error: ${snapshot.error}'));
                            } else if (!snapshot.hasData ||
                                snapshot.data!.isEmpty) {
                              return Center(child: Text('No orders found.'));
                            } else {
                              final orders =
                                  filterOrdersByDateRange(snapshot.data!);
                              final nonCancelledOrders = orders
                                  .where((order) =>
                                      order.statusName != "User Cancelled")
                                  .toList();
                              final cancelledOrders = orders
                                  .where((order) =>
                                      order.statusName == "User Cancelled")
                                  .toList();

                              // Helper functions to calculate counts and totals for specific payment types, ignoring null payments
                              int countByPaymentType(String type) =>
                                  nonCancelledOrders
                                      .where((order) => order.payment == type)
                                      .length;
                              double totalByPaymentType(String type) =>
                                  nonCancelledOrders
                                      .where((order) => order.payment == type)
                                      .fold(
                                          0.0,
                                          (sum, order) =>
                                              sum + (order.totalPrice ?? 0.0));

                              final codCount = countByPaymentType("offline");
                              final onlineCount = countByPaymentType("online");
                              final paidCount = countByPaymentType("paid");
                              final codTotal = totalByPaymentType("offline");
                              final onlineTotal = totalByPaymentType("online");
                              final paidTotal = totalByPaymentType("paid");

                              // Calculate user-cancelled orders count and total amount by payment type
                              int cancelledCountByPaymentType(String type) =>
                                  cancelledOrders
                                      .where((order) => order.payment == type)
                                      .length;
                              double cancelledTotalByPaymentType(String type) =>
                                  cancelledOrders
                                      .where((order) => order.payment == type)
                                      .fold(
                                          0.0,
                                          (sum, order) =>
                                              sum + (order.totalPrice ?? 0.0));

                              final cancelledCodCount =
                                  cancelledCountByPaymentType("offline");
                              final cancelledOnlineCount =
                                  cancelledCountByPaymentType("online");
                              final cancelledPaidCount =
                                  cancelledCountByPaymentType("paid");
                              final cancelledCodTotal =
                                  cancelledTotalByPaymentType("offline");
                              final cancelledOnlineTotal =
                                  cancelledTotalByPaymentType("online");
                              final cancelledPaidTotal =
                                  cancelledTotalByPaymentType("paid");

                              // Calculate overall total orders and amount, including those with null payments
                              final totalOrders = orders.length;
                              final totalAmount = orders.fold(
                                  0.0,
                                  (sum, order) =>
                                      sum + (order.totalPrice ?? 0.0));

                              return Column(
                                children: [
                                  // Status Filter Dropdown and Order Count Display
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
                                            "Completed",
                                            "Ready to Pick",
                                            "Pick",
                                            "Ready to Drop",
                                            "Pending",
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
                                        'Filtered Orders Count: ${nonCancelledOrders.length}',
                                        style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                  // Display overall total orders and amount
                                  Expanded(
                                    child: ListView(
                                      children: [
                                        ListTile(
                                          title: Text("Total Orders"),
                                          subtitle: Text(
                                              "Total Number of Orders: $totalOrders"),
                                          trailing: Text(
                                              "Total Amount: Rs.${totalAmount.toStringAsFixed(2)}"),
                                        ),
                                        ListTile(
                                          title: Text("COD Payments"),
                                          subtitle:
                                              Text("Total Orders: $codCount"),
                                          trailing: Text(
                                              "Total Amount: Rs.${codTotal.toStringAsFixed(2)}"),
                                        ),
                                        ListTile(
                                          title: Text("Online Payments"),
                                          subtitle: Text(
                                              "Total Orders: $onlineCount"),
                                          trailing: Text(
                                              "Total Amount: Rs.${onlineTotal.toStringAsFixed(2)}"),
                                        ),
                                        ListTile(
                                          title: Text("Paid Payments"),
                                          subtitle:
                                              Text("Total Orders: $paidCount"),
                                          trailing: Text(
                                              "Total Amount: Rs.${paidTotal.toStringAsFixed(2)}"),
                                        ),
                                        ListTile(
                                          title: Text("User Cancelled Orders"),
                                          subtitle: Text(
                                              "Total Orders: ${cancelledOrders.length}"),
                                          trailing: Text(
                                              "Total Amount: Rs.${cancelledOrders.fold(0.0, (sum, order) => sum + (order.totalPrice ?? 0.0)).toStringAsFixed(2)}"),
                                        ),
                                        ListTile(
                                          title: Text(
                                              "User Cancelled COD Payments"),
                                          subtitle: Text(
                                              "Total Orders: $cancelledCodCount"),
                                          trailing: Text(
                                              "Total Amount: Rs.${cancelledCodTotal.toStringAsFixed(2)}"),
                                        ),
                                        ListTile(
                                          title: Text(
                                              "User Cancelled Online Payments"),
                                          subtitle: Text(
                                              "Total Orders: $cancelledOnlineCount"),
                                          trailing: Text(
                                              "Total Amount: Rs.${cancelledOnlineTotal.toStringAsFixed(2)}"),
                                        ),
                                        ListTile(
                                          title: Text(
                                              "User Cancelled Paid Payments"),
                                          subtitle: Text(
                                              "Total Orders: $cancelledPaidCount"),
                                          trailing: Text(
                                              "Total Amount: Rs.${cancelledPaidTotal.toStringAsFixed(2)}"),
                                        ),
                                      ],
                                    ),
                                  ),
                                  // DataTable displaying individual order details
                                ],
                              );
                            }
                          },
                        ),
                      )

                      // DataTable displaying individual order details
                    ],
                  );
                }
              },
            ),
          )
        ],
      ),
    );
  }
}
