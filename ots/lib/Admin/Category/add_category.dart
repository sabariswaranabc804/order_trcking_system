import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../../API/api.dart';
import '../../Model/addproduct.dart';
import '../../Model/getservice.dart';
import '../../main.dart';

class ProductPage extends StatefulWidget {
  final int user_type;
  final int company_Id;
  const ProductPage(
      {Key? key, required this.user_type, required this.company_Id})
      : super(key: key);
  @override
  _ProductPageState createState() => _ProductPageState();
}

class _ProductPageState extends State<ProductPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _productNameController = TextEditingController();
  final TextEditingController _rateController = TextEditingController();
  File? _imageFile;
  final picker = ImagePicker();
  String services = "";

  // Function to pick an image from the gallery
  Future<void> _pickImage() async {
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    setState(() {
      if (pickedFile != null) {
        _imageFile = File(pickedFile.path);
      } else {
        print('No image selected.');
      }
    });
  }

  List<dynamic> companyData = [];
  List<dynamic> allData = [];
  List<dynamic> filteredData = [];
  List<Map<String, dynamic>> products = [];
  late Future<List<getService>> getserv;
  Future<void> fetchCompanyData() async {
    setState(() {
      isLoading = true;
    });

    try {
      final response = await http
          .get(Uri.parse('http://$api/api/company/${widget.company_Id}'));
      if (response.statusCode == 200) {
        companyData = jsonDecode(response.body);

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

  List<String> serviceNames = []; // List to store service names
  String? selectedService; // Variable to store selected service
  // List to store fetched service names
  late add_product _serv;
  final GlobalKey<FormState> formkey = GlobalKey();
  bool checkconnection(List<ConnectivityResult> result) {
    final hasInternet = result.any((r) => r != ConnectivityResult.none);
    if (hasInternet) {
      return true;
    } else {
      return false;
    }
  }

  bool isLoading = false;
  Future<void> _uploadData() async {
    if (_formKey.currentState!.validate()) {
      if (services.isNotEmpty) {
        var request = http.MultipartRequest(
          'POST',
          Uri.parse('http://$api/api/serviceSubTypes'),
        );

        // Attach other form fields
        request.fields['serv_Name'] = services;
        request.fields['servSubType_Name'] = _productNameController.text;
        request.fields['rate'] = _rateController.text;
        request.fields['company_Id'] = widget.company_Id.toString();

        print(services);
        print(_productNameController.text);
        print(_rateController.text);
        print(widget.company_Id);

        // Attach the image file, if available
        if (_imageFile != null) {
          request.files.add(
            await http.MultipartFile.fromPath(
              'imagefile', // Ensure this matches your backend requirement
              _imageFile!.path,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text('Upload Image'),
          ));
        }

        try {
          // Send the request
          var response = await request.send();

          // Handle the response
          if (response.statusCode == 201 || response.statusCode == 200) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              backgroundColor: Colors.green,
              content: Text('Service subtype added successfully!'),
            ));
            Navigator.pop(context);
            setState(() {
              fetchCompanyData();
            });
          } else {
            var responseBody = await http.Response.fromStream(response);
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              content:
                  Text('Failed to add service subtype: ${responseBody.body}'),
            ));
          }
        } catch (e) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text('Error occurred: $e'),
          ));
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          backgroundColor: Colors.red,
          content: Text('Select a service!'),
        ));
      }
    }
  }

  // Function to fetch data from the API
  Future<void> fetchServiceData(int company_Id) async {
    final response = await http.get(Uri.parse(
        'http://$api/api/company/$company_Id')); // Replace with your API endpoint

    if (response.statusCode == 200) {
      // Decode JSON response
      List<dynamic> data = jsonDecode(response.body);
      setState(() {
        // Extract 'serv_Name' from each object and add to list
        serviceNames = data.map((item) => item['serv_Name'] as String).toList();
      });
    } else {
      // Handle error if data fetching fails
      print('Failed to load data');
    }
  }

  bool isApiCallProcess = false;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchServiceData(widget.company_Id);
    _serv = add_product(
        servSubTypeName: '',
        rate: '',
        servName: '',
        companyId: '',
        imagefile: '');
    getserv = get_service(widget.company_Id);
    fetchCompanyData();
  }

  bool validateAndSave() {
    formkey.currentState!.validate();
    if (formkey.currentState!.validate()) {
      formkey.currentState!.save();
      return true;
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            Stack(
              children: [
                Container(
                  height: MediaQuery.of(context).size.height / 3,
                  width: double.infinity,
                  child: Image(
                    image: AssetImage(
                      "assets/logolanudry3.jpg",
                    ),
                    fit: BoxFit.fitWidth,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(0, 220, 0, 0),
                  child: Container(
                    height: 50,
                    decoration: BoxDecoration(
                        gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      stops: [0.3, 0.8],
                      colors: [Colors.transparent, Colors.white],
                    )),
                  ),
                )
              ],
            ),
            Text(
              "Create Product",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: TextFormField(
                        controller: _productNameController,
                        decoration: InputDecoration(
                          labelText: 'Product Name',
                          filled: true,
                          fillColor: Colors.grey[100],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter ';
                          }
                          return null;
                        },
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: TextFormField(
                        controller: _rateController,
                        decoration: InputDecoration(
                          labelText: 'Rate',
                          filled: true,
                          fillColor: Colors.grey[100],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        keyboardType: TextInputType.number,
                        onSaved: (input) {
                          setState(() {
                            _serv.rate = input!;
                          });
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter ';
                          }
                          return null;
                        },
                      ),
                    ),
                    SizedBox(height: 16),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        serviceNames.isEmpty
                            ? CircularProgressIndicator() // Show loading indicator while fetching data
                            : DropdownButton<String>(
                                hint: Text('Select Service'),
                                value: selectedService,
                                onChanged: (String? newValue) {
                                  setState(() {
                                    selectedService =
                                        newValue; // Update selected service
                                    _serv.servName = selectedService!;
                                    services = selectedService!;
                                    print(services);
                                  });
                                },
                                items: serviceNames
                                    .map<DropdownMenuItem<String>>(
                                        (String value) {
                                  return DropdownMenuItem<String>(
                                    value: value,
                                    child: Text(value), // Display service name
                                  );
                                }).toList(),
                              ),
                      ],
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    ElevatedButton(
                      onPressed: _pickImage,
                      child: Text("Upload Image"),
                    ),
                    // Display uploaded image in a container
                    _imageFile == null
                        ? Text('No image selected.')
                        : Image.file(
                            _imageFile!, // Ensure _imageFile is not null before using
                            height: 200,
                            width: 200,
                          ),
                    SizedBox(
                      height: 20,
                    ),
                    ElevatedButton(
                      onPressed: _uploadData,
                      child: Text('Add Product'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
