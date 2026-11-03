import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

import '../../main.dart';

class EditServicePage extends StatefulWidget {
  final String serviceId;
  final String initialName;
  final String initialDescription;
  final String initialRate;
  final String initialImageFile;
  final int companyId;

  const EditServicePage({
    Key? key,
    required this.serviceId,
    required this.initialName,
    required this.initialDescription,
    required this.initialRate,
    required this.initialImageFile,
    required this.companyId,
  }) : super(key: key);

  @override
  _EditServicePageState createState() => _EditServicePageState();
}

class _EditServicePageState extends State<EditServicePage> {
  final _formKey = GlobalKey<FormState>();
  late String productName;
  late String productDescription;
  late String productRate;
  File? productImageFile; // To hold the selected image file

  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    productName = widget.initialName;
    productDescription = widget.initialDescription;
    productRate = widget.initialRate;
  }

  Future<void> _updateService() async {
    if (_formKey.currentState!.validate()) {
      try {
        final request = http.MultipartRequest(
          'PUT',
          Uri.parse('http://$api/api/serviceSubTypes/${widget.serviceId}'),
        );

        request.fields['servSubType_Name'] = productName;
        request.fields['rate'] = productRate;
        request.fields['company_Id'] = widget.companyId.toString();

        if (productImageFile != null) {
          request.files.add(
            await http.MultipartFile.fromPath(
              'imagefile',
              productImageFile!.path,
            ),
          );
        }

        final response = await request.send();

        if (response.statusCode == 200) {
          Navigator.pop(context, true);
        } else {
          print('Failed to update service: ${response.statusCode}');
        }
      } catch (e) {
        print('Error updating service: $e');
      }
    }
  }

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        productImageFile = File(pickedFile.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Edit Product')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                widget.initialImageFile == ""
                    ? Container(
                        height: 200,
                        decoration: BoxDecoration(
                            color: Colors.blueGrey,
                            border: Border.all(
                              color: Colors.black, // Border color
                              width: 1, // Adjust border width as needed
                            ),
                            shape: BoxShape.circle,
                            image: DecorationImage(
                              fit: BoxFit.fitHeight,
                              image: AssetImage('assets/photo.png'),
                            )),
                      )
                    : Container(
                        height: 200,
                        decoration: BoxDecoration(
                            color: Colors.blueGrey,
                            border: Border.all(
                              color: Colors.black, // Border color
                              width: 1, // Adjust border width as needed
                            ),
                            shape: BoxShape.circle,
                            image: DecorationImage(
                              fit: BoxFit.fitHeight,
                              image: NetworkImage(
                                  'http://$api/uploads/product-images/${widget.initialImageFile}'),
                            )),
                      ),
                SizedBox(height: 20),
                TextFormField(
                  initialValue: productName,
                  decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.grey[100],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(15),
                        borderSide: BorderSide.none,
                      ),
                      labelText: 'Service Name'),
                  onChanged: (value) {
                    productName = value;
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a service name';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 10), SizedBox(height: 10),
                // TextFormField(
                //   initialValue: productDescription,
                //   decoration: InputDecoration(
                //     labelText: 'Description',
                //     filled: true,
                //     fillColor: Colors.grey[100],
                //     border: OutlineInputBorder(
                //       borderRadius: BorderRadius.circular(15),
                //       borderSide: BorderSide.none,
                //     ),
                //   ),
                //   onChanged: (value) {
                //     productDescription = value;
                //   },
                // ),
                // SizedBox(height: 10),
                TextFormField(
                  initialValue: productRate,
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
                  onChanged: (value) {
                    productRate = value;
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a rate';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _pickImage,
                  child: Text('Pick Image'),
                ),
                if (productImageFile != null) ...[
                  SizedBox(height: 10),
                  Text('Selected Image:'),
                  Image.file(
                    productImageFile!,
                    height: 150, // Adjust the height as needed
                    fit: BoxFit.cover,
                  ),
                ],
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _updateService,
                  child: Text('Update Service'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
