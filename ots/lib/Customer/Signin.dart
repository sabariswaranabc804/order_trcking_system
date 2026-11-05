import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:otp_pin_field/otp_pin_field.dart';
import 'package:ots/Customer/signup.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert'; //
import '../Admin/Dashboard.dart';
import '../Anchor/order_details.dart';
import '../main.dart';
import 'Homepage.dart';

class signIn extends StatefulWidget {
  const signIn({super.key});

  @override
  State<signIn> createState() => _signInState();
}

class _signInState extends State<signIn> {
  final TextEditingController _emailController = TextEditingController();
  final _otpPinFieldController = GlobalKey<OtpPinFieldState>();
  final TextEditingController otpController = TextEditingController();
  bool _isLoading = false;
  bool isLoading = false;
  bool visibilityOTP = false;
  bool button = false;
  late String verify;
  late String otpfield = "";
  // Future<void> login(String email, String otp) async {
  //   setState(() {
  //     isLoading = true; // Show loading indicator
  //   });
  //
  //   // Default login credentials and user details
  //   const defaultUserCredentials = {
  //     'user@gmail.com': {'otp': '111111', 'user_type': 5, 'userID': 'GUEST2024009', 'company_Id': 0, 'deliveryman_id': 0},
  //     'admin@gmail.com': {'otp': '222222', 'user_type': 2, 'userID': 'Kirush01', 'company_Id': 1, 'deliveryman_id': 0},
  //     'deliverymen@gmail.com': {'otp': '333333', 'user_type': 4, 'userID': 'Anchor1731487349395', 'company_Id': 0, 'deliveryman_id': 12},
  //   };
  //
  //   // Check if the provided email and OTP match any default credentials
  //   if (defaultUserCredentials.containsKey(email) &&
  //       defaultUserCredentials[email]!['otp'] == otp) {
  //
  //     final userType = defaultUserCredentials[email]!['user_type'] as int;
  //     final userID = defaultUserCredentials[email]!['userID'] as String;
  //     final company_Id = defaultUserCredentials[email]!['company_Id'] as int;
  //     final deliveryman_id = defaultUserCredentials[email]!['deliveryman_id'] as int;
  //
  //     // Save user data to SharedPreferences
  //     SharedPreferences prefs = await SharedPreferences.getInstance();
  //     await prefs.setInt('user_type', userType);
  //     await prefs.setString('userID', userID);
  //     await prefs.setInt('company_Id', company_Id);
  //
  //     if (userType == 4) {
  //       await prefs.setInt('deliveryman_id', deliveryman_id);
  //     }
  //
  //
  //
  //   // Navigate based on user type
  //     if (userType == 5) {
  //       Navigator.of(context).pushAndRemoveUntil(
  //         MaterialPageRoute(builder: (context) => const homepage()),
  //             (route) => false,
  //       );
  //     } else if (userType == 2) {
  //       Navigator.of(context).pushAndRemoveUntil(
  //         MaterialPageRoute(builder: (context) => const Adm_dashboard()),
  //             (route) => false,
  //       );
  //     } else if (userType == 4) {
  //       Navigator.of(context).pushAndRemoveUntil(
  //         MaterialPageRoute(builder: (context) => App2()),
  //             (route) => false,
  //       );
  //     }
  //     setState(() {
  //       isLoading = false; // Hide loading indicator
  //     });
  //     return; // Exit the function after default login
  //   }
  //
  //   // If not a default login, proceed with the API call
  //   try {
  //     // URL for your API endpoint
  //     String url = 'http://136.185.14.8:8100/api/verify-otp';
  //
  //     // Create the body of the POST request
  //     Map<String, String> body = {
  //       'email': email,
  //       'otp': otp,
  //     };
  //
  //     // Send the POST request
  //     var response = await http.post(
  //       Uri.parse(url),
  //       headers: {'Content-Type': 'application/json;charset=UTF-8'},
  //       body: json.encode(body),
  //     );
  //
  //     if (response.statusCode == 200) {
  //       // If the server returns a success response, handle it here
  //       var jsonResponse = json.decode(response.body);
  //       print('Login Successful: $jsonResponse');
  //       String verify = response.body;
  //       int user_type = jsonResponse['user_type'];
  //       int deliveryman_id = jsonResponse['deliveryman_id'];
  //       String userID = jsonResponse['userID'];
  //       int company_Id = jsonResponse['company_Id'];
  //
  //       if (verify != "Invalid or expired OTP") {
  //         SharedPreferences prefs = await SharedPreferences.getInstance();
  //         await prefs.setInt('user_type', user_type);
  //         await prefs.setString('userID', userID);
  //         await prefs.setInt('company_Id', company_Id);
  //
  //         if (user_type == 4) {
  //           await prefs.setInt('deliveryman_id', deliveryman_id);
  //         }
  //
  //         // Navigate based on user type
  //         if (user_type == 5) {
  //           Navigator.of(context).pushAndRemoveUntil(
  //             MaterialPageRoute(builder: (context) => const homepage()),
  //                 (route) => false,
  //           );
  //         } else if (user_type == 2) {
  //           Navigator.of(context).pushAndRemoveUntil(
  //             MaterialPageRoute(builder: (context) => const Adm_dashboard()),
  //                 (route) => false,
  //           );
  //         } else if (user_type == 4) {
  //           Navigator.of(context).pushAndRemoveUntil(
  //             MaterialPageRoute(builder: (context) => App2()),
  //                 (route) => false,
  //           );
  //         } else {
  //           ScaffoldMessenger.of(context).showSnackBar(
  //             SnackBar(
  //               content: Text("Not valid"),
  //               backgroundColor: Colors.red,
  //             ),
  //           );
  //         }
  //       }
  //     } else {
  //       // If the server returns an error response, handle it here
  //       print('Login failed: ${response.body}');
  //       showAlertDialog(context); // Show error message
  //     }
  //   } catch (error) {
  //     print('Error occurred: $error');
  //     // Handle network or other errors
  //   }
  //
  //   setState(() {
  //     isLoading = false; // Hide loading indicator
  //   });
  // }
  Future<void> login(String email, String otp) async {
    setState(() {
      isLoading = true; // Show loading indicator
    });

    // URL for your API endpoint
    String url = 'http://$api/api/verify-otp';

    // Create the body of the POST request
    Map<String, String> body = {
      'email': email,
      'otp': otp,
    };

    try {
      // Send the POST request
      var response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        body: json.encode(body),
      );

      if (response.statusCode == 200) {
        // If the server returns a success response, handle it here
        var jsonResponse = json.decode(response.body);
        print('Login Successful: $jsonResponse');
        verify = response.body;
        final userData = (jsonResponse is Map && jsonResponse['user'] is Map)
            ? jsonResponse['user']
            : jsonResponse;

        int user_type = int.tryParse(userData['user_type']?.toString() ?? '') ?? 0;
        int? deliveryman_id = userData['deliveryman_id'] != null
            ? int.tryParse(userData['deliveryman_id'].toString())
            : null;
        String userID = userData['userID']?.toString() ?? '';
        int company_Id = int.tryParse(userData['company_Id']?.toString() ?? '') ?? 0;
        String token = jsonResponse['token']?.toString() ?? '';

        if (verify != "Invalid or expired OTP") {
          if (user_type == 5) {
            SharedPreferences prefs = await SharedPreferences.getInstance();
            await prefs.setInt('user_type', user_type);
            await prefs.setString('userID', userID);
            await prefs.setInt('company_Id', company_Id);
            if (token.isNotEmpty) {
              await prefs.setString('token', token);
            }
            Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) {
              return const homepage();
            }), (route) => false);
          } else if (user_type == 2) {
            SharedPreferences prefs = await SharedPreferences.getInstance();
            await prefs.setInt('user_type', user_type);
            await prefs.setString('userID', userID);
            await prefs.setInt('company_Id', company_Id);
            if (token.isNotEmpty) {
              await prefs.setString('token', token);
            }
            Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) {
              return const Adm_dashboard();
            }), (route) => false);
          } else if (user_type == 4) {
            SharedPreferences prefs = await SharedPreferences.getInstance();
            await prefs.setInt('user_type', user_type);
            await prefs.setString('userID', userID);
            await prefs.setInt('company_Id', company_Id);
            if (token.isNotEmpty) {
              await prefs.setString('token', token);
            }
            if (deliveryman_id != null) {
              await prefs.setInt('deliveryman_id', deliveryman_id);
            }
            Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) {
              return App2();
            }), (route) => false);
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text("Not valid"),
                backgroundColor: Colors.red,
              ),
            );
          }
        }

        // Handle successful login (e.g., navigate to the home page)
      } else {
        // If the server returns an error response, handle it here
        print('Login failed: ${response.body}');

        showAlertDialog(context);
        // Show error message
      }
    } catch (error) {
      print('Error occurred: $error');
      // Handle network or other errors
    }

    setState(() {
      isLoading = false; // Hide loading indicator
    });
  }

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
    });

    final url = Uri.parse('http://$api/api/request-otp'); // Your API URL

    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
      body: jsonEncode(<String, String>{
        'email': _emailController.text,
      }),
    );

    if (response.statusCode == 200) {
      setState(() {
        visibilityOTP = true;
        button = true;
      });
      // Successful login, handle the response
      final responseData = json.decode(response.body);
      print('Login successful: $responseData');

      // You can navigate to another screen here
    } else {
      setState(() {
        visibilityOTP = false;
        button = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          duration: Duration(seconds: 1),
          content: Text("Email Not found"),
          backgroundColor: Colors.red,
        ),
      );
      // Error handling
      print('Login failed: ${response.body}');
      // Show a message to the user
    }

    setState(() {
      _isLoading = false;
    });
  }

  showAlertDialog(BuildContext context) {
    // set up the button
    Widget okButton = TextButton(
      child: Text("OK"),
      onPressed: () {
        Navigator.pop(context);
      },
    );
    Widget sendotp = TextButton(
      child: Text("Send OTP"),
      onPressed: () {
        String email = _emailController.text;
        setState(() {
          _otpPinFieldController.currentState?.clearOtp();
        });
        if (email.isNotEmpty) {
          _login();
          _isLoading = false;
          visibilityOTP = true;
          button = true;
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Enter your  email"),
              backgroundColor: Colors.red,
            ),
          );
        }
        Navigator.pop(context);
      },
    );

    // set up the AlertDialog
    AlertDialog alert = AlertDialog(
      title: Center(child: Text("Alert")),
      content: Text("Invalid or expired OTP"),
      actions: [okButton, sendotp],
    );

    // show the dialog
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }

  bool checkconnection(List<ConnectivityResult> result) {
    final hasInternet = result.any((r) => r != ConnectivityResult.none);
    if (hasInternet) {
      return true;
    } else {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xff004aad),
      body: SingleChildScrollView(
          child: Form(
        child: Column(
          children: [
            Container(
              height: 50,
              width: double.infinity,
              color: Color(0xff004aad),
            ),
            Center(
              child: Container(
                height: MediaQuery.of(context).size.height / 2,
                width: double.infinity,
                child: Image(
                  image: AssetImage("assets/logolanudry3.jpg"),
                  fit: BoxFit.fill,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Card(
                      child: TextFormField(
                        keyboardType: TextInputType.emailAddress,
                        controller: _emailController,
                        validator: (input) {
                          if (input!.isEmpty ||
                              !input.contains('@') ||
                              !input.contains('.')) {
                            return "Field is mandatory";
                          }
                          return null;
                        },
                        maxLines: 1,
                        cursorColor: Color(0xff004aad),
                        style: TextStyle(
                          fontSize: 16.0,
                          color: Color(0xff004aad),
                          fontWeight: FontWeight.w500,
                        ),
                        decoration: InputDecoration(
                          icon: Icon(
                            Icons.email,
                            color: Color(0xff004aad),
                          ),
                          hintText: 'Enter email',
                          hintStyle: TextStyle(
                            fontSize: 16.0,
                            color: Color(0xff004aad),
                            fontWeight: FontWeight.w500,
                          ),
                          border: InputBorder.none,
                        ),
                        onChanged: (input) {
                          // Reset button state and show a loading indicator briefly
                          setState(() {
                            button = false;
                            visibilityOTP = false;
                            isLoading = true; // Show loading initially
                          });

                          // Simulate loading delay
                          Future.delayed(Duration(milliseconds: 500), () {
                            setState(() {
                              isLoading = false; // Hide loading after delay
                            });
                          });
                        },
                      ),
                    ),
                  ),
                  visibilityOTP
                      ? GestureDetector(
                          // onTap: hideKeyboard,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              SizedBox(height: 30),
                              OtpPinField(
                                fieldHeight: 40,
                                fieldWidth: 40,
                                key: _otpPinFieldController,
                                autoFillEnable: false,
                                textInputAction: TextInputAction.done,
                                onSubmit: (text) {
                                  print('Entered pin is $text');
                                  otpfield = text;
                                },
                                onChange: (text) {
                                  print('Enter on change pin is $text');
                                  otpfield = text;
                                },
                                onCodeChanged: (code) {
                                  print('onCodeChanged is $code');
                                },
                                otpPinFieldStyle: OtpPinFieldStyle(
                                  textStyle: TextStyle(
                                    fontSize: 18.0,
                                    color: Colors.white,
                                  ),
                                  activeFieldBorderGradient: LinearGradient(
                                    colors: [Colors.white60, Colors.white],
                                  ),
                                  filledFieldBorderGradient: LinearGradient(
                                    colors: [
                                      Colors.orangeAccent,
                                      Color(0xFFFFD180)
                                    ],
                                  ),
                                  defaultFieldBorderGradient: LinearGradient(
                                    colors: [Colors.orange, Colors.brown],
                                  ),
                                  fieldBorderWidth: 3,
                                ),
                                maxLength: 6,
                                showCursor: true,
                                cursorColor: Colors.white,
                                upperChild: Column(
                                  children: [
                                    SizedBox(height: 30),
                                    Icon(Icons.flutter_dash_outlined,
                                        size: 150),
                                    SizedBox(height: 20),
                                  ],
                                ),
                                middleChild: Column(
                                  children: [
                                    SizedBox(height: 30),
                                    ElevatedButton(
                                      onPressed: () {
                                        _otpPinFieldController.currentState
                                            ?.clearOtp();
                                      },
                                      child: Text('Clear OTP'),
                                    ),
                                    SizedBox(height: 10),
                                    SizedBox(height: 30),
                                  ],
                                ),
                                cursorWidth: 3,
                                mainAxisAlignment: MainAxisAlignment.center,
                                otpPinFieldDecoration: OtpPinFieldDecoration
                                    .defaultPinBoxDecoration,
                              ),
                              Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Text(
                                  "It will expire in 5 minutes",
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ],
                          ),
                        )
                      : Container(),
                  SizedBox(height: 30),
                  button == false
                      ? isLoading
                          ? CircularProgressIndicator(color: Colors.white)
                          : ElevatedButton(
                              onPressed: () async {
                                String email = _emailController.text;
                                final result =
                                    await Connectivity().checkConnectivity();
                                if (checkconnection(result)) {
                                  if (email.isNotEmpty) {
                                    _login();
                                  } else {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text("Enter your email"),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                  }
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content:
                                          Text("Check Internet Connection"),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                }
                              },
                              child: Text('Send OTP'),
                            )
                      : isLoading
                          ? CircularProgressIndicator() // Show loading indicator while making the request
                          : ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                              ),
                              onPressed: () {
                                String email = _emailController.text;
                                String otp = otpfield;
                                if (email.isNotEmpty && otp.isNotEmpty) {
                                  login(email, otp);
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content:
                                          Text("Please fill in both fields"),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                }
                              },
                              child: Text('Login'),
                            ),
                  SizedBox(height: 20),
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => UserForm()),
                      );
                    },
                    child: Container(
                      child: RichText(
                        text: TextSpan(
                          children: <TextSpan>[
                            TextSpan(
                              text: "Don't have an account? ",
                              style: TextStyle(color: Color(0xffA7C7E7)),
                            ),
                            TextSpan(
                              text: 'SignUp',
                              style: TextStyle(
                                fontSize: 16.0,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      )),
    );
  }
}

// import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'package:order_tracking_system/Customer/Homepage.dart';
// import 'package:order_tracking_system/Customer/signup.dart';
// import 'package:otp_pin_field/otp_pin_field.dart';
// import 'dart:convert'; //
// import '../Admin/Dashboard.dart';
//
// class signIn extends StatefulWidget {
//   const signIn({super.key});
//
//   @override
//   State<signIn> createState() => _signInState();
// }
//
// class _signInState extends State<signIn> {
//
//   final TextEditingController _emailController = TextEditingController();
//   final _otpPinFieldController = GlobalKey<OtpPinFieldState>();
//   final TextEditingController otpController = TextEditingController();
//   bool _isLoading = false;
//   bool isLoading = false;
//   bool visibilityOTP= false;
//   bool button = false;
//  late String verify;
//   late String otpfield ="";
//   Future<void> login(String email, String otp) async {
//     setState(() {
//       isLoading = true; // Show loading indicator
//     });
//
//     // URL for your API endpoint
//     String url = 'https://oots-backend.onrender.com/api/verify-otp';
//
//     // Create the body of the POST request
//     Map<String, String> body = {
//       'email': email,
//       'otp': otp,
//     };
//
//     try {
//       // Send the POST request
//       var response = await http.post(
//         Uri.parse(url),
//         headers: {'Content-Type': 'application/json;charset=UTF-8'},
//         body: json.encode(body),
//       );
//
//       if (response.statusCode == 200) {
//         // If the server returns a success response, handle it here
//         var jsonResponse = json.decode(response.body);
//         print('Login Successful: $jsonResponse');
//         verify=response.body;
//         if(verify!="Invalid or expired OTP"){
//           Navigator.of(context)
//               .pushAndRemoveUntil(
//               MaterialPageRoute(
//                   builder: (context) {
//                     return const homepage();
//                   }), (route) => false);
//
//         }
//
//
//         // Handle successful login (e.g., navigate to the home page)
//       } else {
//         // If the server returns an error response, handle it here
//         print('Login failed: ${response.body}');
//
//         showAlertDialog(context);
//         // Show error message
//       }
//
//     } catch (error) {
//       print('Error occurred: $error');
//       // Handle network or other errors
//     }
//
//     setState(() {
//       isLoading = false; // Hide loading indicator
//     });
//   }
//   Future<void> _login() async {
//     setState(() {
//       _isLoading = true;
//     });
//
//     final url = Uri.parse('https://oots-backend.onrender.com/api/request-otp'); // Your API URL
//
//     final response = await http.post(
//       url,
//       headers: <String, String>{
//         'Content-Type': 'application/json',
//       },
//       body: jsonEncode(<String, String>{
//         'email': _emailController.text,
//
//       }),
//     );
//
//     if (response.statusCode == 200) {
//       // Successful login, handle the response
//       final responseData = json.decode(response.body);
//       print('Login successful: $responseData');
//       // You can navigate to another screen here
//     } else {
//       // Error handling
//       print('Login failed: ${response.body}');
//       // Show a message to the user
//     }
//
//     setState(() {
//       _isLoading = false;
//     });
//   }
//
//
//   showAlertDialog(BuildContext context) {
//
//     // set up the button
//     Widget okButton = TextButton(
//       child: Text("OK"),
//       onPressed: () {
//         Navigator.pop(context);
//       },
//     );
//
//     // set up the AlertDialog
//     AlertDialog alert = AlertDialog(
//       title: Center(child: Text("Alert")),
//       content: Text("Invalid or expired OTP"),
//       actions: [
//         okButton,
//       ],
//     );
//
//     // show the dialog
//     showDialog(
//       context: context,
//       builder: (BuildContext context) {
//         return alert;
//       },
//     );
//   }
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: SingleChildScrollView(
//         child: Form(
//           child: Column(
//
//             children: [
//
//               Container(
//                 height: 50,
//                 width: double.infinity,
//                 color: Color(0xfffc7905),
//               ),
//               Center(
//                 child: Container(
//                   height: 150,
//                   width: double.infinity,
//                   child: Image(image: AssetImage("assets/logo.jpg"),
//                     fit: BoxFit.fill,
//                   ),
//                 ),
//               ),
//               Padding(
//                 padding: const EdgeInsets.all(16.0),
//                 child: Form(child: Column(
//                   children: [
//
//                     Padding(
//                       padding: const EdgeInsets.all(8.0),
//                       child: Card(child: TextFormField(
//                         controller: _emailController,
//                         validator: (input) {
//                           if (input!.isEmpty) {
//                             return "field mandatory";
//                           }
//                           return null;
//                         },
//                         maxLines: 1,
//                         cursorColor: Color(0xfffc7905),
//                         style: TextStyle(
//                           fontSize: 16.0,
//                           color: Color(0xfffc7905),
//                           fontWeight: FontWeight.w500,
//                         ),
//                         decoration: InputDecoration(
//                             icon: Icon(Icons.email, color: Color(0xfffc7905),),
//                             hintText: 'Enter email',
//                             hintStyle: TextStyle(
//                               fontSize: 16.0,
//                               color: Color(0xfffc7905),
//                               fontWeight: FontWeight.w500,
//                             ),
//                             border: InputBorder.none),
//                         onChanged: (input) {
//                           setState(() {
//
//                           });
//                         },
//                       ),),
//                     ),
//                     visibilityOTP?
//                     GestureDetector(
//                       onTap: hideKeyboard,
//                       child: Column(
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             SizedBox(
//                               height: 30,
//                             ),
//                             OtpPinField(
//                               fieldHeight: 40,
//                               fieldWidth: 40,
//
//                               key: _otpPinFieldController,
//
//                               autoFillEnable: false,
//              textInputAction: TextInputAction.done,
//
//
//                               onSubmit: (text) {
//                                 print('Entered pin is $text');
//                                 otpfield=text;
//
//                                 /// return the entered pin
//                               },
//                               onChange: (text) {
//                                 print('Enter on change pin is $text');
//                                 otpfield=text;
//                                 /// return the entered pin
//                               },
//                               onCodeChanged: (code) {
//                                 print('onCodeChanged  is $code');
//                               },
//
//                               /// to decorate your Otp_Pin_Field
//                               otpPinFieldStyle: OtpPinFieldStyle(
//                                 activeFieldBorderGradient:
//                                 LinearGradient(colors: [Colors.black54, Colors.black38]),
//                                 filledFieldBorderGradient:
//                                 LinearGradient(colors: [Colors.orangeAccent,  Color(0xFFFFD180),]),
//                                 defaultFieldBorderGradient:
//                                 LinearGradient(colors: [Colors.orange, Colors.brown]),
//                                 fieldBorderWidth: 3,

//                               ),
//                               maxLength: 6,
//
//                               showCursor: true,
//
//                               cursorColor: Colors.indigo,
//
//                               upperChild: Column(
//                                 children: [
//                                   SizedBox(height: 30),
//                                   Icon(Icons.flutter_dash_outlined, size: 150),
//                                   SizedBox(height: 20),
//                                 ],
//                               ),
//                               // 123456
//                               middleChild: Column(
//                                 children: [
//                                   SizedBox(height: 30),
//                                   ElevatedButton(
//                                       onPressed: () {
//                                         _otpPinFieldController.currentState
//                                             ?.clearOtp(); // clear controller
//                                       },
//                                       child: Text('clear OTP')),
//                                   SizedBox(height: 10),
//
//                                   SizedBox(height: 30),
//                                 ],
//                               ),
//
//
//                               cursorWidth: 3,
//
//                               mainAxisAlignment: MainAxisAlignment.center,
//             otpPinFieldDecoration:
//                               OtpPinFieldDecoration.defaultPinBoxDecoration,
//                             ),
//
//                             Padding(
//                               padding: const EdgeInsets.all(8.0),
//                               child: Text("It will expire in 5 minutes"),
//                             )
//                           ],
//                         ),
//
//                     ):
//                     Container(),
//                      SizedBox(
//                       height: 30,
//                     ),
//         button==false? _isLoading
//             ? CircularProgressIndicator()
//             : ElevatedButton(
//           onPressed: (){
//
//             String email = _emailController.text;
//             if (email.isNotEmpty) {
//               _login();
//               _isLoading=false;
//               visibilityOTP=true;
//               button=true;
//             }
//             else{
//               ScaffoldMessenger.of(context).showSnackBar(
//                 SnackBar(
//                   content: Text("Enter your  email"),
//                   backgroundColor: Colors.red,
//                 ),
//               );
//             }
//           },
//           child: Text('Send OTP'),)  :
//
//                     isLoading
//                         ? CircularProgressIndicator() // Show loading indicator while making the request
//                         : ElevatedButton(
//                       onPressed: () {
//                         // Call the login function when the button is pressed
//                         String email = _emailController.text;
//                         String otp = otpfield;
//
//         print("hi,"+otpfield);
//                         if (email.isNotEmpty && otpfield.isNotEmpty || otpfield!=null ) {
//                           login(email, otp);
//
//
//
//                         }
//                         else {
//                           ScaffoldMessenger.of(context).showSnackBar(
//                             SnackBar(
//                               content: Text("Please fill in both fields"),
//                               backgroundColor: Colors.red,
//                             ),
//                           );
//
//                           print('Please fill in both fields');
//                           print(verify);
//                         }
//                       },
//                       child: Text('Login'),
//                     ),
//                     SizedBox(
//
//                       height: 20,
//                     ),
//                     InkWell(
//
//                         onTap: ()
//                         {
//
//                           Navigator.push(context, MaterialPageRoute(builder: (context)=>UserForm()));
//                         },
//                         child: Container(child:   RichText(
//                           text: TextSpan(
//
//                             children: <TextSpan>[
//                               TextSpan(
//                                 text: 'Don\'t have an account ? ',
//                                 style: TextStyle(color: Colors.black),
//                               ),
//                               TextSpan(
//                                 text: 'SignUp',
//                                 style: TextStyle(fontSize: 16.0,     color: Color(0xfffc7905),),
//                               ),
//                             ],
//                           ),
//                         ))),],
//                 )),
//               )
//             ],
//           ),
//         ),
//       ),
//
//     );
//   }
// }
