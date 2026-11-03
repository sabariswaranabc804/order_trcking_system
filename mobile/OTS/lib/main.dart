import 'dart:async';
import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/adapters.dart';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:upgrader/upgrader.dart';
import 'Admin/Dashboard.dart';
import 'Anchor/order_details.dart';
import 'Customer/Homepage.dart';
import 'Customer/Signin.dart';
import 'package:http/http.dart' as http;

void main() async {
  await Hive.initFlutter();
  await Hive.openBox(
      'cartBox'); // This will open a box (database) for storing cart items.

  runApp(MyApp());
}

String api = "136.185.14.8:8099";

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // Use a blue color scheme throughout the app.
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xff004aad), // Blue color for theming
        ).copyWith(
          primary: const Color(0xff004aad), // Dark blue for primary color
          secondary:
              const Color(0xff68a0cf), // Lighter blue for secondary color
          background: Colors.white, // Very light blue for background
          surface: Colors.white, // Surface color
          onPrimary: Colors.white, // White for text/icons on primary
          onSecondary: Colors.white, // White for text/icons on secondary
          onBackground: Colors.white, // Text color for background
          onSurface: Colors.black, // Text color for surfaces
        ),

        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white, // Dark blue app bar
          iconTheme:
              IconThemeData(color: Colors.black), // White icons on app bar
          titleTextStyle: TextStyle(
            color: Colors.black, // White text in app bar
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),

        buttonTheme: const ButtonThemeData(
          buttonColor: Color(0xff004aad), // Blue for buttons
          textTheme: ButtonTextTheme.primary, // White text on buttons
        ),

        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor:
                const Color(0xff004aad), // White text on elevated buttons
          ),
        ),

        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: Color(0xff004aad), // Blue floating action button
          foregroundColor: Colors.white, // White icon on the floating button
        ),

        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: const Color(0xff004aad), // Blue text buttons
          ),
        ),

        useMaterial3: true, // Optional, can remove if not needed
      ),
      debugShowCheckedModeBanner: false,
      home: splashscreen(),
    );
  }
}

class splashscreen extends StatefulWidget {
  const splashscreen({super.key});

  @override
  State<splashscreen> createState() => _splashscreenState();
}

