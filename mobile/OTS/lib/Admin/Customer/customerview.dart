import 'package:flutter/material.dart';
import 'package:ots/Admin/Customer/customer.dart';

import '../../API/api.dart';
import '../../Model/customerget.dart';
// Import your UserService class here

class CustomerDataTable extends StatefulWidget {
  @override
  _CustomerDataTableState createState() => _CustomerDataTableState();
}

class _CustomerDataTableState extends State<CustomerDataTable> {
  List<Customer> _customers = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCustomers();
  }

  Future<void> _fetchCustomers() async {
    final userService = UserService();
    try {
      List<Customer> customers = await userService.fetchUsers();
      setState(() {
        _customers = customers;
        _isLoading = false;
      });
    } catch (e) {
      print("Error fetching customers: $e");
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Customer Data"),
        actions: [
          IconButton(
              onPressed: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => addcustomer()));
              },
              icon: Icon(
                Icons.person_add_alt_1_rounded,
                color: Colors.red,
              ))
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              scrollDirection: Axis.horizontal, // To handle wide tables
              child: SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: DataTable(
                  columnSpacing: 15,
                  columns: [
                    DataColumn(label: Text("ID")),
                    DataColumn(label: Text("Code")),
                    DataColumn(label: Text("Name")),

                    DataColumn(label: Text("Mobile")),
                    DataColumn(label: Text("Email")),
                    // Add more columns as needed for other properties
                  ],
                  rows: _customers.map((customer) {
                    return DataRow(cells: [
                      DataCell(Text(customer.userId.toString())),
                      DataCell(Text(customer.userCode)),
                      DataCell(Text(customer.userName)),

                      DataCell(Text(customer.mobileNumber ?? 'N/A')),
                      DataCell(Text(customer.emailId ?? 'N/A')),
                      // Add more cells as needed for other properties
                    ]);
                  }).toList(),
                ),
              ),
            ),
    );
  }
}
