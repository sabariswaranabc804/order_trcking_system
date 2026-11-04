import 'dart:async';

import 'package:badges/badges.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:badges/badges.dart' as badges;
import 'package:flutter/widgets.dart';
import 'package:marquee/marquee.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert'; // for jsonEncode and jsonDecode

import '../API/api.dart';
import '../Model/allget_service.dart';
import '../Model/anchorprofile.dart';
import '../Model/customergetallservicemodel.dart';
import '../Model/whishlist.dart';
import '../Model/wishlistgetmodel.dart';
import '../localstorage.dart';
import '../main.dart';
import 'Address_.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'Signin.dart';
import 'cartdetails.dart';
import 'cartpage.dart';
import 'favourties.dart';
import 'ordersdetails.dart';
import 'orderslist.dart';

class homepage extends StatefulWidget {
  const homepage({super.key});

  @override
  State<homepage> createState() => _homepageState();
}

class _homepageState extends State<homepage> {
  int user_type = 0;
  int company_Id = 0;
  String userID = "";
  int totalcount = 0;
  getuser() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    setState(() {
      user_type = pref.getInt("user_type")!;
      userID = pref.getString("userID")!;
      company_Id = pref.getInt("company_Id")!;
      //print(userID);
    });
  }

  final WishlistService wishlistService = WishlistService();
  final AnchorProfileAPIService apiService3 = AnchorProfileAPIService();

  Future<AnchorProfileModel?> fetchUserProfile() async {
    return await apiService3.fetchAnchorProfile(userID);
  }

  List<Map<String, dynamic>> cartItems = [];
  double totalPrice = 0.0;
  int totalQuantity = 0;

  DatabaseHelper dbHelper = DatabaseHelper();
  List<CartItem> cartItems1 = [];

  final ApiService apiService = ApiService();

  final TextEditingController pinCodeController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  late Future<List<WishlistItem1>> wishlistItems;
  final WishlistService1 wishlistService1 = WishlistService1();
  final WishlistServiceremove wishlistService3 = WishlistServiceremove();
  @override
  void initState() {
    super.initState();
    loadCartItems();
    fetchListViewData();
    fetchGridViewData();
    allserv = customer_all_get_service();
    getuser();
    saveCartItems(List<Map<String, dynamic>>.from(filteredGridViewData));
    loadCartItems();
    print("ho" + totalquantity.toString());
    _startAutoReload();
    fetchWishlist();
    print("fav${favlist}");
    print(userID);
  }

  final userdelete removeanchor = userdelete();
  bool _isLoading = false;
  // Save favorite IDs to SharedPreferences
  Future<void> saveFavoriteStatus() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('favorites', favoriteIds);
  }

  Future<void> loadCartItems() async {
    final dbHelper = DatabaseHelper();
    List<Map<String, dynamic>> items = await dbHelper.getCartItems();

    setState(() {
      cartItems = items; // Raw items from the database

      // Convert the loaded items to CartItem instances
      cartItems1 = items.map((item) {
        return CartItem(
          servSubTypeName: item['servSubType_Name'],
          quantity: item['quantity'],
          rate: item['rate'],
          imagefile: item['imagefile'],
          serv_Name: item['serv_Name'],
        );
      }).toList();

      // Calculate total price and quantity
      totalPrice = cartItems1.fold(
          0.0, (sum, item) => sum + (item.rate * item.quantity));
      totalQuantity = cartItems1.fold(0, (sum, item) => sum + item.quantity);
    });
  }

  // Delete an item from the cart
  Future<void> deleteCartItem(int id) async {
    final dbHelper = DatabaseHelper();
    await dbHelper.deleteCartItem(id);
    loadCartItems();
  }

  Future<void> incrementQuantity(Map<String, dynamic> item) async {
    final dbHelper = DatabaseHelper();
    Map<String, dynamic> updatedItem = Map<String, dynamic>.from(item);

    setState(() {
      updatedItem['quantity'] += 1;
    });

    await dbHelper.updateCartItem(updatedItem);
    loadCartItems(); // Refresh cart after updating
  }

  Future<void> decrementQuantity(Map<String, dynamic> item) async {
    final dbHelper = DatabaseHelper();
    Map<String, dynamic> updatedItem = Map<String, dynamic>.from(item);

    if (updatedItem['quantity'] > 1) {
      setState(() {
        updatedItem['quantity'] -= 1;
      });
      await dbHelper.updateCartItem(updatedItem);
    } else {
      await deleteCartItem(updatedItem['id']);
    }
    loadCartItems(); // Refresh cart after updating
  }

  List<dynamic> listViewItems = []; // Data from the first API
  List<dynamic> allGridViewData = []; // Data from the second API
  List<dynamic> filteredGridViewData =
      []; // Data to be displayed in the GridView

  int totalquantity = 0; // Declare a variable to store total quantity
  // void calculateTotalQuantity() {
  //   totalQuantity = filteredGridViewData.fold(0, (int sum, item) {
  //     int cart = 0;
  //     return sum + (item['quantity'] ?? 0) as int;
  //   });
  // }

  @override
  void dispose() {
    _timer?.cancel(); // Dispose of the controller when not needed
    super.dispose();
  }

  Timer? _timer;
  int count = 0;
  void _startAutoReload() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        getuser();
        loadCartItems();
        fetchWishlist();
        // fetchListViewData();
        // fetchGridViewData();
        // allserv = customer_all_get_service();
        // getuser();
        // saveCartItems(List<Map<String, dynamic>>.from(filteredGridViewData));
        // loadCartItems();
        count = totalQuantity + totalquantity;
      });
    });
  }

  // Fetch data for ListView
  Future<void> fetchListViewData() async {
    final response = await http.get(Uri.parse('http://$api/api/service/all'));
    if (response.statusCode == 200) {
      setState(() {
        listViewItems = json.decode(response.body);
      });
    } else {
      // Handle error
      print('Failed to load list view data');
    }
  }

  // Fetch data for GridView
  Future<void> fetchGridViewData() async {
    final response =
        await http.get(Uri.parse('http://$api/api/serviceSubTypes'));
    if (response.statusCode == 200) {
      setState(() {
        allGridViewData = json.decode(response.body);
        filteredGridViewData = allGridViewData;
        // Initially, show all data
      });
    } else {
      // Handle error
      print('Failed to load grid view data');
    }
  }

  int? selectedIndex; // Keep track of selected index
  String searchQuery = '';
  // Keep track of selected index

  void filterGridView(String? serv_Name, int index) {
    setState(() {
      selectedIndex = index; // Set the selected index

      // Start with all data
      List<dynamic> filteredData = List.from(allGridViewData);

      // Apply service name filter if provided
      if (serv_Name != null && serv_Name.isNotEmpty) {
        filteredData = filteredData.where((item) {
          return item['serv_Name'] != null &&
              item['serv_Name'].toString().toLowerCase() ==
                  serv_Name.toLowerCase(); // Ensure this key matches your data
        }).toList();
      }

      // Apply search query filter if applicable
      if (searchQuery.isNotEmpty) {
        filteredData = filteredData.where((item) {
          final name =
              item['serv_Name']?.toString().toLowerCase().toUpperCase() ?? '';
          final subType = item['servSubType_Name']
                  ?.toString()
                  .toLowerCase()
                  .toUpperCase() ??
              '';
          return name.contains(searchQuery.toLowerCase().toUpperCase()) ||
              subType.contains(searchQuery.toLowerCase().toUpperCase());
        }).toList();
      }

      // Debug print statements
      print('Selected Service: $serv_Name');
      print('Filtered Data Count: ${filteredData.length}');

      // Update the grid view data
      filteredGridViewData = filteredData;
    });
  }

  void updateSearchQuery(String query) {
    setState(() {
      searchQuery = query;
      filterGridView(null, 0); // Call filterGridView with current filters
    });
  }

