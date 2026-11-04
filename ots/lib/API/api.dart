import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../Customer/Address_.dart';
import '../Customer/favourties.dart';
import '../Customer/ordersdetails.dart';
import '../Model/acceptorderrequest.dart';
import '../Model/add_addressmodel.dart';
import '../Model/add_service_model.dart';
import '../Model/addproduct.dart';
import '../Model/adm_assignedorder_toancgorpage.dart';
import '../Model/adm_orderdetails.dart';
import '../Model/admgetallordermodel.dart';
import '../Model/allget_service.dart';
import '../Model/anchor_assignedorders.dart';
import '../Model/anchorprofile.dart';
import '../Model/customerget.dart';
import '../Model/customergetallservicemodel.dart';
import '../Model/editaddress.dart';
import '../Model/get_product.dart';
import '../Model/getservice.dart';
import '../Model/orderproductmodel.dart';
import '../Model/orderupdaterequest.dart';
import '../Model/rejectmodel.dart';
import '../Model/rejectviewmodel.dart';
import '../Model/totalorderlistmodel.dart';
import '../Model/whishlist.dart';
import '../Model/wishlistgetmodel.dart';
import '../main.dart';

class OrderService {
  Future<Orderprocessmodel> fetchOrderDetails(int orderid) async {
    final response = await http.get(Uri.parse(
        'http://$api/api/order-details/$orderid')); // Assuming you're making the API call here

    if (response.statusCode == 200) {
      final data = jsonDecode(
          response.body)['data']; // This should be the parsed JSON response
      return Orderprocessmodel.fromJson(data); // Convert the JSON to your model
    } else {
      throw Exception('Failed to load order details');
    }
  }
}

class rejecct {
  final String baseUrl =
      'http://$api/api/myorder/reject-order'; // Replace with your API URL

  Future<bool> rejectfunc(rejectmodel order) async {
    final url = Uri.parse('$baseUrl'); // Update endpoint as necessary
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.encode(order.toJson()),
    );

    if (response.statusCode == 200) {
      print(response.body);
      // Assuming a 200 status code means success
      return true;
    } else {
      // Error handling
      print('Failed to post order: ${response.body}');
      return false;
    }
  }
}

class OrderlistService {
  Future<OrderList> fetchOrders(String userid) async {
    final response =
        await http.get(Uri.parse('http://$api/api/orders/user/$userid'));

    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);
      return OrderList.fromJson(jsonData);
    } else {
      throw Exception('Failed to load orders');
    }
  }
}

