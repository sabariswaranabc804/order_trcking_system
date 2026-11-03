// import 'package:flutter/material.dart';
// import 'package:lottie/lottie.dart';
// import '../Model/addressgetmodel.dart';
// import '../localstorage.dart';
// import 'Address_.dart';
// import 'Homepage.dart';
// import 'cartpage.dart'; // Your SQLite helper class
//
// class CartDetailsPage extends StatefulWidget {
//   final String userId;
//   final List<Map<String, dynamic>> items;
//
//   CartDetailsPage({required this.items, required this.userId});
//
//   @override
//   _CartDetailsPageState createState() => _CartDetailsPageState();
// }
//
// class _CartDetailsPageState extends State<CartDetailsPage> {
//   List<Map<String, dynamic>> items = [];
//   Address? selectedAddress;
//   DatabaseHelper dbHelper = DatabaseHelper();
//   List<CartItem> cartItems1 = [];
//
//   final ApiService apiService = ApiService();
//   late Future<List<Address>> futureAddresses;
//   final TextEditingController pinCodeController = TextEditingController();
//   final GlobalKey<FormState> _formKey =
//       GlobalKey<FormState>(); // Key for form validation
//
//   @override
//   void initState() {
//     super.initState();
//     items = widget.items;
//
//     // Convert items to List<CartItem>
//     cartItems1 = items.map((item) {
//       return CartItem(
//         servSubTypeName: item['servSubType_Name'],
//         quantity: item['quantity'],
//         rate: item['rate'],
//       );
//     }).toList();
//     futureAddresses = apiService.fetchAddresses(widget.userId);
//   }
//
//   Future<void> incrementQuantity(Map<String, dynamic> item) async {
//     // Increment quantity in the database
//     Map<String, dynamic> updatedItem = Map<String, dynamic>.from(item);
//     updatedItem['quantity'] += 1;
//
//     await dbHelper.updateCartItem(updatedItem);
//
//     // Reload the items from the database to reflect the changes
//     setState(() {
//       items =
//           items.map((i) => i['id'] == item['id'] ? updatedItem : i).toList();
//     });
//   }
//
//   Future<void> decrementQuantity(Map<String, dynamic> item) async {
//     // Decrement quantity in the database if quantity > 1
//     Map<String, dynamic> updatedItem = Map<String, dynamic>.from(item);
//
//     if (updatedItem['quantity'] > 1) {
//       updatedItem['quantity'] -= 1;
//       await dbHelper.updateCartItem(updatedItem);
//
//       // Update the UI to reflect the new quantity
//       setState(() {
//         items =
//             items.map((i) => i['id'] == item['id'] ? updatedItem : i).toList();
//       });
//     } else {
//       // Optionally, you can ask the user for confirmation before deleting
//       bool confirmDelete = await showDialog(
//         context: context,
//         builder: (BuildContext context) {
//           return AlertDialog(
//             title: Text('Delete item?'),
//             content: Text('Do you want to remove this item from the cart?'),
//             actions: [
//               TextButton(
//                 child: Text('Cancel'),
//                 onPressed: () {
//                   Navigator.of(context).pop(false);
//                 },
//               ),
//               TextButton(
//                 child: Text('Delete'),
//                 onPressed: () {
//                   Navigator.of(context).pop(true);
//                 },
//               ),
//             ],
//           );
//         },
//       );
//
//       // If the user confirms, delete the item
//       if (confirmDelete) {
//         await dbHelper.deleteCartItem(item['id']);
//
//         // Reload the items to reflect changes
//         setState(() {
//           items = items.where((i) => i['id'] != item['id']).toList();
//         });
//       }
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     int totalQuantity = items.fold(0, (int sum, item) {
//       return sum + (item['quantity'] ?? 0) as int;
//     });
//     double totalPrice =
//         items.fold(0.0, (sum, item) => sum + (item['quantity'] * item['rate']));
//
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Details '),
//       ),
//       body: Column(
//         children: [
//           // List of items with their individual prices and quantities
//           Expanded(
//             child: ListView.builder(
//               itemCount: items.length,
//               itemBuilder: (context, index) {
//                 final item = items[index];
//
//                 return Column(
//                   children: [
//                     ListTile(
//                       title: Text(item['servSubType_Name'] ?? 'No Product'),
//                       subtitle: Text(
//                           'Quantity: ${item['quantity']}\nRate: ${item['rate']}'),
//                       trailing: Row(
//                         mainAxisSize: MainAxisSize.min,
//                         children: [
//                           IconButton(
//                             icon: Icon(Icons.remove),
//                             onPressed: () {
//                               decrementQuantity(item);
//                             },
//                           ),
//                           Text('${item['quantity']}'),
//                           IconButton(
//                             icon: Icon(Icons.add),
//                             onPressed: () {
//                               incrementQuantity(item);
//                             },
//                           ),
//                           IconButton(
//                             icon: Icon(Icons.delete),
//                             onPressed: () {
//                               dbHelper.deleteCartItem(item['id']);
//                               setState(() {
//                                 items.remove(item);
//                               });
//                             },
//                           ),
//                         ],
//                       ),
//                     ),
//                     Divider(),
//                     Text(
//                       'Item Total: \$${(item['quantity'] * item['rate']).toStringAsFixed(2)}', // Display total price for this item
//                       style:
//                           TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
//                     ),
//                   ],
//                 );
//               },
//             ),
//           ),
//           Divider(),
//           Padding(
//             padding: const EdgeInsets.all(16.0),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   'Total Quantity: $totalQuantity',
//                   style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//                 ),
//                 SizedBox(height: 8),
//                 Text(
//                   'Total Price: \$${totalPrice.toStringAsFixed(2)}',
//                   style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
//                 ),
//               ],
//             ),
//           ),
//           Divider(),
//           ListTile(
//             title: Text("Select Address"),
//             subtitle: selectedAddress != null
//                 ? Text(
//                     'Selected: ${selectedAddress!.area}, ${selectedAddress!.cityId}, ${selectedAddress!.stateId}')
//                 : Text('No address selected'),
//             onTap: () {
//               showModalBottomSheet(
//                 context: context,
//                 builder: openCustomSettings(context),
//               );
//             },
//           ),
//           Divider(),
//           Padding(
//             padding: const EdgeInsets.all(8.0),
//             child: ElevatedButton(
//               onPressed: () async {
//                 if (selectedAddress != null) {
//                   // Prepare the cart request
//                   Cart cartRequest = Cart(
//                     userId: widget.userId,
//                     addressId: selectedAddress!
//                         .addressId, // Assuming id is a property of Address
//                     totalPrice: totalPrice,
//                     totalquantity: totalQuantity,
//                     cartItems: cartItems1,
//                   );
//
//                   // Post the cart data (order placement)
//                   await postCartData(cartRequest);
//
//                   // Show confirmation dialog
//                   showDialog(
//                     context: context,
//                     barrierDismissible: false,
//                     builder: (context) {
//                       return WillPopScope(
//                         onWillPop: () async => false,
//                         child: StatefulBuilder(builder: (context, setState) {
//                           return SimpleDialog(
//                             children: [
//                               Container(
//                                 height: MediaQuery.of(context).size.height / 6,
//                                 width: MediaQuery.of(context).size.height / 20,
//                                 child: Lottie.asset("assets/orderaccept.json"),
//                               ),
//                               Text(
//                                 "Order Placed",
//                                 textAlign: TextAlign.center,
//                                 style: TextStyle(
//                                     color: Colors.black, fontSize: 20),
//                               ),
//                               Padding(
//                                 padding: const EdgeInsets.all(24.0),
//                                 child: ElevatedButton(
//                                   onPressed: () async {
//                                     // Clear the cart from the SQLite database
//                                     await dbHelper.clearCart();
//                                     setState(() {
//                                       items.clear();
//                                     });
//                                     // Close dialogs and navigate back
//                                     Navigator.pop(
//                                         context); // Close confirmation dialog
//                                     Navigator.pop(
//                                         context); // Close cart details page
//                                     // Return to the previous screen
//                                   },
//                                   child: Text('OK'),
//                                 ),
//                               )
//                             ],
//                           );
//                         }),
//                       );
//                     },
//                   );
//                 } else {
//                   // Show an alert that no address is selected
//                   ScaffoldMessenger.of(context).showSnackBar(SnackBar(
//                     content: Text("Please select an address."),
//                   ));
//                 }
//               },
//               child: Text("Place Order"),
//             ),
//           )
//         ],
//       ),
//     );
//   }
//
//   openCustomSettings(BuildContext context) {
//     // Show the modal bottom sheet
//     showModalBottomSheet(
//       context: context,
//       builder: (context) {
//         return Container(
//           width: double.infinity,
//           decoration: const BoxDecoration(
//             gradient: LinearGradient(
//               colors: [
//                 Color.fromARGB(115, 231, 231, 231),
//                 Color.fromARGB(77, 131, 131, 131),
//               ],
//               begin: Alignment.center,
//               end: Alignment.bottomRight,
//             ),
//             borderRadius: BorderRadius.only(
//               topLeft: Radius.circular(30),
//               topRight: Radius.circular(30),
//             ),
//           ),
//           child: Padding(
//             padding: EdgeInsets.all(20),
//             child: Column(
//               mainAxisSize: MainAxisSize.max,
//               mainAxisAlignment: MainAxisAlignment.spaceBetween,
//               children: [
//                 Text(
//                   'Select Address',
//                   style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
//                 ),
//                 Container(
//                   height: MediaQuery.of(context).size.height / 2.1,
//                   child: FutureBuilder<List<Address>>(
//                     future: futureAddresses,
//                     builder: (context, snapshot) {
//                       if (snapshot.connectionState == ConnectionState.waiting) {
//                         return Center(child: CircularProgressIndicator());
//                       } else if (snapshot.hasError) {
//                         return Center(child: Text('Error: ${snapshot.error}'));
//                       } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
//                         return Center(child: Text('No addresses found.'));
//                       }
//
//                       final addresses = snapshot.data!;
//
//                       return ListView.builder(
//                         itemCount: addresses.length,
//                         itemBuilder: (context, index) {
//                           final address = addresses[index];
//                           return Card(
//                             margin: EdgeInsets.all(8.0),
//                             child: ListTile(
//                               title: Text(
//                                   '${address.area}, ${address.cityId}, ${address.stateId}'),
//                               subtitle: Column(
//                                 crossAxisAlignment: CrossAxisAlignment.start,
//                                 children: [
//                                   Text('Street: ${address.street}'),
//                                   Text('Floor/Door No: ${address.floorDoorNo}'),
//                                   Text('Landmark: ${address.landmark}'),
//                                   Text('Pin Code: ${address.pinCode}'),
//                                   Text('Address Type: ${address.addressType}'),
//                                 ],
//                               ),
//                               trailing: Radio<Address>(
//                                 value: address,
//                                 groupValue: selectedAddress,
//                                 onChanged: (Address? value) {
//                                   setState(() {
//                                     selectedAddress = value;
//                                   });
//                                   Navigator.of(context)
//                                       .pop(); // Close the bottom sheet
//                                 },
//                               ),
//                             ),
//                           );
//                         },
//                       );
//                     },
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         );
//       },
//     );
//   }
// }