// Call filterGridView with current filters
  late Future<List<AllgetService>> getserv;
  late Future<List<Customergetservicemodel>> allserv;
  List<AllgetService> datas = [];

  final List<String> myList = <String>[
    'assets/kurti.png',
    'assets/pant.png',
    'assets/saree.png',
    'assets/shirt.png',
    'assets/t-shirt (1).png',
    'assets/kurti.png',
    'assets/pant.png',
    'assets/saree.png',
    'assets/shirt.png',
    'assets/t-shirt (1).png',
    'assets/kurti.png',
  ];
  final dress = <String>[
    'Kurti',
    'Pant',
    'Saree',
    'Shirt',
    'T-Shirt',
    'Kurti',
    'Pant',
    'Saree',
    'Shirt',
    'T-Shirt'
  ];
  final dress1 = <String>[
    'Cotton',
    'Jeans',
    'Silk',
    'Rayon',
    'Cotton Blend',
    'Silk cotton',
    'Jeans',
    'Silk',
    'Rayon',
    'Cotton Blend',
  ];
  Future<void> saveUserData(String userName, String mobileNumber) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();

    // Save name and mobile number
    await prefs.setString('userName', userName);
    await prefs.setString('mobileNumber', mobileNumber);
  }

  List<Map<String, dynamic>> favlist = [];
  Future<void> fetchWishlist() async {
    final response =
        await http.get(Uri.parse('http://$api/api/wishlist/$userID'));

    if (response.statusCode == 200) {
      // If the server returns a 200 OK response, parse the data
      List<dynamic> data = json.decode(response.body);

      setState(() {
        favlist = data.map((item) => item as Map<String, dynamic>).toList();
      });
    } else {
      // If the response is not OK, throw an exception
      throw Exception('Failed to load wishlist');
    }
  }

  Future<void> saveCartItems(
      List<Map<String, dynamic>> filteredGridViewData) async {
    final dbHelper = DatabaseHelper();

    for (var item in filteredGridViewData) {
      if ((item['quantity'] ?? 0) > 0) {
        print(
            "Saving item: ${item['serv_Name']}, ${item['servSubType_Name']}, quantity: ${item['quantity']}");

        // Check if the item already exists in the cart
        var existingItem =
            await dbHelper.getCartItemByServiceName(item['servSubType_Name']);

        if (existingItem != null) {
          // Calculate new quantity
          int existingQuantity = existingItem['quantity'];
          num newQuantity = 0 + item['quantity'];

          print(
              "Item exists. Current quantity: $existingQuantity, adding: ${item['quantity']}, new quantity: $newQuantity");

          // Update the existing item with the new quantity
          await dbHelper.updateCartItem({
            'id':
                existingItem['id'], // Use the existing item's ID for the update
            'servSubType_Name': item['servSubType_Name'],
            'serv_Name': item['serv_Name'],
            'quantity': newQuantity,
            'rate': item['rate'],
            'imagefile': item['imagefile'],
          });
        } else {
          print("Item does not exist. Inserting new item.");
          await dbHelper.insertCartItem({
            'servSubType_Name': item['servSubType_Name'],
            'serv_Name': item['serv_Name'],
            'quantity': item['quantity'],
            'rate': item['rate'],
            'imagefile': item['imagefile'],
          });
        }
      }
    }

    // Check cart items after saving
    var cartItems = await dbHelper.getCartItems();
    print("Current cart items: $cartItems");
  }

  List<String> favoriteIds = [];
  @override
  Widget build(BuildContext context) {
    double height = MediaQuery.of(context).size.height;
    double width = MediaQuery.of(context).size.width;
    var size = MediaQuery.of(context).size;
    final double itemHeight = (size.height - kToolbarHeight - 24) / 6.5;
    //final double itemHeight = (size.height / 7);
    final double itemWidth = size.width / 7;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: Builder(
          builder: (context) {
            return InkWell(
              onTap: () {
                Scaffold.of(context).openDrawer(); // Opens the drawer
              },
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: CircleAvatar(
                  backgroundImage: AssetImage('assets/user.jpg'),
                  backgroundColor: Colors.transparent,
                ),
              ),
            );
          },
        ),
        title: FutureBuilder<AnchorProfileModel?>(
          future: fetchUserProfile(),
          builder: (context, snapshot) {
            if (snapshot.hasError ||
                !snapshot.hasData ||
                snapshot.data == null) {
              return Container();
            }

            // Data is successfully loaded
            AnchorProfileModel? user = snapshot.data;

            // Save name and mobile number
            if (user != null) {
              saveUserData(user.userName, user.mobileNumber);
            }

            return Text(
              "Hi, ${user?.userName}",
              style: TextStyle(
                fontSize: 21,
                color: Colors.black,
                fontWeight: FontWeight.w700,
              ),
            );
          },
        ),
        actions: [
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => CartPage(userId: userID),
                ),
              );
            },
            child: Padding(
              padding: const EdgeInsets.all(15.0),
              child: badges.Badge(
                position: BadgePosition.topEnd(),
                badgeAnimation: BadgeAnimation.size(
                  toAnimate: true,
                  animationDuration: Duration(seconds: 1),
                ),
                badgeContent: Text(
                  '${totalQuantity > 0 ? totalQuantity : '0'}', // Display only if totalQuantity is greater than 0
                  style: TextStyle(color: Colors.white),
                ),
                child: Icon(
                  Icons.shopping_cart_rounded,
                  size: 30,
                  color: Color(0xff004aad),
                ),
              ),
            ),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(60.0),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              onChanged: updateSearchQuery,
              decoration: InputDecoration(
                contentPadding: EdgeInsets.zero,
                hintText: 'Search by Service or Products',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
                prefixIcon: Icon(Icons.search),
              ),
            ),
          ),
        ),
      ),
      drawer: userID == ""
          ? Drawer(
              child: ListView(
                padding: EdgeInsets.zero,
                children: <Widget>[
                  DrawerHeader(
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                      ),
                      child: Container(
                        height: 40,
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: CircleAvatar(
                            backgroundImage: AssetImage('assets/user.jpg'),
                            backgroundColor: Colors.transparent,
                          ),
                        ),
                      )),
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text('Please login to continue the process'),
                    ),
                  ),
                  Center(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: Text("Cancel"),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        signIn())); // Close the dialog
                          },
                          child: Text("OK"),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            )
          : Drawer(
              child: ListView(
                padding: EdgeInsets.zero,
                children: <Widget>[
                  DrawerHeader(
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                      ),
                      child: Container(
                        height: 40,
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: CircleAvatar(
                            backgroundImage: AssetImage('assets/user.jpg'),
                            backgroundColor: Colors.transparent,
                          ),
                        ),
                      )),
                  Center(
                    child: Container(
                      height: 100,
                      child: FutureBuilder<AnchorProfileModel?>(
                        future: fetchUserProfile(),
                        builder: (context, snapshot) {
                          if (snapshot.hasError ||
                              !snapshot.hasData ||
                              snapshot.data == null) {
                            return Scaffold(
                              body: Center(child: CircularProgressIndicator()),
                            );
                          }

                          // Data is successfully loaded
                          AnchorProfileModel? user = snapshot.data;

                          // Save name and mobile number
                          if (user != null) {
                            saveUserData(user.userName, user.mobileNumber);
                          }

                          return Column(
                            children: [
                              Text(
                                "${user?.userName}",
                                style: TextStyle(
                                  fontSize: 21,
                                  color: Colors.black,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              Text("${user?.mobileNumber}"),
                              Text("${user?.emailId}")
                            ],
                          );
                        },
                      ),
                    ),
                  ),
                  ListTile(
                    leading: Icon(Icons.home),
                    title: Text('Home'),
                    onTap: () {
                      // Update the state of the app
                      Navigator.pop(context); // Close the drawer
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.pin_drop),
                    title: Text('Address'),
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => AddressListView(
                                    userID: userID,
                                  )));
                    },
                  ),
                  ListTile(
                    leading: Icon(CupertinoIcons.cube_fill),
                    title: Text('Orders'),
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => OrderProcess(
                                    UserId: userID,
                                  )));
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.favorite),
                    title: Text('Favorites'),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => WishlistPage(
                            userId: userID,
                          ),
                        ),
                      );
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.delete),
                    title: Text('Delete Account'),
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return AlertDialog(
                            title: Text("Delete Account"),
                            content: Text(
                                "Are you sure you want to delete your account?"),
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

                                  await removeanchor.userdeletefunc(userID);

                                  setState(() {
                                    _isLoading = false;
                                  });
                                  SharedPreferences prefs =
                                      await SharedPreferences.getInstance();
                                  await prefs.remove(
                                    'user_type',
                                  );
                                  await prefs.remove('userID');
                                  await prefs.remove('company_Id');
                                  await dbHelper.clearCart();
                                  Navigator.of(context).pushAndRemoveUntil(
                                      MaterialPageRoute(builder: (context) {
                                    return signIn();
                                  }), (route) => false);
                                },
                                child: Text("Delete",
                                    style: TextStyle(color: Colors.red)),
                              ),
                            ],
                          );
                        },
                      );
                    },
                  ),
                  ListTile(
                    leading: Icon(Icons.logout),
                    title: Text('Logout'),
                    onTap: () {
                      showDialog<void>(
                        context: context,
                        builder: (BuildContext context) {
                          return AlertDialog(
                            title: const Text('Logout'),
                            content:
                                const Text('Do you Really want to logout?'),
                            actions: <Widget>[
                              TextButton(
                                style: TextButton.styleFrom(
                                  textStyle:
                                      Theme.of(context).textTheme.labelLarge,
                                ),
                                child: const Text(
                                  'No',
                                  style: TextStyle(color: Colors.black),
                                ),
                                onPressed: () {
                                  Navigator.of(context).pop();
                                },
                              ),
                              TextButton(
                                style: TextButton.styleFrom(
                                  textStyle:
                                      Theme.of(context).textTheme.labelLarge,
                                ),
                                child: const Text(
                                  'Sure',
                                  style: TextStyle(color: Colors.green),
                                ),
                                onPressed: () async {
                                  SharedPreferences prefs =
                                      await SharedPreferences.getInstance();
                                  await prefs.remove(
                                    'user_type',
                                  );
                                  await prefs.remove('userID');
                                  await prefs.remove('company_Id');
                                  await dbHelper.clearCart();
                                  Navigator.of(context).pushAndRemoveUntil(
                                      MaterialPageRoute(builder: (context) {
                                    return signIn();
                                  }), (route) => false);
                                },
                              ),
                            ],
                          );
                        },
                      ); // Close the drawer
                    },
                  ),
                ],
              ),
            ),
      body: Stack(
        children: [
          Column(
            children: [
              Expanded(
                child: Row(
                  children: [
                    // ListView to show filters
                    Expanded(
                      flex: 1,
                      child: ListView.builder(
                        itemCount: listViewItems.length +
                            1, // Add 1 for the "All" item
                        itemBuilder: (context, index) {
                          if (index == 0) {
                            // Special case for the "All" item
                            return InkWell(
                              onTap: () => filterGridView(null, index),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Container(
                                      height: 50,
                                      width:
                                          50, // Ensure the width is the same as height for a perfect circle
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: selectedIndex == index
                                              ? Colors.blue // Selected color
                                              : Colors
                                                  .transparent, // Border color
                                          width:
                                              3, // Adjust border width as needed
                                        ),
                                      ),
                                      child: CircleAvatar(
                                        backgroundImage: AssetImage(
                                          'assets/signup2.png',
                                        ), // Fallback image
                                      ),
                                    ),
                                  ),
                                  Text(
                                    "All",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(fontSize: 12),
                                  ),
                                ],
                              ),
                            );
                          }

                          // Access the service item based on index
                          final item = listViewItems[
                              index - 1]; // Adjust index for actual items
                          final serv_Name = item['serv_Name']; // Service name
                          final imageFile =
                              item['imagefile']; // Image file name or URL

                          return InkWell(
                            onTap: () => filterGridView(serv_Name,
                                index), // Pass the service name and index
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Container(
                                    height: 50,
                                    width:
                                        50, // Ensure the width is the same as height for a perfect circle
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: selectedIndex == index
                                            ? Colors.blue // Selected color
                                            : Colors
                                                .transparent, // Border color
                                        width:
                                            3, // Adjust border width as needed
                                      ),
                                    ),
                                    child: imageFile != null
                                        ? CircleAvatar(
                                            backgroundImage: NetworkImage(
                                              'http://$api/uploads/product-images/$imageFile',
                                            ), // Fallback image
                                          )
                                        : CircleAvatar(
                                            backgroundImage: AssetImage(
                                              'assets/photo.png',
                                            ), // Fallback image
                                          ),
                                  ),
                                ),
                                Text(
                                  serv_Name,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(fontSize: 10),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                    // GridView to show filtered data
                    Expanded(
                      flex: 5,
                      child: SingleChildScrollView(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            GridView.builder(
                              gridDelegate:
                                  SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: (itemWidth / itemHeight),
                              ),
                              shrinkWrap: true,
                              scrollDirection: Axis.vertical,
                              physics: NeverScrollableScrollPhysics(),
                              itemCount: filteredGridViewData.length,
                              itemBuilder: (context, index) {
                                final item = filteredGridViewData[index];
                                int quantity = item['quantity'] ?? 0;
                                int sersubid = item['servSubType_Id'];

                                // Check if item is in wishlist
                                bool isInWishlist = favlist.any((favItem) =>
                                    favItem['servSubType_Id'] == sersubid);

                                return Card(
                                  child: Stack(
                                    children: [
                                      Center(
                                        child: Container(
                                          padding: const EdgeInsets.all(8),
                                          child: Column(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              // Product Image
                                              Container(
                                                height: 70,
                                                child: item['imagefile'] != null
                                                    ? Image.network(
                                                        'http://$api/uploads/product-images/${item['imagefile']}',
                                                      )
                                                    : Image.asset(
                                                        'assets/photo.png'),
                                              ),
                                              Padding(
                                                padding:
                                                    const EdgeInsets.all(8.0),
                                                child: Column(
                                                  children: [
                                                    Text(
                                                      item['servSubType_Name'] ??
                                                          'No Product',
                                                      style: TextStyle(
                                                          fontSize: 15,
                                                          fontWeight:
                                                              FontWeight.w600),
                                                    ),
                                                    Text(
                                                      "Service - " +
                                                          (item['serv_Name'] ??
                                                              'No service'),
                                                      style: TextStyle(
                                                          fontSize: 12),
                                                    ),
                                                    Text(
                                                      "Rs. " +
                                                          (item['rate']
                                                                  .toString() ??
                                                              '0'),
                                                      style: TextStyle(
                                                          fontSize: 15,
                                                          fontWeight:
                                                              FontWeight.w600),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                              // Quantity adjustment controls
                                              quantity > 1
                                                  ? Container(
                                                      height: 40,
                                                      width: double.infinity,
                                                      decoration: BoxDecoration(
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(20),
                                                        color:
                                                            Color(0xff004aad),
                                                      ),
                                                      child: Row(
                                                        mainAxisAlignment:
                                                            MainAxisAlignment
                                                                .center,
                                                        children: [
                                                          IconButton(
                                                            icon: Icon(
                                                                Icons.remove),
                                                            onPressed: () {
                                                              decrementQuantity(
                                                                  item);
                                                            },
                                                          ),
                                                          Text('$quantity'),
                                                          IconButton(
                                                            icon:
                                                                Icon(Icons.add),
                                                            onPressed: () {
                                                              incrementQuantity(
                                                                  item);
                                                            },
                                                          ),
                                                        ],
                                                      ),
                                                    )
                                                  : ElevatedButton(
                                                      onPressed: () async {
                                                        setState(() {
                                                          item['quantity'] = 1;
                                                        });

                                                        await saveCartItems(List<
                                                                Map<String,
                                                                    dynamic>>.from(
                                                            filteredGridViewData));
                                                        ScaffoldMessenger.of(
                                                                context)
                                                            .showSnackBar(
                                                          SnackBar(
                                                            backgroundColor:
                                                                Colors.white,
                                                            duration: Duration(
                                                                seconds: 1),
                                                            content: Text(
                                                              '${item['servSubType_Name']} added to cart',
                                                              style: TextStyle(
                                                                  color: Colors
                                                                      .black),
                                                            ),
                                                          ),
                                                        );
                                                      },
                                                      style: ButtonStyle(
                                                        backgroundColor:
                                                            MaterialStateProperty
                                                                .all(Color(
                                                                    0xff68a0cf)),
                                                        minimumSize:
                                                            MaterialStateProperty
                                                                .all(Size(
                                                                    200, 30)),
                                                      ),
                                                      child: Text("Add to Cart",
                                                          style: TextStyle(
                                                              color: Colors
                                                                  .white)),
                                                    ),
                                            ],
                                          ),
                                        ),
                                      ),
                                      // Favorite Icon
                                      Positioned(
                                        top: 5,
                                        right: 5,
                                        child: IconButton(
                                          icon: isInWishlist
                                              ? Icon(Icons.favorite,
                                                  color: Color(0xFFF06292),
                                                  size: 20)
                                              : Icon(Icons.favorite_border,
                                                  color: Color(0xFFF06292),
                                                  size: 20),
                                          onPressed: () async {
                                            // Toggle favorite status
                                            if (isInWishlist) {
                                              WishlistRemoveRequest request =
                                                  WishlistRemoveRequest(
                                                userId: userID,
                                                servSubTypeId: sersubid,
                                              );

                                              bool success =
                                                  await wishlistService3
                                                      .removeFromWishlist(
                                                          request);
                                              if (success) {
                                                // Remove from wishlist and show message
                                                setState(() {
                                                  wishlistItems = wishlistService1
                                                      .fetchWishlist(
                                                          userID); // Update wishlist items
                                                  isInWishlist =
                                                      false; // Update the favorite status
                                                });

                                                ScaffoldMessenger.of(context)
                                                    .showSnackBar(
                                                  SnackBar(
                                                      content: Text(
                                                          'Item removed from wishlist!')),
                                                );
                                              } else {
                                                ScaffoldMessenger.of(context)
                                                    .showSnackBar(
                                                  SnackBar(
                                                      content: Text(
                                                          'Failed to remove item.')),
                                                );
                                              }
                                            } else {
                                              // Add to wishlist and show message
                                              favlist.add(
                                                  item); // Assuming favlist is a list where you store favorites
                                              setState(() {
                                                isInWishlist =
                                                    true; // Update the favorite status
                                              });

                                              WishlistItem wishlistItem =
                                                  WishlistItem(
                                                userId: userID,
                                                servSubTypeId: sersubid,
                                              );

                                              bool success =
                                                  await wishlistService
                                                      .addToWishlist(
                                                          wishlistItem);

                                              ScaffoldMessenger.of(context)
                                                  .showSnackBar(
                                                SnackBar(
                                                  backgroundColor: Colors.pink,
                                                  content: Text(success
                                                      ? 'Item added to wishlist!'
                                                      : 'Failed to add item.'),
                                                ),
                                              );
                                            }
                                          },
                                        ),
                                      )
                                    ],
                                  ),
                                );
                              },
                            )
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Marquee at the bottom
              Container(
                height: 30,
                color: Colors.white,
                child: Padding(
                  padding: const EdgeInsets.all(2.0),
                  child: Marquee(
                    text: 'Pick Up & Delivery Available !!!',
                    style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color(0xff004aad)),
                    scrollAxis: Axis.horizontal,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    blankSpace: 20,
                    velocity: 50,
                    pauseAfterRound: Duration(seconds: 1),
                    startPadding: 10,
                    accelerationDuration: Duration(seconds: 1),
                    accelerationCurve: Curves.easeIn,
                    decelerationDuration: Duration(seconds: 1),
                    decelerationCurve: Curves.easeOut,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