Future<List<getService>> get_service(int company_Id) async {
  final response =
      await http.get(Uri.parse('http://$api/api/company/$company_Id'));

  if (response.statusCode == 200) {
    final parsed = json.decode(response.body).cast<Map<String, dynamic>>();
    print("Hi" + response.body);
    return parsed.map<getService>((json) => getService.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load album');
  }
}

Future<List<getproduct>> getproductscomp(int company_Id) async {
  final response =
      await http.get(Uri.parse('http://$api/api/serviceSubTypes/$company_Id'));

  if (response.statusCode == 200) {
    final parsed = json.decode(response.body).cast<Map<String, dynamic>>();
    print("Hi" + response.body);
    return parsed.map<getproduct>((json) => getproduct.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load album');
  }
}

Future<List<AllgetService>> all_get_service() async {
  final response = await http.get(Uri.parse('http://$api/api/serviceSubTypes'));

  if (response.statusCode == 200) {
    final parsed = json.decode(response.body).cast<Map<String, dynamic>>();
    print("Hiii" + response.body);
    return parsed
        .map<AllgetService>((json) => AllgetService.fromJson(json))
        .toList();
  } else {
    throw Exception('Failed to load album');
  }
}

Future<List<Customergetservicemodel>> customer_all_get_service() async {
  final response = await http.get(Uri.parse('http://$api/api/service/all'));

  if (response.statusCode == 200) {
    final parsed = json.decode(response.body).cast<Map<String, dynamic>>();
    print("Hiii" + response.body);
    return parsed
        .map<Customergetservicemodel>(
            (json) => Customergetservicemodel.fromJson(json))
        .toList();
  } else {
    throw Exception('Failed to load album');
  }
}

class add_serv {
  final String baseUrl = 'http://$api/api/service/create';

  // Function to create a service by making a POST request
  Future<http.Response> add_servfunc(addserv_model _addserv_model) async {
    final url = Uri.parse(baseUrl);

    try {
      // Create a multipart request
      var request = http.MultipartRequest('POST', url);

      // Add fields to the request
      request.fields['userId'] = _addserv_model.userId;
      request.fields['servType_Name'] = _addserv_model.servTypeName;
      request.fields['serv_Name'] = _addserv_model.servName;
      request.fields['serv_Description'] = _addserv_model.servDescription;

      // Check if image file is available and add it to the request
      if (_addserv_model.imagefile != null) {
        request.files.add(
          await http.MultipartFile.fromPath(
            'imagefile', // Make sure the name matches the one in your backend
            _addserv_model.imagefile!,
          ),
        );
      }

      // Send the request
      var streamedResponse = await request.send();

      // Convert the streamed response into a regular response
      var response = await http.Response.fromStream(streamedResponse);

      // Check if the response status is OK
      if (response.statusCode == 201 || response.statusCode == 200) {
        // Successfully created the service
        return response;
      } else {
        // Handle the error
        throw Exception('Failed to create service: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to create service: $e');
    }
  }
}

class getreadydrop {
  Future<void> getreadydropfunc(String orderId) async {
    try {
      final response = await http.put(
        Uri.parse('http://$api/api/orders/${orderId}/ready-to-drop'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Optional if needed
        },
        body: jsonEncode({
          'status': 'ready-to-drop', // Sending data, if required
        }),
      );

      if (response.statusCode == 200) {
        print('Order updated successfully');
      } else {
        print('Failed to update order: ${response.statusCode}');
      }
    } catch (error) {
      print('Error updating order: $error');
    }
  }
}

class cancel {
  Future<void> cancelfunc(String orderId) async {
    try {
      final response = await http.put(
        Uri.parse('http://$api/api/orders/cancel/${orderId}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Optional if needed
        },
        body: jsonEncode({
          'status': 'ready-to-drop', // Sending data, if required
        }),
      );

      if (response.statusCode == 200) {
        print('Order updated successfully');
      } else {
        print('Failed to update order: ${response.statusCode}');
      }
    } catch (error) {
      print('Error updating order: $error');
    }
  }
}

class AddressService {
  final String baseUrl = 'http://$api/api';

  Future<void> deleteAddress(String userId, int addressId) async {
    final url = Uri.parse('$baseUrl/disable/address/$userId/$addressId');
    final response = await http.delete(url); // Change to DELETE

    if (response.statusCode == 200) {
      print('Address deleted successfully');
    } else {
      print('Error: ${response.body}');
      throw Exception('Failed to delete address: ${response.statusCode}');
    }
  }
}

class anchordelete {
  Future<void> anchordeletefunc(String id) async {
    try {
      final response = await http.put(
        Uri.parse('http://$api/api/deliveryman/disable/${id}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Optional if needed
        },
      );

      if (response.statusCode == 200) {
        print('Anchor deleted');
      } else {
        print('Failed to update order: ${response.statusCode}');
      }
    } catch (error) {
      print('Error Anchor deleted: $error');
    }
  }
}

class userdelete {
  Future<void> userdeletefunc(String id) async {
    try {
      final response = await http.put(
        Uri.parse('http://$api/api//disable/useraccount/${id}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Optional if needed
        },
      );

      if (response.statusCode == 200) {
        print('user deleted');
      } else {
        print('Failed to update order: ${response.statusCode}');
      }
    } catch (error) {
      print('Error Anchor deleted: $error');
    }
  }
}

class servicedelete {
  Future<void> servicedeletefunc(String id) async {
    try {
      final response = await http.put(
        Uri.parse('http://$api/api/service/delete/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Optional if needed
        },
        body: jsonEncode({
          'isDeleted':
              true, // Assuming the server uses this flag to mark the item as deleted
        }),
      );

      if (response.statusCode == 200) {
        print('Service deleted');
      } else {
        print('Failed to delete service: ${response.statusCode}');
        print('Response body: ${response.body}');
      }
    } catch (error) {
      print('Error deleting service: $error');
    }
  }
}

class servsubtype {
  Future<void> servsubtypefunc(String id) async {
    try {
      final response = await http.put(
        Uri.parse('http://$api/api/serviceSubTypes/disable/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Optional if needed
        },
        body: jsonEncode({
          'isDeleted':
              true, // Assuming the server uses this flag to mark the item as deleted
        }),
      );

      if (response.statusCode == 200) {
        print('Service deleted');
      } else {
        print('Failed to delete service: ${response.statusCode}');
        print('Response body: ${response.body}');
      }
    } catch (error) {
      print('Error deleting service: $error');
    }
  }
}
//
// class anchoredit {
//   Future<void> editDeliveryMan({
//     required int deliverymanId,
//     required String name,
//     required String contact,
//     required String email,
//     required String city,
//     required String address,
//   }) async {
//     try {
//       final response = await http.put(
//         Uri.parse(
//             'http://$api/api/deliveryman/edit/$deliverymanId'),
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
//         },
//         body: jsonEncode({
//           'name': name,
//           'contact': contact,
//           'email': email,
//           'city': city,
//           'address': address,
//         }),
//       );
//
//       if (response.statusCode == 200) {
//         print('Anchor edited successfully');
//       } else {
//         print('Failed to update order: ${response.statusCode}');
//       }
//     } catch (error) {
//       print('Error editing anchor: $error');
//     }
//   }
// }

class setcomplete {
  Future<void> setcompletefunc(String orderId) async {
    try {
      final response = await http.put(
        Uri.parse('http://$api/api/orders/${orderId}/completed'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Optional if needed
        },
        body: jsonEncode({
          'status': 'ready-to-drop', // Sending data, if required
        }),
      );

      if (response.statusCode == 200) {
        print('Order updated successfully');
      } else {
        print('Failed to update order: ${response.statusCode}');
      }
    } catch (error) {
      print('Error updating order: $error');
    }
  }
}

class AnchorProfileAPIService {
  Future<AnchorProfileModel?> fetchAnchorProfile(String userId) async {
    final url = Uri.parse('http://$api/api//users/$userId');

    try {
      final response = await http.get(url);

      if (response.statusCode == 200) {
        // If the server did return a 200 OK response, parse the JSON.
        final jsonResponse = json.decode(response.body);
        return AnchorProfileModel.fromJson(jsonResponse);
      } else {
        // If the server did not return a 200 OK response, throw an exception.
        print("Failed to load profile: ${response.statusCode}");
        return null;
      }
    } catch (e) {
      print('Error fetching user profile: $e');
      return null;
    }
  }
}

class Admorderdetailsfunc {
  Future<Adm_orderdetails> Admorderdetailsfunctions(int orderid) async {
    final response =
        await http.get(Uri.parse('http://$api/api/order-details/$orderid'));

    if (response.statusCode == 200) {
      // Parse the JSON data
      final jsonData = jsonDecode(response.body);
      return Adm_orderdetails.fromJson(jsonData['data']);
    } else {
      throw Exception('Failed to load order data');
    }
  }
}

class assignedorder_anchor {
  // Function to fetch orders
  Future<List<Assignedorder>> assignedorder_anchorfunc(
      int deliveryman_Id) async {
    final response = await http
        .get(Uri.parse("http://$api/api/assignedOrders/${deliveryman_Id}"));
    print(response.body);
    if (response.statusCode == 200 || response.statusCode == 201) {
      List jsonResponse = json.decode(response.body);
      return jsonResponse.map((data) => Assignedorder.fromJson(data)).toList();
    } else {
      throw Exception('Failed to load orders');
    }
  }
}

class RequestOrder {
  // Define the API endpoint URL
  final String apiUrl = "http://$api/api/assign-deliveryman";

  // Function to post order update data
  Future<void> updateOrder(
      BuildContext context, OrderUpdateRequest orderUpdate) async {
    final response = await http.post(
      Uri.parse(apiUrl),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(orderUpdate.toJson()), // Convert Dart object to JSON
    );

    if (response.statusCode == 200) {
      var jsonResponse = json.decode(response.body);
      print(response.body);
      print('Order update successful');

      String message = jsonResponse['message'];
      if (message == "Already assigned to Dollar for this order status") {
        // Show an alert dialog if already assigned
      }
    } else {
      print(response.body);
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("Alert!!"),
            content: Text("Not valid: This order is already assigned."),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: Text("OK"),
              ),
            ],
          );
        },
      );

      print('Failed to update order: ${response.statusCode}');
      throw Exception('Failed to update order: ${response.statusCode}');
    }
  }
}

