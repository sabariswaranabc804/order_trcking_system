import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:http/http.dart' as http;
import 'package:ots/Admin/Category/update_category.dart';

import '../../API/api.dart';
import '../../main.dart';
import 'add_category.dart';

class viewcategory extends StatefulWidget {
  final int user_type;
  final int company_Id;

  const viewcategory({
    super.key,
    required this.user_type,
    required this.company_Id,
  });

  @override
  _viewcategoryState createState() => _viewcategoryState();
}

class _viewcategoryState extends State<viewcategory> {
  List<dynamic> companyData = [];
  List<dynamic> allData = [];
  List<dynamic> filteredData = [];
  String? selectedCompany;
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    fetchCompanyData();
    _startAutoReload();
  }

  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel(); // Cancel the timer when disposing the widget
    super.dispose();
  }

  void _startAutoReload() {
    _timer = Timer.periodic(Duration(seconds: 3), (timer) {
      // Reload data only if the selected filter is "All"
      if (selectedCompany == null || selectedCompany == 'All') {
        fetchCompanyData();
      }
    });
  }

  Future<void> fetchCompanyData() async {
    setState(() {
      isLoading = true;
    });

    try {
      final response = await http
          .get(Uri.parse('http://$api/api/company/${widget.company_Id}'));
      if (response.statusCode == 200) {
        companyData = jsonDecode(response.body);
        await fetchFilteredData();
        print(response.body); // Fetch filtered data here
      } else {
        print('Failed to load company data');
      }
    } catch (e) {
      print('Error fetching company data: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _deleteService(String id) async {
    await servsubtype().servsubtypefunc(id);
    setState(() {
      fetchFilteredData();
    });
  }

  Future<void> fetchFilteredData() async {
    setState(() {
      isLoading = true;
    });

    try {
      final response = await http.get(
          Uri.parse('http://$api/api/serviceSubTypes/${widget.company_Id}'));
      if (response.statusCode == 200) {
        allData = jsonDecode(response.body);
        filteredData = allData; // Initially show all data
      } else {
        print('Failed to fetch filtered data');
      }
    } catch (e) {
      print('Error fetching filtered data: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void updateFilteredData(String? selectedCompany) {
    setState(() {
      if (selectedCompany == null || selectedCompany == 'All') {
        filteredData = allData;
      } else {
        filteredData = allData.where((item) {
          return item['serv_Name'].toString().toUpperCase() ==
              selectedCompany.toUpperCase();
        }).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    double height = MediaQuery.of(context).size.height;
    double width = MediaQuery.of(context).size.width;

    var size = MediaQuery.of(context).size;

    final double itemHeight = (size.height - kToolbarHeight - 24) / 8.3;
    final double itemWidth = size.width / 8;
    return Scaffold(
      appBar: AppBar(
        title: Text('Product List'),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              "Total Items: ${filteredData.length}",
              style: TextStyle(color: Colors.black),
            ),
          ),
        ],
      ),
      body:

          // isLoading
          //     ? Center(child: CircularProgressIndicator())
          //     :
          //

          Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: DropdownButton<String>(
              hint: Text('Select Services'),
              value: selectedCompany,
              onChanged: (String? newValue) {
                setState(() {
                  selectedCompany = newValue;
                });
                updateFilteredData(newValue);
              },
              items: [
                DropdownMenuItem<String>(
                  value: 'All',
                  child: Text('All'),
                ),
                ...companyData.map<DropdownMenuItem<String>>((item) {
                  return DropdownMenuItem<String>(
                    value: item['serv_Name'].toString().toUpperCase(),
                    child: Text(item['serv_Name'] ?? 'Unnamed'),
                  );
                }).toList(),
              ],
            ),
          ),
          Expanded(
            child: filteredData.isEmpty
                ? Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 80),
                      child: GridView.builder(
                        shrinkWrap: true,
                        scrollDirection: Axis.vertical,
                        physics: NeverScrollableScrollPhysics(),
                        itemCount: filteredData.length,
                        itemBuilder: (context, index) => Card(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Stack(
                                children: [
                                  // Container(
                                  //   padding: EdgeInsets.symmetric(
                                  //       vertical: 4, horizontal: 8),
                                  //   decoration: BoxDecoration(
                                  //     color: Color(0xFFC62828),
                                  //     borderRadius:
                                  //         BorderRadius.circular(5),
                                  //   ),
                                  //   child: Text(
                                  //     '5% Off',
                                  //     style: TextStyle(
                                  //       fontSize: 10,
                                  //       color: Colors.white,
                                  //       fontWeight: FontWeight.bold,
                                  //     ),
                                  //   ),
                                  // ),
                                  Center(
                                    child: Container(
                                      padding: const EdgeInsets.all(8),
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.fromLTRB(
                                                5, 27, 5, 0),
                                            child: Container(
                                              height: 80,
                                              child: filteredData[index]
                                                          ['imagefile'] !=
                                                      null
                                                  ? Image(
                                                      image: NetworkImage(
                                                          'http://$api/uploads/product-images/${filteredData[index]['imagefile']}'),
                                                    )
                                                  : Image(
                                                      image: AssetImage(
                                                          'assets/photo.png')),
                                            ),
                                          ),
                                          Padding(
                                            padding: const EdgeInsets.all(8.0),
                                            child: Column(
                                              children: [
                                                Text(
                                                  filteredData[index][
                                                          'servSubType_Name'] ??
                                                      'No Description',
                                                  style: TextStyle(
                                                      fontSize: 10,
                                                      fontWeight:
                                                          FontWeight.w600),
                                                ),
                                                Center(
                                                  child: Text(
                                                    filteredData[index]
                                                            ['serv_Name'] ??
                                                        'No Name',
                                                    style:
                                                        TextStyle(fontSize: 10),
                                                  ),
                                                ),
                                                Text(
                                                  "Rs." +
                                                      filteredData[index]
                                                              ['rate']
                                                          .toString(),
                                                  style: TextStyle(
                                                      fontSize: 10,
                                                      fontWeight:
                                                          FontWeight.w600),
                                                ),
                                                SizedBox(
                                                  height: 2,
                                                ),
                                                // RatingBar.builder(
                                                //   initialRating: 4,
                                                //   minRating: 0,
                                                //   direction:
                                                //       Axis.horizontal,
                                                //   allowHalfRating: true,
                                                //   ignoreGestures: true,
                                                //   itemCount: 5,
                                                //   itemSize: 13,
                                                //   itemBuilder:
                                                //       (context, _) =>
                                                //           Icon(
                                                //     Icons.star,
                                                //     size: 2,
                                                //     color:
                                                //         Color(0xFFF9A825),
                                                //   ),
                                                //   onRatingUpdate:
                                                //       (rating) {
                                                //     setState(() {
                                                //       // _reviewUpdate.Rating =
                                                //       //     rating.toString();
                                                //       // print(_reviewUpdate
                                                //       //     .Rating);
                                                //     });
                                                //   },
                                                // ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                  Container(
                                    alignment: Alignment.topRight,
                                    child: PopupMenuButton(
                                      onSelected: (value) {
                                        if (value == 'edit') {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) =>
                                                  EditServicePage(
                                                serviceId: filteredData[index]
                                                        ['servSubType_Id']
                                                    .toString(),
                                                initialName: filteredData[index]
                                                    ['servSubType_Name'],
                                                initialDescription:
                                                    filteredData[index]
                                                            ['description'] ??
                                                        '',
                                                initialRate: filteredData[index]
                                                        ['rate']
                                                    .toString(),
                                                initialImageFile:
                                                    filteredData[index]
                                                            ['imagefile'] ??
                                                        '',
                                                companyId: widget.company_Id,
                                              ),
                                            ),
                                          ).then((shouldRefresh) {
                                            if (shouldRefresh == true) {
                                              fetchFilteredData(); // Refresh data after edit
                                            }
                                          });
                                        }
                                      },
                                      itemBuilder: (BuildContext bc) {
                                        return [
                                          PopupMenuItem(
                                            child: Text("Edit"),
                                            value: 'edit',
                                          ),
                                          PopupMenuItem(
                                            onTap: () {
                                              showDialog(
                                                context: context,
                                                builder:
                                                    (BuildContext context) {
                                                  return AlertDialog(
                                                    title:
                                                        Text("Delete Service"),
                                                    content: Text(
                                                        "Are you sure you want to delete ${filteredData[index]['serv_Name']}-${filteredData[index]['servSubType_Name']}?"),
                                                    actions: [
                                                      TextButton(
                                                        onPressed: () {
                                                          Navigator.of(context)
                                                              .pop();
                                                        },
                                                        child: Text("Cancel"),
                                                      ),
                                                      TextButton(
                                                        onPressed: () async {
                                                          await _deleteService(
                                                              filteredData[
                                                                          index]
                                                                      [
                                                                      'servSubType_Id']
                                                                  .toString());
                                                          fetchCompanyData();
                                                          Navigator.of(context)
                                                              .pop();
                                                        },
                                                        child: Text("Delete",
                                                            style: TextStyle(
                                                                color: Colors
                                                                    .red)),
                                                      ),
                                                    ],
                                                  );
                                                },
                                              );
                                            },
                                            child: Text("Delete"),
                                            value: '/about',
                                          ),
                                        ];
                                      },
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            childAspectRatio: (itemWidth / itemHeight)),
                      ),
                    ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => ProductPage(
                        user_type: widget.user_type,
                        company_Id: widget.company_Id,
                      )));
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
