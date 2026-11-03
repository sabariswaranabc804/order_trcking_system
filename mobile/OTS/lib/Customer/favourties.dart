import 'package:flutter/material.dart';
import '../API/api.dart';
import '../Model/wishlistgetmodel.dart';
import '../localstorage.dart';
import '../main.dart';

class WishlistRemoveRequest {
  final String userId;
  final int servSubTypeId;

  WishlistRemoveRequest({
    required this.userId,
    required this.servSubTypeId,
  });

  // Convert this request to JSON
  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'servSubType_Id': servSubTypeId,
    };
  }
}

class WishlistPage extends StatefulWidget {
  final String userId;
  WishlistPage({required this.userId});

  @override
  _WishlistPageState createState() => _WishlistPageState();
}

// Other imports...
class _WishlistPageState extends State<WishlistPage> {
  // Initialize necessary variables
  List<Map<String, dynamic>> filteredGridViewData = [];
  late Future<List<WishlistItem1>> wishlistItems;
  final WishlistService1 wishlistService = WishlistService1();
  final WishlistServiceremove wishlistService3 = WishlistServiceremove();

  @override
  void initState() {
    super.initState();
    wishlistItems = wishlistService.fetchWishlist(widget.userId);
  }

  Future<void> saveCartItems(
      List<Map<String, dynamic>> filteredGridViewData) async {
    final dbHelper = DatabaseHelper();

    for (var item in filteredGridViewData) {
      if ((item['quantity'] ?? 0) > 0) {
        var existingItem =
            await dbHelper.getCartItemByServiceName(item['servSubType_Name']);
        if (existingItem != null) {
          int existingQuantity = existingItem['quantity'];
          num newQuantity = 0 + item['quantity'];
          await dbHelper.updateCartItem({
            'id': existingItem['id'],
            'servSubType_Name': item['servSubType_Name'],
            'serv_Name': item['serv_Name'],
            'quantity': newQuantity,
            'rate': item['rate'],
            'imagefile': item['imagefile'],
          });
        } else {
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

    var cartItems = await dbHelper.getCartItems();
    print("Current cart items: $cartItems");
  }

  Future<void> removeItemFromWishlist(int servSubTypeId) async {
    WishlistRemoveRequest request = WishlistRemoveRequest(
      userId: widget.userId,
      servSubTypeId: servSubTypeId,
    );

    bool success = await wishlistService3.removeFromWishlist(request);
    if (success) {
      setState(() {
        wishlistItems = wishlistService.fetchWishlist(widget.userId);
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Item removed from wishlist!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to remove item.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Wishlist')),
      body: FutureBuilder<List<WishlistItem1>>(
        future: wishlistItems,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error loading wishlist'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No items in wishlist'));
          }

          final items = snapshot.data!;
          return GridView.builder(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, childAspectRatio: 0.55, mainAxisSpacing: 3),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final item = items[index];
              int quantity = 1;

              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: Card(
                  child: Column(
                    children: [
                      Container(
                        width: double.infinity,
                        alignment: Alignment.topRight,
                        child: IconButton(
                          icon: Icon(
                            Icons.favorite,
                            color: item.flag ? Colors.pink : Colors.grey,
                          ),
                          onPressed: () {
                            removeItemFromWishlist(item.servSubTypeId);
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Container(
                          height: 100,
                          child: item.imageFile.isNotEmpty
                              ? Image.network(
                                  'http://$api/uploads/product-images/${items[index].imageFile}',
                                  fit: BoxFit.cover,
                                )
                              : Image.asset('assets/photo.png'),
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        item.servSubTypeName,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text("Service: ${items[index].servName}"),
                      Text("Rate: Rs.${items[index].rate}"),
                      ElevatedButton(
                        onPressed: () async {
                          // Pass only the selected item to saveCartItems
                          await saveCartItems([
                            {
                              'servSubType_Name': items[index].servSubTypeName,
                              'serv_Name': items[index].servName,
                              'quantity': quantity, // Use the desired quantity
                              'rate': items[index].rate,
                              'imagefile': items[index].imageFile,
                            }
                          ]);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              duration: Duration(seconds: 1),
                              content: Text(
                                  '${items[index].servSubTypeName} item added to cart!'),
                            ),
                          );
                        },
                        style: ButtonStyle(
                          backgroundColor:
                              MaterialStateProperty.all(Color(0xff68a0cf)),
                          minimumSize: MaterialStateProperty.all(Size(200, 30)),
                        ),
                        child: Text(
                          "Add to Cart",
                          style: TextStyle(color: Colors.white),
                        ),
                      )
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