class OrderDeliverymanRequestfunc {
  final String apiUrl =
      "http://$api/api/deliveryman/accept-order"; // Replace with your actual API endpoint

  Future<void> assignDeliveryman(OrderDeliverymanRequest request) async {
    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(request.toJson()),
      );

      if (response.statusCode == 200) {
        print("Order successfully assigned to deliveryman.");
      } else {
        print("Failed to assign order: ${response.statusCode}");
        throw Exception("Failed to assign order: ${response.statusCode}");
      }
    } catch (e) {
      print("Error: $e");
      throw Exception("Error occurred while assigning order to deliveryman.");
    }
  }
}

class anchorassignedorderslist {
  final String apiUrl =
      "http://your-api-endpoint.com/api/orders"; // Replace with your actual API URL

  Future<List<anchorassigned_orders_model>> anchorassignedorderslistfunc(
      int deliverymanid) async {
    final response = await http
        .get(Uri.parse('http://$api/api/myorders/${deliverymanid}/all'));

    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      List<anchorassigned_orders_model> orders = body
          .map((dynamic item) => anchorassigned_orders_model.fromJson(item))
          .toList();
      return orders;
    } else {
      throw Exception("Failed to load orders");
    }
  }
}

class getorderdetailsfunc {
  final String apiUrl =
      'http://$api/api/admin/all-order-details'; // Replace with your API URL

