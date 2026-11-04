import 'dart:async';
import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

import 'package:http/http.dart' as http;

import 'package:shared_preferences/shared_preferences.dart';

import '../Admin/Dashboard.dart';
import '../Anchor/order_details.dart';
import '../main.dart';
import 'Homepage.dart';
import 'Signin.dart';

class UserForm extends StatefulWidget {
  @override
  _UserFormState createState() => _UserFormState();
}

class _UserFormState extends State<UserForm> {
  final _formKey = GlobalKey<FormState>();
  final nameController = TextEditingController();
  final phoneNumberController = TextEditingController();
  final alternativePhoneController = TextEditingController();
  final emailController = TextEditingController();
  final pinCodeController = TextEditingController();
  final landmarkController = TextEditingController();
  final countryController = TextEditingController();
  final stateController = TextEditingController();
  final cityController = TextEditingController();
  final areaController = TextEditingController();
  final streetController = TextEditingController();
  final floorDoorController = TextEditingController();
  late String verify;
  Future<void> _submitForm() async {
    print(locationMessage);
    print("fjgjrtoytj");
    if (_formKey.currentState!.validate()) {
      // All fields are valid, perform the POST request
      final url = Uri.parse(
          'http://$api/api/users'); // Replace with your actual API endpoint
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          "name": nameController.text,
          "phoneNumber": phoneNumberController.text,
          "alternativePhoneNumber": alternativePhoneController.text,
          "email": emailController.text,
          "pinCode": pinCodeController.text,
          "landmark": landmarkController.text,
          "country": countryController.text,
          "state": stateController.text,
          "city": cityController.text,
          "area": areaController.text,
          "street": streetController.text,
          "floorDoorNumber": floorDoorController.text,
          "location": {
            "latitude":
                latitude, // Use actual latitude value or from your controller
            "longitude":
                longitude, // Use actual longitude value or from your controller
          }
        }),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        // If the server returns a success response, handle it here
        var jsonResponse = json.decode(response.body);
        print('Login Successful: $jsonResponse');
        verify = response.body;
        int user_type = jsonResponse['user_type'];
        int deliveryman_id = jsonResponse['deliveryman_id'];
        String userID = jsonResponse['userID'];
        int company_Id = jsonResponse['company_Id'];