class _splashscreenState extends State<splashscreen> {
  int user_type = 0;
  getuser() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      user_type = prefs.getInt("user_type") ?? 0;
      print("Test${user_type}");
      //var aa = prefs.getString("mobile");
    });
  }

  Widget _role() {
    return UpgradeAlert(
      child: Container(
        child: user_type > 0
            ? user_type == 2
                ? const Adm_dashboard()
                : user_type == 5
                    ? homepage()
                    : user_type == 4 // Manager
                        ? App2()
                        : user_type == 1
                            ? Container()
                            : Container()
            : const homepage(),
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    getuser();
    Timer(
        Duration(seconds: 5),
        () => Navigator.pushReplacement(
            context, MaterialPageRoute(builder: (context) => _role())));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Column(
              children: [
                Center(
                  child: Container(
                    decoration: BoxDecoration(shape: BoxShape.circle),
                    child: Padding(
                      padding: const EdgeInsets.only(top: 120, right: 20),
                      child: Image.asset(
                        "assets/OTSLOGO.png",
                        height: 300.0,
                        width: 300.0,
                        // Ensures the image fits within the circle
                      ),
                    ),
                  ),
                ),
                Padding(
                    padding: const EdgeInsets.only(top: 170),
                    child: Text(
                      'Designed & Developed  by Akilam Technology',
                      style: TextStyle(
                        fontSize: 10.0,
                        color: Colors.black,
                      ),
                      textAlign: TextAlign.center,
                    )),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
//
// class UserForm extends StatefulWidget {
//   @override
//   _UserFormState createState() => _UserFormState();
// }
//
// class _UserFormState extends State<UserForm> {
//   final _formKey = GlobalKey<FormState>();
//   final nameController = TextEditingController();
//   final phoneNumberController = TextEditingController();
//   final alternativePhoneController = TextEditingController();
//   final emailController = TextEditingController();
//   final pinCodeController = TextEditingController();
//   final landmarkController = TextEditingController();
//   final countryController = TextEditingController();
//   final stateController = TextEditingController();
//   final cityController = TextEditingController();
//   final areaController = TextEditingController();
//   final streetController = TextEditingController();
//   final floorDoorController = TextEditingController();
//
//   // Method to send POST request
//   Future<void> _submitForm() async {
//     if (_formKey.currentState!.validate()) {
//       // All fields are valid, perform the POST request
//       final url = Uri.parse(
//           'https://oots-backend.onrender.com/api/users'); // Replace with your actual API endpoint
//       final response = await http.post(
//         url,
//         headers: {'Content-Type': 'application/json'},
//         body: json.encode({
//           "name": nameController.text,
//           "phoneNumber": phoneNumberController.text,
//           "alternativephoneNumber": alternativePhoneController.text,
//           "email": emailController.text,
//           "pinCode": pinCodeController.text,
//           "landmark": landmarkController.text,
//           "country": countryController.text,
//           "state": stateController.text,
//           "city": cityController.text,
//           "area": areaController.text,
//           "street": streetController.text,
//           "floorDoorNumber": floorDoorController.text,
//         }),
//       );
//       if (response.statusCode == 201 || response.statusCode == 200) {
//         print('User added successfully: ${response.body}');
//         ScaffoldMessenger.of(context).showSnackBar(SnackBar(
//           content: Text('Data submitted successfully!'),
//           backgroundColor: Colors.green,
//         ));
//         // Handle success (e.g., show a dialog or navigate)
//       } else {
//         print('Failed to add user: ${response.body}');
//         ScaffoldMessenger.of(context).showSnackBar(SnackBar(
//           content: Text('Failed to submit data. Please try again.'),
//         ));
//         // Handle failure (e.g., show an error message)
//       }
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: SingleChildScrollView(
//         child: Column(
//           children: [
//             Container(
//               height: 150,
//               width: double.infinity,
//               decoration: BoxDecoration(
//                 // shape: BoxShape.circle,
//                 image: DecorationImage(
//                     image: AssetImage(
//                       'assets/logo.png',
//                       // Example logo, replace with your own logo
//                     ),
//                     fit: BoxFit.fill),
//               ),
//             ),
//             Padding(
//               padding: const EdgeInsets.all(16.0),
//               child: Form(
//                 key: _formKey,
//                 child: Column(
//                   children: [
//                     // Name field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                     ),
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: nameController,
//                         decoration: InputDecoration(
//                           labelText: 'Name',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                         keyboardType: TextInputType.text,
//                         validator: (value) {
//                           if (value!.isEmpty) {
//                             return 'Please enter your Name';
//                           }
//                           return null;
//                         },
//                       ),
//                     ),
//                     // Phone Number field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: phoneNumberController,
//                         decoration: InputDecoration(
//                           labelText: 'Phone number',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                         keyboardType: TextInputType.phone,
//                         validator: (value) {
//                           if (value == null || value.isEmpty) {
//                             return 'Please enter your phone number';
//                           } else if (value.length < 10) {
//                             return 'Please enter a valid phone number';
//                           }
//                           return null;
//                         },
//                       ),
//                     ),
//                     // Alternative Phone Number field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: alternativePhoneController,
//                         decoration: InputDecoration(
//                           labelText: 'Alternative Phone Number',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                         validator: (value) {
//                           if (value == null || value.isEmpty) {
//                             return 'Please enter your phone number';
//                           } else if (value.length < 10) {
//                             return 'Please enter a valid phone number';
//                           }
//                           return null;
//                         },
//                         keyboardType: TextInputType.phone,
//                       ),
//                     ),
//                     // Email field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: emailController,
//                         decoration: InputDecoration(
//                           labelText: 'Email',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                         keyboardType: TextInputType.emailAddress,
//                         validator: (value) {
//                           if (value == null || value.isEmpty) {
//                             return 'Please enter your email';
//                           } else if (!RegExp(r'^[^@]+@[^@]+\.[^@]+')
//                               .hasMatch(value)) {
//                             return 'Please enter a valid email address';
//                           }
//                           return null;
//                         },
//                       ),
//                     ),
//                     // Pin Code field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: pinCodeController,
//                         decoration: InputDecoration(
//                           labelText: 'Pin Code',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                         keyboardType: TextInputType.number,
//                         validator: (value) {
//                           if (value == null || value.isEmpty) {
//                             return 'Please enter your pin code';
//                           }
//                           return null;
//                         },
//                       ),
//                     ),
//                     // Landmark field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: landmarkController,
//                         decoration: InputDecoration(
//                           labelText: 'Landmark',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                       ),
//                     ),
//                     // Country field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: countryController,
//                         decoration: InputDecoration(
//                           labelText: 'Country',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                       ),
//                     ),
//                     // State field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: stateController,
//                         decoration: InputDecoration(
//                           labelText: 'State',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                       ),
//                     ),
//                     // City field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: cityController,
//                         decoration: InputDecoration(
//                           labelText: 'City',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                       ),
//                     ),
//                     // Area field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: areaController,
//                         decoration: InputDecoration(
//                           labelText: 'Area',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                       ),
//                     ),
//                     // Street field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: streetController,
//                         decoration: InputDecoration(
//                           labelText: 'Street',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                       ),
//                     ),
//                     // Floor/Door Number field
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: TextFormField(
//                         controller: floorDoorController,
//                         decoration: InputDecoration(
//                           labelText: 'Floor/Door Number',
//                           filled: true,
//                           fillColor: Colors.grey[100],
//                           border: OutlineInputBorder(
//                             borderRadius: BorderRadius.circular(15),
//                             borderSide: BorderSide.none,
//                           ),
//                         ),
//                       ),
//                     ),
//                     SizedBox(height: 20),
//                     ElevatedButton(
//                         onPressed: _submitForm,
//                         style: ButtonStyle(
//                             backgroundColor: MaterialStateProperty.all(
//                               Color(0xfffc7905),
//                             ),
//                             minimumSize:
//                                 MaterialStateProperty.all(Size(200, 40))),
//                         child: Text(
//                           "Login",
//                           style: TextStyle(color: Colors.white),
//                         )),
//                     // Submit Button
//
//                     SizedBox(height: 10),
//                     InkWell(
//                         onTap: () {
//                           Navigator.push(
//                               context,
//                               MaterialPageRoute(
//                                   builder: (context) => signIn()));
//                         },
//                         child: Container(
//                             child: RichText(
//                           text: TextSpan(
//                             children: <TextSpan>[
//                               TextSpan(
//                                 text: 'Already have an account ? ',
//                                 style: TextStyle(color: Colors.black),
//                               ),
//                               TextSpan(
//                                 text: 'Signin',
//                                 style: TextStyle(
//                                   fontSize: 16.0,
//                                   color: Color(0xfffc7905),
//                                 ),
//                               ),
//                             ],
//                           ),
//                         ))),
//                   ],
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
//
//   @override
//   void dispose() {
//     // Clean up the controllers when the widget is disposed.
//     nameController.dispose();
//     phoneNumberController.dispose();
//     alternativePhoneController.dispose();
//     emailController.dispose();
//     pinCodeController.dispose();
//     landmarkController.dispose();
//     countryController.dispose();
//     stateController.dispose();
//     cityController.dispose();
//     areaController.dispose();
//     streetController.dispose();
//     floorDoorController.dispose();
//     super.dispose();
//   }
// }