  Future<List<Admorderdetailsmodel>> getorderdetailsfunction() async {
    try {
      final response = await http.get(Uri.parse(apiUrl));

      if (response.statusCode == 200) {
        // Parse the response body into a List
        List<dynamic> body = jsonDecode(response.body)['data'];
        List<Admorderdetailsmodel> orders = body
            .map((dynamic item) => Admorderdetailsmodel.fromJson(item))
            .toList();
        return orders;
      } else {
        throw Exception("Failed to load orders");
      }
    } catch (e) {
      throw Exception('Failed to load orders: $e');
    }
  }
}

class add_products {
  final String baseUrl = 'http://$api/api/serviceSubTypes';

  Future<void> add_productfunc(add_product _add_product, File imageFile) async {
    final url = Uri.parse(baseUrl);

    // Create a multipart request
    var request = http.MultipartRequest('POST', url);

    // Add form fields
    request.fields['servSubType_Name'] = _add_product.servSubTypeName;
    request.fields['rate'] = _add_product.rate;
    request.fields['serv_Name'] = _add_product.servName;
    request.fields['company_Id'] = _add_product.companyId;

    // Add the image file to the request
    var imageStream = http.ByteStream(imageFile.openRead());
    var imageLength = await imageFile.length();
    var multipartFile = http.MultipartFile(
      'imagefile', // This key should match the one expected by the backend
      imageStream,
      imageLength,
      filename: imageFile.path.split('/').last,
    );

    request.files.add(multipartFile);

    try {
      var response = await request.send();
      if (response.statusCode == 201) {
        print('Product added successfully');
      } else {
        print('Failed to add product: ${response.statusCode}');
      }
    } catch (e) {
      print('Error occurred: $e');
    }
  }
}

class WishlistService1 {
  final String baseUrl = "http://$api/api";