        if (verify != "Invalid or expired OTP") {
          SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.setInt('user_type', user_type);
          await prefs.setString('userID', userID);
          await prefs.setInt('company_Id', company_Id);
          Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (context) {
            return const homepage();
          }), (route) => false);
        }

        // Handle successful login (e.g., navigate to the home page)
      } else {
        print('Failed to add user: ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content:
              Text('Failed to submit data. Please try again.${response.body}'),
        ));
        // Handle failure (e.g., show an error message)
      }
    }
  }

  String latitude = "";
  String longitude = "";
  String locationMessage = "";

  void _getCurrentLocation() async {
    try {
      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Please enable location services.'),
        ));
        return; // Early exit
      }

      // Check location permissions
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text('Location permissions are denied.'),
          ));
          return; // Early exit
        }
      }

      if (permission == LocationPermission.deniedForever) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Location permissions are permanently denied.'),
        ));
        return; // Early exit
      }

      // Get the current position
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      setState(() {
        latitude = position.latitude.toString();
        longitude = position.longitude.toString();
        locationMessage =
            "Latitude: ${position.latitude}, Longitude: ${position.longitude}";
        print('Latitude: $latitude, Longitude: $longitude'); // Debugging
      });
    } catch (e) {
      print('Error getting location: $e'); // Catch any errors
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Failed to get location: $e'),
      ));
    }
  }

  bool showAdditionalFields = false;
  @override
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xff004aad),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              height: 50,
              width: double.infinity,
              color: Color(0xff004aad),
            ),
            Center(
              child: Container(
                height: MediaQuery.of(context).size.height / 2.5,
                width: double.infinity,
                child: Image(
                  image: AssetImage("assets/logolanudry3.jpg"),
                  fit: BoxFit.fill,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(5.0),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8.0, vertical: 4.0),
                      child: TextFormField(
                        controller: nameController,
                        decoration: InputDecoration(
                          hintText: 'Name',
                          labelStyle: TextStyle(
                              fontSize: 12), // Smaller label font size
                          filled: true,
                          fillColor: Colors.grey[100],
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 6.0,
                              horizontal: 10.0), // Minimized inner padding
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(
                                5), // Slightly reduced border radius
                            borderSide: BorderSide.none,
                          ),
                        ),
                        keyboardType: TextInputType.text,
                        validator: (value) {
                          if (value!.isEmpty) {
                            return 'Please enter your Name';
                          }
                          return null;
                        },
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    // Phone Number field
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8.0, vertical: 4.0),
                      child: TextFormField(
                        controller: phoneNumberController,
                        decoration: InputDecoration(
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 6.0, horizontal: 10.0),
                          hintText: 'Phone number',
                          labelStyle: TextStyle(fontSize: 12),
                          filled: true,
                          fillColor: Colors.grey[100],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(5),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        keyboardType: TextInputType.phone,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your phone number';
                          } else if (value.length < 10) {
                            return 'Please enter a valid phone number';
                          }
                          return null;
                        },
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    // Alternative Phone Number field
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8.0, vertical: 4.0),
                      child: TextFormField(
                        controller: alternativePhoneController,
                        decoration: InputDecoration(
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 6.0, horizontal: 10.0),
                          hintText: 'Alternative Phone Number',
                          labelStyle: TextStyle(fontSize: 12),
                          filled: true,
                          fillColor: Colors.grey[100],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(5),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your phone number';
                          } else if (value.length < 10) {
                            return 'Please enter a valid phone number';
                          }
                          return null;
                        },
                        keyboardType: TextInputType.phone,
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    // Email field
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8.0, vertical: 4.0),
                      child: TextFormField(
                        controller: emailController,
                        decoration: InputDecoration(
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 6.0, horizontal: 10.0),
                          hintText: 'Email',
                          labelStyle: TextStyle(fontSize: 12),
                          filled: true,
                          fillColor: Colors.grey[100],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(5),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        keyboardType: TextInputType.emailAddress,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your email';
                          } else if (!RegExp(r'^[^@]+@[^@]+\.[^@]+')
                              .hasMatch(value)) {
                            return 'Please enter a valid email address';
                          }
                          return null;
                        },
                      ),
                    ),
                    SizedBox(
                      height: 10,
                    ),
                    Row(
                      children: [
                        TextButton.icon(
                          style: TextButton.styleFrom(
                            foregroundColor: Colors.white, // Blue text buttons
                          ),
                          icon: Icon(Icons.home),
                          onPressed: () {
                            setState(() {
                              showAdditionalFields =
                                  !showAdditionalFields; // Toggle visibility
                            });
                          },
                          label: Text(showAdditionalFields
                              ? 'Hide Additional Fields\n(Optional)'
                              : 'Add Address\n(Optional)'),
                        ),
                        TextButton.icon(
                          style: TextButton.styleFrom(
                            foregroundColor: Colors.white, // Blue text buttons
                          ),
                          icon: Icon(Icons.location_on),
                          onPressed: () {
                            setState(() {
                              _getCurrentLocation();
                            });
                          },
                          label: Text("Get Location\n(Optional)"),
                        ),
                      ],
                    ),
                    // Pin Code field (conditionally rendered)
                    if (showAdditionalFields) ...[
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8.0, vertical: 4.0),
                        child: TextFormField(
                          controller: pinCodeController,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                vertical: 6.0, horizontal: 10.0),
                            hintText: 'Pin Code',
                            labelStyle: TextStyle(fontSize: 12),
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your pin code';
                            }
                            return null;
                          },
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8.0, vertical: 4.0),
                        child: TextFormField(
                          controller: landmarkController,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                vertical: 6.0, horizontal: 10.0),
                            hintText: 'Landmark',
                            labelStyle: TextStyle(fontSize: 12),
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Please enter the landmark';
                            }
                            return null;
                          },
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      // Country field
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8.0, vertical: 4.0),
                        child: TextFormField(
                          controller: countryController,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                vertical: 6.0, horizontal: 10.0),
                            hintText: 'Country',
                            labelStyle: TextStyle(fontSize: 12),
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Please enter the country';
                            }
                            return null;
                          },
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      // State field
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8.0, vertical: 4.0),
                        child: TextFormField(
                          controller: stateController,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                vertical: 6.0, horizontal: 10.0),
                            hintText: 'State',
                            labelStyle: TextStyle(fontSize: 12),
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Please enter the state';
                            }
                            return null;
                          },
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      // City field
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8.0, vertical: 4.0),
                        child: TextFormField(
                          controller: cityController,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                vertical: 6.0, horizontal: 10.0),
                            hintText: 'City',
                            labelStyle: TextStyle(fontSize: 12),
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Please enter the city';
                            }
                            return null;
                          },
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      // Area field
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8.0, vertical: 4.0),
                        child: TextFormField(
                          controller: areaController,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                vertical: 6.0, horizontal: 10.0),
                            hintText: 'Area',
                            labelStyle: TextStyle(fontSize: 12),
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Please enter the area';
                            }
                            return null;
                          },
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      // Street field
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8.0, vertical: 4.0),
                        child: TextFormField(
                          controller: streetController,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                vertical: 6.0, horizontal: 10.0),
                            hintText: 'Street',
                            labelStyle: TextStyle(fontSize: 12),
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Please enter the street';
                            }
                            return null;
                          },
                        ),
                      ),
                      SizedBox(
                        height: 10,
                      ),
                      // Floor/Door Number field (conditionally rendered)
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8.0, vertical: 4.0),
                        child: TextFormField(
                          controller: floorDoorController,
                          decoration: InputDecoration(
                            contentPadding: EdgeInsets.symmetric(
                                vertical: 6.0, horizontal: 10.0),
                            hintText: 'Floor/Door Number',
                            labelStyle: TextStyle(fontSize: 12),
                            filled: true,
                            fillColor: Colors.grey[100],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(5),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          keyboardType: TextInputType.text,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your Floor/Door Number';
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                    // Landmark field

                    // Add Address button

                    // Submit button
                    ElevatedButton(
                      onPressed: _submitForm,
                      child: Text('Submit'),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: InkWell(
                          onTap: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => signIn()));
                          },
                          child: Container(
                              child: RichText(
                            text: TextSpan(
                              children: <TextSpan>[
                                TextSpan(
                                  text: 'Already have an account ? ',
                                  style: TextStyle(color: Colors.white),
                                ),
                                TextSpan(
                                  text: 'Signin',
                                  style: TextStyle(
                                    fontSize: 16.0,
                                    color: Color(0xfffc7905),
                                  ),
                                ),
                              ],
                            ),
                          ))),
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

  @override
  void dispose() {
    // Clean up the controllers when the widget is disposed.
    nameController.dispose();
    phoneNumberController.dispose();
    alternativePhoneController.dispose();
    emailController.dispose();
    pinCodeController.dispose();
    landmarkController.dispose();
    countryController.dispose();
    stateController.dispose();
    cityController.dispose();
    areaController.dispose();
    streetController.dispose();
    floorDoorController.dispose();
    super.dispose();
  }
}
