import 'dart:async';
import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:http/http.dart' as http;
import '../../API/api.dart';
import '../../Model/anchorgetdteills.dart';
import '../../main.dart';
import 'createanchorpage.dart';

class view_anchor extends StatefulWidget {
  final int companyid;
  const view_anchor({super.key, required this.companyid});

  @override
  State<view_anchor> createState() => _view_anchorState();
}

class _view_anchorState extends State<view_anchor> {
  List<DeliveryMan> deliveryMen = [];

  @override
  void initState() {
    super.initState();
    fetchDeliveryMen(widget.companyid);
    _startAutoReload();
  }

  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel(); // Cancel the timer when disposing the widget
    super.dispose();
  }

  void _startAutoReload() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        fetchDeliveryMen(widget.companyid); // Update the Future to refresh data
      });
    });
  }

  // Fetching delivery men data from the API
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

  Future<void> _showEditDialog(DeliveryMan deliveryMan) async {
    TextEditingController nameController =
        TextEditingController(text: deliveryMan.deliverymanName);
    TextEditingController contactController =
        TextEditingController(text: deliveryMan.contact);
    TextEditingController alternativeNumberController =
        TextEditingController(text: deliveryMan.alternativeNumber);
    TextEditingController emailController =
        TextEditingController(text: deliveryMan.email);
    TextEditingController cityController =
        TextEditingController(text: deliveryMan.city);
    TextEditingController addressController =
        TextEditingController(text: deliveryMan.address);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Edit Delivery Man"),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                    controller: nameController,
                    decoration: InputDecoration(labelText: "Name")),
                TextField(
                    controller: contactController,
                    decoration: InputDecoration(labelText: "Contact")),
                TextField(
                    controller: alternativeNumberController,
                    decoration:
                        InputDecoration(labelText: "AlternativeNumber")),
                TextField(
                    controller: emailController,
                    decoration: InputDecoration(labelText: "Email")),
                TextField(
                    controller: cityController,
                    decoration: InputDecoration(labelText: "City")),
                TextField(
                    controller: addressController,
                    decoration: InputDecoration(labelText: "Address")),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(), // Close dialog
              child: Text("Cancel"),
            ),
            TextButton(
              onPressed: () {
                setState(() async {
                  await _editDeliveryMan(
                      deliveryMan.deliverymanId,
                      nameController.text,
                      contactController.text,
                      emailController.text,
                      cityController.text,
                      addressController.text,
                      alternativeNumberController.text);
                  Navigator.of(context).pop();
                });

                // Close dialog
              },
              child: Text("Save"),
            ),
          ],
        );
      },
    );
  }

  int anchorcount = 0;

  Future<void> _editDeliveryMan(
      int deliverymanId,
      String userName, // Updated from name to userName
      String mobileNumber, // Updated from contact to mobileNumber
      String emailID, // Updated from email to emailID
      String city,
      String address,
      String alternativeNumber // Added alternativeNumber parameter
      ) async {
    setState(() => _isLoading = true);

    // Input validation
    if (userName.isEmpty ||
        mobileNumber.isEmpty ||
        emailID.isEmpty ||
        city.isEmpty ||
        address.isEmpty ||
        alternativeNumber.isEmpty) {
      // Show an error message or dialog if any field is empty
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("Validation Error"),
            content: Text("All fields are required."),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text("OK"),
              ),
            ],
          );
        },
      );
      setState(() => _isLoading = false);
      return; // Exit early if validation fails
    }

    try {
      final response = await http.put(
        Uri.parse('http://$api/api/deliveryman/edit/$deliverymanId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        },
        body: jsonEncode({
          'user_Name': userName, // Use the new field names
          'mobile_Number': mobileNumber,
          'email_ID': emailID,
          'city': city,
          'address': address,
          'alternativeNumber': alternativeNumber // Added to the request body
        }),
      );

      if (response.statusCode == 200) {
        print('Anchor edited successfully');
      } else {
        print('Failed to update order: ${response.statusCode}');
        print('Response body: ${response.body}');
      }
    } catch (error) {
      print('Error editing anchor: $error');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  final anchordelete removeanchor = anchordelete();
  bool _isLoading = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Anchor Details"),
          actions: [
            // IconButton(
            //     onPressed: () {
            //       Navigator.push(context,
            //           MaterialPageRoute(builder: (context) => salarydetails()));
            //     },
            //     icon: Icon(Icons.payments_outlined))
          ],
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Card(
                  elevation: 10,
                  child: Container(
                    //     height: 180,
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Text(
                          //   'Today Status',
                          //   style: TextStyle(
                          //     fontSize: 20.0,
                          //     fontWeight: FontWeight.bold,
                          //     //color:Color(0xffFF5F00)
                          //   ),
                          // ),
                          // ListTile(
                          //   leading: Icon(
                          //     CupertinoIcons.person_2,
                          //     color: Color(0xffFF7D29),
                          //   ),
                          //   title: Text(
                          //     "Available people",
                          //     style: TextStyle(fontWeight: FontWeight.bold),
                          //   ),
                          //   trailing: Text(deliveryMen.length.toString()),
                          // ),
                          ListTile(
                            leading: Icon(
                              CupertinoIcons.person_2_alt,
                              color: Color(0xff007F73),
                            ),
                            title: Text(
                              "Total Anchors",
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            trailing: Text(
                              deliveryMen.length.toString(),
                              style: TextStyle(fontSize: 15),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              // Padding(
              //   padding: const EdgeInsets.all(8.0),
              //   child: SizedBox(
              //     height: 50,
              //     child: TextField(
              //       cursorColor: Colors.grey,
              //       decoration: InputDecoration(
              //           fillColor: Color(0xFFFFE0B2),
              //           filled: true,
              //           border: OutlineInputBorder(
              //             borderRadius: BorderRadius.circular(10),
              //             borderSide: BorderSide.none,
              //           ),
              //           hintText: 'Search by name or ID',
              //           hintStyle: TextStyle(
              //               color: Colors.grey, height: 1, fontSize: 18),
              //           prefixIcon: Icon(
              //             Icons.search,
              //             color: Colors.grey,
              //           )),
              //     ),z
              //   ),
              // ),
              SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: deliveryMen.isEmpty
                    ? Center(child: CircularProgressIndicator())
                    : SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Padding(
                          padding: const EdgeInsets.only(bottom: 50),
                          child: DataTable(
                            columnSpacing: 15,
                            columns: const <DataColumn>[
                              DataColumn(label: Text('ID')),
                              DataColumn(label: Text('Name')),
                              DataColumn(label: Text('Contact')),
                              DataColumn(label: Text('Email')),
                              DataColumn(label: Text('Status')),
                              DataColumn(label: Text('Alt. Number')),
                              DataColumn(label: Text('City')),
                              DataColumn(label: Text('Address')),
                              DataColumn(label: Text('Remove')),
                              DataColumn(label: Text('Remove')),
                            ],
                            rows: deliveryMen
                                .map((deliveryMan) => DataRow(cells: [
                                      DataCell(Text(deliveryMan.deliverymanId
                                          .toString())),
                                      DataCell(
                                          Text(deliveryMan.deliverymanName)),
                                      DataCell(Text(deliveryMan.contact)),
                                      DataCell(Text(deliveryMan.email)),
                                      DataCell(Text(deliveryMan.status)),
                                      DataCell(
                                          Text(deliveryMan.alternativeNumber)),
                                      DataCell(Text(deliveryMan.city)),
                                      DataCell(Text(deliveryMan.address)),
                                      DataCell(
                                        IconButton(
                                          icon: Icon(Icons.edit,
                                              color: Colors.blue),
                                          onPressed: () =>
                                              _showEditDialog(deliveryMan),
                                        ),
                                      ),
                                      DataCell(IconButton(
                                        onPressed: () async {
                                          showDialog(
                                            context: context,
                                            builder: (BuildContext context) {
                                              return AlertDialog(
                                                title: Text("Delete Account"),
                                                content: Text(
                                                    "Are you sure you want to delete ${deliveryMan.deliverymanName}'s account?"),
                                                actions: [
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

                                                      await removeanchor
                                                          .anchordeletefunc(
                                                              deliveryMan
                                                                  .deliverymanId
                                                                  .toString());

                                                      setState(() {
                                                        _isLoading = false;
                                                      });
                                                      Navigator.of(context)
                                                          .pop();
                                                    },
                                                    child: Text("Delete",
                                                        style: TextStyle(
                                                            color: Colors.red)),
                                                  ),
                                                ],
                                              );
                                            },
                                          );
                                        },
                                        icon: Icon(
                                          Icons.delete_forever_rounded,
                                          color: Colors.red,
                                        ),
                                      )),
                                    ]))
                                .toList(),
                          ),
                        ),
                      ),
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => createanchorpage(
                          companyid: widget.companyid,
                        )));
          },
          child: Icon(Icons.add),
        ));
  }
}