  Future<List<WishlistItem1>> fetchWishlist(String userId) async {
    final url = Uri.parse('$baseUrl/wishlist/$userId');

    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => WishlistItem1.fromJson(item)).toList();
      } else {
        throw Exception('Failed to load wishlist');
      }
    } catch (e) {
      print("Error: $e");
      return [];
    }
  }
}

class WishlistService {
  final String baseUrl = "http://$api/api";

  Future<bool> addToWishlist(WishlistItem item) async {
    final url = Uri.parse('$baseUrl/wishlist/add');
    final headers = {'Content-Type': 'application/json'};
    final body = jsonEncode(item.toJson());

    try {
      final response = await http.post(url, headers: headers, body: body);
      if (response.statusCode == 200) {
        // Assuming a successful response returns a status code of 200
        return true;
      } else {
        print("Error: ${response.body}");
        return false;
      }
    } catch (e) {
      print("Error: $e");
      return false;
    }
  }
}

class WishlistServiceremove {
  final String baseUrl = "http://$api/api";

  // Method to remove an item from the wishlist
  Future<bool> removeFromWishlist(WishlistRemoveRequest request) async {
    final url = Uri.parse('$baseUrl/wishlist/remove');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(request.toJson()),
      );

      if (response.statusCode == 200) {
        return true; // Successful removal
      } else {
        print("Failed to remove item: ${response.body}");
        return false; // Failed to remove item
      }
    } catch (e) {
      print("Error: $e");
      return false;
    }
  }
}

class UserService {
  final String apiUrl = "http://$api/api/customer";

  Future<List<Customer>> fetchUsers() async {
    final response = await http.get(Uri.parse(apiUrl));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body)['data'];
      return data.map((json) => Customer.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load users');
    }
  }
}

class addadressfunc {
  final String baseUrl =
      'http://$api/api/addAddress'; // Replace with your actual API URL

  Future<void> submitAddress(addAddress address) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: json.encode(address.toJson()),
      );

      if (response.statusCode == 200 || response.body == 201) {
        print('Address submitted successfully');
      } else {
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception(
            'Failed to submit address. Status Code: ${response.statusCode}');
      }
    } catch (error) {
      print('Exception caught: $error');
      throw Exception('Failed to submit address');
    }
  }
}

class AddressAPI {
  final String apiUrl =
      'http://$api/api/editAddress'; // Replace with actual URL

  // Function to edit an address
  Future<bool> editAddressfunc(editAddress address) async {
    try {
      final response = await http.put(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(address.toMap()),
      );

      if (response.statusCode == 200) {
        // If the server returns a 200 OK response, the address was successfully updated
        return true;
      } else {
        // If the server returns any other response, throw an error
        throw Exception('Failed to update address');
      }
    } catch (e) {
      print("Error while updating address: $e");
      return false; // Return false in case of an error
    }
  }
}

class paymentApiService {
  static String API_URL = "http://$api"; // Replace with your API URL

  // Function to update the payment status
  Future<bool> updatePaymentStatus(String orderId, String paymentStatus) async {
    final String url = '$API_URL/api/orders/updatePayment'; // API endpoint

    try {
      // Prepare the data for the API call
      final response = await http.put(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'orderId': orderId,
          'paymentStatus': paymentStatus,
        }),
      );

      // Check if the response status is successful (status code 200)
      if (response.statusCode == 200) {
        // Parse the response
        final responseData = json.decode(response.body);
        print("Payment status updated successfully: ${responseData}");
        return true; // Success
      } else {
        print("Failed to update payment status: ${response.statusCode}");
        return false; // Failure
      }
    } catch (e) {
      print("Error occurred while updating payment status: $e");
      return false; // Failure
    }
  }
}

class rejectviewfunc {
  final String apiUrl =
      'http://$api/api/rejectlist'; // Replace with your actual API endpoint

  Future<List<OrderAssignment>> fetchOrderAssignments() async {
    final response = await http.get(Uri.parse(apiUrl));

    if (response.statusCode == 200) {
      List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => OrderAssignment.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load order assignments');
    }
  }
}
