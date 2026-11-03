import 'dart:io';

import 'package:connectivity/connectivity.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../API/api.dart';
import '../../Model/add_service_model.dart';

class add_service extends StatefulWidget {
  final String userId;

  const add_service({super.key, required this.userId});

  @override
  State<add_service> createState() => _add_serviceState();
}

class _add_serviceState extends State<add_service> {
  String? _selectedOption;
  late addserv_model _serv;
  final GlobalKey<FormState> formkey = GlobalKey();
  bool checkconnection(ConnectivityResult result) {
    final hasInternet = result != ConnectivityResult.none;
    if (hasInternet) {
      return true;
    } else {
      return false;
    }
  }

  File? _imageFile;
  final picker = ImagePicker();
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

  bool isApiCallProcess = false;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _serv = addserv_model(
        userId: widget.userId,
        servTypeName: "",
        servName: "",
        servDescription: "",
        imagefile: "");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            Stack(
              children: [
                Container(
                  height: 190,
                  width: double.infinity,
                  child: Image(
                    image: AssetImage(
                      "assets/Pink Pastel Simple Clean Laundry Express Banner.png",
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(0, 150, 0, 0),
                  child: Container(
                    height: 50,
                    decoration: BoxDecoration(
                        gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      stops: [0.3, 0.8],
                      colors: [Colors.white12, Colors.white],
                    )),
                  ),
                )
              ],
            ),
            Text(
              "Create Services",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Form(
                  key: formkey,
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: TextFormField(
                          initialValue: 'User ID - ${widget.userId}',
                          readOnly: true,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(15),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          onSaved: (input) {
                            setState(() {
                              _serv.userId = widget.userId;
                            });
                          },
                          validator: (input) {
                            if (input!.isEmpty) {
                              return 'Invalid quantity';
                            }
                            return null;
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: TextFormField(
                          decoration: InputDecoration(
                            labelText: 'Service Name',
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(15),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          onSaved: (input) {
                            setState(() {
                              _serv.servName = input!;
                            });
                          },
                          validator: (input) {
                            if (input!.isEmpty) {
                              return 'Invalid';
                            }
                            return null;
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: TextFormField(
                          decoration: InputDecoration(
                            labelText: 'Description',
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(15),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          onSaved: (input) {
                            setState(() {
                              _serv.servDescription = input!;
                            });
                          },
                          validator: (input) {
                            if (input!.isEmpty) {
                              return 'Invalid';
                            }
                            return null;
                          },
                        ),
                      ),
                      ElevatedButton(
                        onPressed: _pickImage,
                        child: Text("Upload Image"),
                      ),
                      _imageFile == null
                          ? Text('No image selected.')
                          : Image.file(
                              _imageFile!, // Ensure _imageFile is not null before using
                              height: 200,
                              width: 200,
                            ),
                      ListTile(
                        title: Text('One Way service'),
                        leading: Radio<String>(
                          value: 'One Way service',
                          groupValue: _selectedOption,
                          onChanged: (String? value) {
                            setState(() {
                              _selectedOption = value;
                            });
                          },
                        ),
                      ),
                      ListTile(
                        title: Text('Two Way service'),
                        leading: Radio<String>(
                          value: 'Two Way service',
                          groupValue: _selectedOption,
                          onChanged: (String? value) {
                            setState(() {
                              _selectedOption = value;
                            });
                          },
                        ),
                      ),
                      ElevatedButton(
                          onPressed: () async {
                            FocusScope.of(context).unfocus();
                            if (validateAndSave()) {
                              if (_selectedOption != null) {
                                if (_imageFile != null) {
                                  final result =
                                      await Connectivity().checkConnectivity();
                                  if (checkconnection(result)) {
                                    setState(() {
                                      isApiCallProcess = false;
                                      _serv = addserv_model(
                                          userId: _serv.userId,
                                          servTypeName:
                                              _selectedOption.toString(),
                                          servName: _serv.servName,
                                          servDescription:
                                              _serv.servDescription,
                                          imagefile: _imageFile!.path);
                                      print(
                                        _serv.userId,
                                      );
                                      print(
                                        _selectedOption.toString(),
                                      );
                                      print(
                                        _serv.servName,
                                      );
                                      print(_serv.servDescription);
                                      print(_imageFile!.path);
                                    });
                                    add_serv ud = add_serv();
                                    ud.add_servfunc(_serv);

                                    ScaffoldMessenger.of(context)
                                        .showSnackBar(SnackBar(
                                      content: Text("Successfully added"),
                                      backgroundColor: Colors.green,
                                    ));
                                    Navigator.pop(context);
                                  }
                                } else {
                                  ScaffoldMessenger.of(context)
                                      .showSnackBar(SnackBar(
                                    content: Text("Upload Image"),
                                    backgroundColor: Colors.red,
                                  ));
                                }
                              } else {
                                ScaffoldMessenger.of(context)
                                    .showSnackBar(SnackBar(
                                  content: Text("Select service type"),
                                  backgroundColor: Colors.red,
                                ));
                              }
                            }
                          },
                          child: Text("Create"))
                    ],
                  )),
            ),
          ],
        ),
      ),
    );
  }

  bool validateAndSave() {
    formkey.currentState!.validate();
    if (formkey.currentState!.validate()) {
      formkey.currentState!.save();
      return true;
    }
    return false;
  }
}
