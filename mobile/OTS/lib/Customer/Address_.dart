import 'dart:async';
import 'dart:convert';
import 'package:geocoding/geocoding.dart';
import 'package:map_launcher/map_launcher.dart';
import 'package:permission_handler/permission_handler.dart';
import '../Model/add_addressmodel.dart';
import '../Model/editaddress.dart';
import 'package:connectivity/connectivity.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;

import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../API/api.dart';
import '../Model/addressgetmodel.dart';
import '../main.dart';
import 'Editaddressview.dart';

class AddressListView extends StatefulWidget {
  final String userID;
  const AddressListView({super.key, required this.userID});
  @override
  _AddressListViewState createState() => _AddressListViewState();
}

class _AddressListViewState extends State<AddressListView> {
  final ApiService apiService = ApiService();
  late Future<List<Address>> futureAddresses;
  final TextEditingController pinCodeController = TextEditingController();
  final GlobalKey<FormState> _formKey =
      GlobalKey<FormState>(); // Key for form validation

  @override
  void initState() {
    super.initState();
    futureAddresses = apiService.fetchAddresses(widget.userID);
    _startAutoReload(); // Fetch addresses for the user
  }

  void openGoogleMaps(String address) async {
    try {
      // Geocode the address to get the coordinates
      List<Location> locations = await locationFromAddress(address);

      if (locations.isNotEmpty) {
        final location = locations.first;

        // Get the list of installed map applications
        final availableMaps = await MapLauncher.installedMaps;

        if (availableMaps.isNotEmpty) {
          // Find Google Maps from the installed map apps
          final googleMaps = availableMaps.firstWhere(
              (map) => map.mapType == MapType.google,
              orElse: () => throw 'Google Maps not available on this device.');

          // Show the marker on Google Maps at the correct location
          await googleMaps.showMarker(
            title: address,
            coords: Coords(location.latitude, location.longitude),
          );
        } else {
          throw 'No map applications found on the device.';
        }
      } else {
        throw 'Could not find location for the address.';
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  final AddressService _addressService = AddressService();
  late Future<List<Address>> _futureAddresses;

  void _fetchAddresses() {
    setState(() {
      futureAddresses = apiService.fetchAddresses(widget.userID);
    });
  }

  Future<void> _deleteAddress(int addressId) async {}

  @override
  void dispose() {
    pinCodeController.dispose();
    _timer?.cancel(); // Dispose of the controller when not needed
    super.dispose();
  }

  // Function to show a dialog box with pin code input
  void showPinCodeDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Enter Pin Code'),
          content: Form(
            key: _formKey, // Assign the form key for validation
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: pinCodeController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Enter Pin Code',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    // Validation logic for pin code
                    if (value == null || value.isEmpty) {
                      return 'Please enter a pin code';
                    } else if (value.length != 6) {
                      return 'Pin code must be 6 digits long';
                    } else if (!RegExp(r'^[0-9]+$').hasMatch(value)) {
                      return 'Only numeric values are allowed';
                    }
                    return null; // No error if validation passes
                  },
                ),
              ],
            ),
          ),
          actions: <Widget>[
            ElevatedButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  String pinCode = pinCodeController.text;
                  submitPinCode(pinCode); // Pass the pin code directly
                }
              },
              child: Text('Submit Pin Code'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text('Cancel'),
            ),
          ],
        );
      },
    );
  }

  // Function to handle the pin code submission
  void submitPinCode(String pinCode) {
    Navigator.of(context).pop(); // Close the dialog
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Pin code submitted: $pinCode'),
        duration: Duration(seconds: 2),
      ),
    );

    // Navigate to the next screen with the pin code
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => addressget(
          pincode: pinCode,
          userID: widget.userID,
        ), // Ensure the destination screen is defined
      ),
    );
  }
  //
  // void dialPhoneNumber(BuildContext context, String? phoneNumber) {
  //   if (phoneNumber != null) {
  //     final Uri phoneUri = Uri(scheme: 'tel', path: phoneNumber);
  //     _launchUrl(context, phoneUri);
  //   } else {
  //     ScaffoldMessenger.of(context).showSnackBar(
  //       SnackBar(content: Text('Phone number not available!')),
  //     );
  //   }
  // }

  // void launchMapsUrl(
  //     BuildContext context, double? longitude, double? latitude) async {
  //   final String googleMapsUrl =
  //       'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude';
  //   if (await canLaunch(googleMapsUrl)) {
  //     await launch(googleMapsUrl);
  //   } else {
  //     throw 'Could not launch $googleMapsUrl';
  //   }
  // }
  //
  // void openGoogleMaps(
  //     BuildContext context, double? longitude, double? latitude) async {
  //   if (longitude != null && latitude != null) {
  //     // Request location permission
  //     PermissionStatus status = await Permission.location.request();
  //
  //     if (status.isGranted) {
  //       final Uri launchUri = Uri.parse(
  //           'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude');
  //
  //       try {
  //         if (await canLaunchUrl(launchUri)) {
  //           // Launch Google Maps in an external app
  //           await launchUrl(launchUri, mode: LaunchMode.externalApplication);
  //         } else {
  //           print('Could not launch $launchUri');
  //           ScaffoldMessenger.of(context).showSnackBar(
  //             SnackBar(content: Text('Could not open Google Maps.')),
  //           );
  //         }
  //       } catch (e) {
  //         print('Error launching URL: $e');
  //       }
  //     } else {
  //       print('Location permission denied');
  //       ScaffoldMessenger.of(context).showSnackBar(
  //         SnackBar(content: Text('Location permission denied.')),
  //       );
  //     }
  //   } else {
  //     ScaffoldMessenger.of(context).showSnackBar(
  //       SnackBar(content: Text('Location not available!')),
  //     );
  //   }
  // }
  Timer? _timer;
  bool _isLoading = false;
  void _startAutoReload() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        futureAddresses = apiService.fetchAddresses(widget.userID);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Address'),
      ),
      body: Hero(
        tag: 0,
        child: Column(
          children: [
            Expanded(
              child: FutureBuilder<List<Address>>(
                future: futureAddresses,
                builder: (context, snapshot) {
                  if (snapshot.hasError) {
                    // Log the error and show a message or dialog
                    print("Error: No addresses found.");
                    return Center(child: Text("No addresses found"));
                  } else if (snapshot.hasData && snapshot.data!.isEmpty) {
                    // No addresses found
                    return Center(child: Text("No addresses found"));
                  } else if (snapshot.hasData) {
                    final addresses = snapshot.data!;

                    return ListView.builder(
                      itemCount: addresses.length,
                      itemBuilder: (context, index) {
                        final address = addresses[index];
                        return Card(
                          margin: EdgeInsets.all(8.0),
                          child: ListTile(
                            title: Text(
                                '${address.area}, ${address.cityId}, ${address.stateId}'),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Street: ${address.street}'),
                                Text('Floor/Door No: ${address.floorDoorNo}'),
                                Text('Landmark: ${address.landmark}'),
                                Text('Pin Code: ${address.pinCode}'),
                                Text('Phone Number: ${address.mobile_number}'),
                                Row(
                                  children: [
                                    IconButton(
                                      onPressed: () async {
                                        print(widget.userID);
                                        print(address.addressId);
                                        showDialog(
                                          context: context,
                                          builder: (BuildContext context) {
                                            return AlertDialog(
                                              title: Text("Delete"),
                                              content: Text(
                                                  'Want to Delete this Address?'),
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
                                                    try {
                                                      await _addressService
                                                          .deleteAddress(
                                                              widget.userID,
                                                              address
                                                                  .addressId);
                                                      showDialog(
                                                        context: context,
                                                        builder: (BuildContext
                                                            context) {
                                                          return AlertDialog(
                                                            title:
                                                                Text("Delete"),
                                                            content: Text(
                                                                'Address deleted successfully'),
                                                            actions: <Widget>[
                                                              TextButton(
                                                                onPressed: () {
                                                                  Navigator.of(
                                                                          context)
                                                                      .pop();
                                                                  Navigator.of(
                                                                          context)
                                                                      .pop(); // Close the dialog
                                                                },
                                                                child:
                                                                    Text("OK"),
                                                              ),
                                                            ],
                                                          );
                                                        },
                                                      );
                                                      _fetchAddresses(); // Refresh the list after deletion
                                                    } catch (e) {
                                                      ScaffoldMessenger.of(
                                                              context)
                                                          .showSnackBar(
                                                        SnackBar(
                                                            content: Text(
                                                                'Failed to delete address')),
                                                      );
                                                    }
                                                  },
                                                  child: Text("OK"),
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
                                    ),
                                    IconButton(
                                      onPressed: () async {
                                        // Assuming 'address' is of type Address, manually map its properties to editAddress
                                        final editedAddress = editAddress(
                                          addressId:
                                              address.addressId.toString(),
                                          userId: address.userId,
                                          country: address.location_Id,
                                          state: address.stateId.toString(),
                                          city: address.cityId.toString(),
                                          area: address.area,
                                          street: address.street,
                                          floorDoorNumber: address.floorDoorNo,
                                          landmark: address.landmark,
                                          pinCode: address.pinCode,
                                          addressType: address.addressType,
                                          location: address.locationId,
                                          phoneNumber: address.mobile_number,
                                        );

                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                EditAddressScreen(
                                                    initialAddress:
                                                        editedAddress),
                                          ),
                                        );
                                      },
                                      icon: Icon(
                                        Icons.edit,
                                        color: Colors.blue,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            trailing: Text(address.addressType),
                          ),
                        );
                      },
                    );
                  } else {
                    // Handle any other unexpected state
                    return Center(child: CircularProgressIndicator());
                  }
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Container(
                color: Colors.white,
                padding: EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orangeAccent, // Button color
                      minimumSize:
                          Size(double.infinity, 50), // Full-width button
                    ),
                    onPressed: () {
                      showPinCodeDialog();
                    },
                    child: Text("Add address")),
              ),
            )
          ],
        ),
      ),
    );
  }
}

// ApiService Class
class ApiService {
  final String baseUrl = 'http://$api/api/getAddress/';

  Future<List<Address>> fetchAddresses(String userId) async {
    final response = await http.get(Uri.parse('$baseUrl$userId'));

    if (response.statusCode == 200) {
      List<dynamic> jsonResponse = json.decode(response.body);
      // print(response.body);
      return jsonResponse.map((data) => Address.fromJson(data)).toList();
    } else {
      throw Exception('Failed to load addresses');
    }
  }
}

class addressget extends StatefulWidget {
  final String pincode;
  final String userID;
  const addressget({super.key, required this.pincode, required this.userID});

  @override
  _addressgetState createState() => _addressgetState();
}

class _addressgetState extends State<addressget> {
  late addAddress add;
  String pinCodeDetails = "";
  List<PostOffice> postOffices = [];
  String? selectedPostOffice;

  String district = "";
  String state = '';
  String country = '';
  final GlobalKey<FormState> formkey = GlobalKey();
  bool checkconnection(ConnectivityResult result) {
    final hasInternet = result != ConnectivityResult.none;
    if (hasInternet) {
      return true;
    } else {
      return false;
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

  @override
  void initState() {
    super.initState();
    getDataFromPinCode(widget.pincode);
    add = addAddress(
      userId: widget.userID,
      country: country,
      state: state,
      city: "",
      area: "",
      street: "",
      floorDoorNumber: "",
      landmark: "",
      pinCode: "",
      addressType: "",
      latitude: latitude,
      longitude: longitude,
      phoneNumber: '',
    );
    getUserData();
  }

  TextEditingController mobileController = TextEditingController();
  String? userName = "";
  String? mobileNumber = "";

  Future<void> getUserData() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    String? fetchedUserName = prefs.getString('userName');
    String? fetchedMobileNumber = prefs.getString('mobileNumber');

    setState(() {
      userName = fetchedUserName;
      mobileNumber = fetchedMobileNumber;
    });

    // Set the controller's text to the fetched mobile number
    mobileController.text = mobileNumber ?? ''; // Ensure it's not null
  }

  // Fetch data based on pin code
  Future<void> getDataFromPinCode(String pinCode) async {
    final url = "http://www.postalpincode.in/api/pincode/$pinCode";

    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        if (jsonResponse['Status'] == 'Error') {
          // Show a snackbar if the PIN code is not valid
          showSnackbar(context, "Pin Code is not valid.");
          setState(() {
            pinCodeDetails = 'Pin code is not valid.';
            postOffices = [];
          });
        } else {
          // Parse and display details if the PIN code is valid
          final postOfficeArray = jsonResponse['PostOffice'] as List;
          setState(() {
            postOffices = postOfficeArray
                .map((item) => PostOffice.fromJson(item))
                .toList();
            if (postOffices.isNotEmpty) {
              final obj = postOffices[0];
              pinCodeDetails =
                  'Details of pin code are:\nDistrict: ${obj.district}\nState: ${obj.state}\nCountry: ${obj.country}\nPost Office: ${obj.name}';
              district = '${obj.district}';
              state = '${obj.state}';
              country = '${obj.country}';
            }
          });
        }
      } else {
        // Show a snackbar if there is an issue fetching data
        showSnackbar(context, "Failed to fetch data. Please try again.");
        setState(() {
          pinCodeDetails = 'Failed to fetch data. Please try again.';
          postOffices = [];
        });
      }
    } catch (e) {
      // Show a snackbar if an error occurs during the API call
      showSnackbar(context, "Error occurred. Please try again.");
      setState(() {
        pinCodeDetails = 'Error occurred. Please try again.';
        postOffices = [];
      });
    }
  }

  // Function to display a snackbar with a specified message
  void showSnackbar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: Duration(seconds: 2), // Adjust the duration as needed
      ),
    );
  }

  @override
  void dispose() {
    mobileController.dispose(); // Dispose controller when not in use
    super.dispose();
  }

  bool isApiCallProcess = false;
  String? _selectedOption;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Add Address'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: formkey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                SizedBox(height: 16),
                Row(
                  children: [
                    // Label for the TextFormField
                    Padding(
                      padding: const EdgeInsets.only(
                          right: 8.0), // Space between label and text field
                      child: Text(
                        'Country: ', // Display label
                        style: TextStyle(fontSize: 16), // Label styling
                      ),
                    ),
                    // Expanded widget ensures the TextFormField takes the remaining space in the Row
                    Expanded(
                      child: TextFormField(
                        controller: TextEditingController(text: country),
                        style: TextStyle(color: Colors.black),
                        readOnly: true,
                        // Display initial value of country
                        decoration: InputDecoration(
                          isDense:
                              true, // Reduces vertical padding inside the TextFormField
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 12,
                              horizontal: 10), // Better padding for user input
                          border:
                              OutlineInputBorder(), // Border style of the TextFormField
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    // Label for the TextFormField
                    Padding(
                      padding: const EdgeInsets.only(
                          right: 8.0), // Space between label and text field
                      child: Text(
                        'State:     ', // Display label
                        style: TextStyle(fontSize: 16), // Label styling
                      ),
                    ),
                    // Expanded widget ensures the TextFormField takes the remaining space in the Row
                    Expanded(
                      child: TextFormField(
                        controller: TextEditingController(text: state),
                        style: TextStyle(color: Colors.black),
                        readOnly: true,
                        // Display initial value of country
                        decoration: InputDecoration(
                          isDense:
                              true, // Reduces vertical padding inside the TextFormField
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 12,
                              horizontal: 10), // Better padding for user input
                          border:
                              OutlineInputBorder(), // Border style of the TextFormField
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    // Label for the TextFormField
                    Padding(
                      padding: const EdgeInsets.only(
                          right: 8.0), // Space between label and text field
                      child: Text(
                        'District:  ', // Display label
                        style: TextStyle(fontSize: 16), // Label styling
                      ),
                    ),
                    // Expanded widget ensures the TextFormField takes the remaining space in the Row
                    Expanded(
                      child: TextFormField(
                        controller: TextEditingController(text: district),
                        style: TextStyle(color: Colors.black),
                        readOnly: true,
                        // Display initial value of country
                        decoration: InputDecoration(
                          isDense:
                              true, // Reduces vertical padding inside the TextFormField
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 12,
                              horizontal: 10), // Better padding for user input
                          border:
                              OutlineInputBorder(), // Border style of the TextFormField
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    // Label for the TextFormField
                    Padding(
                      padding: const EdgeInsets.only(
                          right: 8.0), // Space between label and text field
                      child: Text(
                        'Pincode:', // Display label
                        style: TextStyle(fontSize: 16), // Label styling
                      ),
                    ),
                    // Expanded widget ensures the TextFormField takes the remaining space in the Row
                    Expanded(
                      child: TextFormField(
                        controller: TextEditingController(text: widget.pincode),
                        style: TextStyle(color: Colors.black),
                        readOnly: true,
                        // Display initial value of country
                        decoration: InputDecoration(
                          isDense:
                              true, // Reduces vertical padding inside the TextFormField
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 12,
                              horizontal: 10), // Better padding for user input
                          border:
                              OutlineInputBorder(), // Border style of the TextFormField
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter some text'; // Validation message if input is empty
                          }
                          return null; // Returns null if validation passes
                        },
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    // Label for the TextFormField
                    Padding(
                      padding: const EdgeInsets.only(
                          right: 8.0), // Space between label and text field
                      child: Text(
                        'Area:      ', // Display label
                        style: TextStyle(fontSize: 16), // Label styling
                      ),
                    ),
                    // Expanded widget ensures the TextFormField takes the remaining space in the Row
                    Expanded(
                      child: postOffices.isEmpty
                          ? Container() // Show a loading indicator while data is being fetched
                          : DropdownButton<String>(
                              hint: Text('Select Area'),
                              value: selectedPostOffice,
                              onChanged: (String? newValue) {
                                setState(() {
                                  selectedPostOffice = newValue;
                                  add.area = selectedPostOffice!;
                                });
                              },
                              items: postOffices.map<DropdownMenuItem<String>>(
                                  (PostOffice postOffice) {
                                return DropdownMenuItem<String>(
                                  value: postOffice.name,
                                  child: Text(postOffice.name),
                                );
                              }).toList(),
                            ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    // Label for the TextFormField
                    Padding(
                      padding: const EdgeInsets.only(
                          right: 8.0), // Space between label and text field
                      child: Text(
                        'Street:   ', // Display label
                        style: TextStyle(fontSize: 16), // Label styling
                      ),
                    ),
                    // Expanded widget ensures the TextFormField takes the remaining space in the Row
                    Expanded(
                      child: TextFormField(
                        onSaved: (input) {
                          setState(() {
                            add.street = input!;
                          });
                        },
                        validator: (input) {
                          if (input!.isEmpty) {
                            return 'Invalid';
                          }
                          return null;
                        },
                        style: TextStyle(color: Colors.black),

                        // Display initial value of country
                        decoration: InputDecoration(
                          hintText: 'Enter Street name',
                          isDense:
                              true, // Reduces vertical padding inside the TextFormField
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 12,
                              horizontal: 10), // Better padding for user input
                          border:
                              OutlineInputBorder(), // Border style of the TextFormField
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    // Label for the TextFormField
                    Padding(
                      padding: const EdgeInsets.only(
                          right: 8.0), // Space between label and text field
                      child: Text(
                        'Door number:   ', // Display label
                        style: TextStyle(fontSize: 16), // Label styling
                      ),
                    ),
                    // Expanded widget ensures the TextFormField takes the remaining space in the Row
                    Expanded(
                      child: TextFormField(
                        style: TextStyle(color: Colors.black),

                        // Display initial value of country
                        decoration: InputDecoration(
                          hintText: 'Enter Door number',
                          isDense:
                              true, // Reduces vertical padding inside the TextFormField
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 12,
                              horizontal: 10), // Better padding for user input
                          border:
                              OutlineInputBorder(), // Border style of the TextFormField
                        ),
                        onSaved: (input) {
                          setState(() {
                            add.floorDoorNumber = input!;
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
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    // Label for the TextFormField
                    Padding(
                      padding: const EdgeInsets.only(
                          right: 8.0), // Space between label and text field
                      child: Text(
                        'Landmark:        ', // Display label
                        style: TextStyle(fontSize: 16), // Label styling
                      ),
                    ),
                    // Expanded widget ensures the TextFormField takes the remaining space in the Row
                    Expanded(
                      child: TextFormField(
                        style: TextStyle(color: Colors.black),

                        // Display initial value of country
                        decoration: InputDecoration(
                          hintText: 'Landmark',
                          isDense:
                              true, // Reduces vertical padding inside the TextFormField
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 12,
                              horizontal: 10), // Better padding for user input
                          border:
                              OutlineInputBorder(), // Border style of the TextFormField
                        ),
                        onSaved: (input) {
                          setState(() {
                            add.landmark = input!;
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
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    // First radio button with a label
                    Radio<String>(
                      value: "Home",
                      groupValue: _selectedOption,
                      onChanged: (String? value) {
                        setState(() {
                          _selectedOption = value;
                          add.addressType = _selectedOption!;
                        });
                      },
                    ),
                    Text('Home'),

                    SizedBox(width: 20), // Space between the radio buttons

                    // Second radio button with a label
                    Radio<String>(
                      value: "Work",
                      groupValue: _selectedOption,
                      onChanged: (String? value) {
                        setState(() {
                          _selectedOption = value;
                          add.addressType = _selectedOption!;
                        });
                      },
                    ),
                    Text('Work'),

                    TextButton.icon(
                      icon: Icon(Icons.location_on),
                      onPressed: () {
                        setState(() {
                          _getCurrentLocation();
                        });
                      },
                      label: Text("Get Location"),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    // Label for the TextFormField
                    Padding(
                      padding: const EdgeInsets.only(
                          right: 8.0), // Space between label and text field
                      child: Text(
                        'Phone Number:', // Display label
                        style: TextStyle(fontSize: 16), // Label styling
                      ),
                    ),
                    // Expanded widget ensures the TextFormField takes the remaining space in the Row
                    Expanded(
                      child: TextFormField(
                        controller: mobileController, // Use mobileNumber here
                        style: TextStyle(color: Colors.black),
                        // Make it read-only
                        decoration: InputDecoration(
                          isDense:
                              true, // Reduces vertical padding inside the TextFormField
                          contentPadding: EdgeInsets.symmetric(
                              vertical: 12, horizontal: 10),
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            add.phoneNumber = mobileController.toString();
                            return 'Please enter phone number';
                          }
                          return null;
                        },
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    color: Colors.white,
                    padding: EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orangeAccent, // Button color
                        minimumSize:
                            Size(double.infinity, 50), // Full-width button
                      ),
                      onPressed: () async {
                        final result = await Connectivity().checkConnectivity();
                        if (checkconnection(result)) {
                          if (validateAndSave()) {
                            if (add.area != "") {
                              if (add.addressType != "") {
                                if (latitude.isNotEmpty &&
                                    longitude.isNotEmpty) {
                                  setState(() {
                                    isApiCallProcess = false;
                                    add = addAddress(
                                        userId: widget.userID,
                                        country: country,
                                        state: state,
                                        city: district,
                                        area: add.area,
                                        street: add.street,
                                        floorDoorNumber: add.floorDoorNumber,
                                        landmark: add.landmark,
                                        pinCode: widget.pincode,
                                        addressType: add.addressType,
                                        latitude: latitude,
                                        longitude: longitude,
                                        phoneNumber: mobileController.text);
                                  });

                                  addadressfunc ud = addadressfunc();
                                  ud.submitAddress(add);

                                  ScaffoldMessenger.of(context)
                                      .showSnackBar(SnackBar(
                                    content: Text("Successfully added"),
                                    backgroundColor: Colors.green,
                                  ));
                                  Navigator.pop(context);
                                } else {
                                  ScaffoldMessenger.of(context)
                                      .showSnackBar(SnackBar(
                                    content: Text("Select location"),
                                    backgroundColor: Colors.red,
                                  ));
                                }
                              } else {
                                ScaffoldMessenger.of(context)
                                    .showSnackBar(SnackBar(
                                  content: Text("Select addresstype"),
                                  backgroundColor: Colors.red,
                                ));
                              }
                            } else {
                              ScaffoldMessenger.of(context)
                                  .showSnackBar(SnackBar(
                                content: Text("Select area"),
                                backgroundColor: Colors.red,
                              ));
                            }
                          }

                          print(longitude);
                          print(latitude);
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                            content: Text("Check Internet connection"),
                            backgroundColor: Colors.red,
                          ));
                        }
                      },
                      child: Text('Add Address'),
                    ),
                  ),
                ),
              ],
            ),
          ),
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

// PostOffice model class
class PostOffice {
  final String name;
  final String district;
  final String state;
  final String country;

  PostOffice({
    required this.name,
    required this.district,
    required this.state,
    required this.country,
  });

  factory PostOffice.fromJson(Map<String, dynamic> json) {
    return PostOffice(
      name: json['Name'] ?? '',
      district: json['District'] ?? '',
      state: json['State'] ?? '',
      country: json['Country'] ?? '',
    );
  }
}
