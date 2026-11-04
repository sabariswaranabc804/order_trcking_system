import 'dart:async';
import 'dart:convert';
import 'dart:io'; // For File handling
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart'; // For image picking
import '../../API/api.dart';
import '../../Model/getservice.dart';
import '../../main.dart';
import 'add_service.dart';
import 'package:http/http.dart' as http;

class ViewService extends StatefulWidget {
  final int company_Id;
  final String userId;

  const ViewService(
      {super.key, required this.company_Id, required this.userId});

  @override
  State<ViewService> createState() => _ViewServiceState();
}

class _ViewServiceState extends State<ViewService> {
  late Future<List<getService>> getserv;
  bool _isLoading = false;
  Timer? _timer;
  File? _imageFile;

  @override
  void initState() {
    super.initState();
    getserv = get_service(widget.company_Id); // Initial fetch
    _startAutoReload();
  }

  @override
  void dispose() {
    _timer?.cancel(); // Cancel the timer when disposing the widget
    super.dispose();
  }

  void _startAutoReload() {
    _timer = Timer.periodic(Duration(seconds: 3), (timer) {
      setState(() {
        getserv =
            get_service(widget.company_Id); // Update the Future to refresh data
      });
    });
  }

  Future<void> _deleteService(String id) async {
    setState(() => _isLoading = true);
    await servicedelete().servicedeletefunc(id);
    setState(() {
      getserv = get_service(widget.company_Id); // Refresh data after deletion
      _isLoading = false;
    });
  }

  Future<void> _showEditDialog(getService service) async {
    TextEditingController servController =
        TextEditingController(text: service.servName);
    TextEditingController descController =
        TextEditingController(text: service.servDescription);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Edit Service"),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: servController,
                  decoration: InputDecoration(labelText: "Service Name"),
                ),
                TextField(
                  controller: descController,
                  decoration: InputDecoration(labelText: "Service Description"),
                ),
                SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () async {
                    final pickedFile = await ImagePicker().
                        .getImage(source: ImageSource.gallery);
                    if (pickedFile != null) {
                      setState(() {
                        _imageFile = File(pickedFile.path);
                      });
                    }
                  },
                  child: Text("Pick Image"),
                ),
                if (_imageFile != null) ...[
                  SizedBox(height: 10),
                  Image.file(_imageFile!, height: 100, width: 100),
                ],
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text("Cancel"),
            ),
            TextButton(
              onPressed: () async {
                await _editService(
                  service.servId,
                  servController.text,
                  descController.text,
                  _imageFile,
                );
                Navigator.of(context).pop();
                setState(() {
                  getserv =
                      get_service(widget.company_Id); // Refresh data after edit
                });
              },
              child: Text("Save"),
            ),
          ],
        );
      },
    );
  }

  Future<void> _editService(int serv_Id, String servName,
      String servDescription, File? imageFile) async {
    setState(() => _isLoading = true);

    if (servName.isEmpty || servDescription.isEmpty) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("Validation Error"),
            content: Text("All fields are required."),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text("OK"),
              ),
            ],
          );
        },
      );
      setState(() => _isLoading = false);
      return;
    }

    try {
      var request = http.MultipartRequest(
        'PUT',
        Uri.parse('http://$api/api/service/update/$serv_Id'),
      );
      request.headers.addAll({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      });

      // Add text fields to the request
      request.fields['serv_Id'] = serv_Id.toString();
      request.fields['serv_Name'] = servName;
      request.fields['serv_Description'] = servDescription;

      // Add image file to the request if it exists
      if (imageFile != null) {
        request.files.add(
            await http.MultipartFile.fromPath('imagefile', imageFile.path));
      }

      final response = await request.send();

      if (response.statusCode == 200) {
        print('Service edited successfully');
      } else {
        print('Failed to update service: ${response.statusCode}');
        print('Response body: ${await response.stream.bytesToString()}');
      }
    } catch (error) {
      print('Error editing service: $error');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Services"),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(5.0),
          child: LayoutBuilder(builder: (context, constraints) {
            return Container(
              child: Column(
                children: [
                  Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Container(
                      height: MediaQuery.of(context).size.height / 1.18,
                      child: FutureBuilder<List<getService>>(
                        future: getserv,
                        builder: (BuildContext context,
                            AsyncSnapshot<List<getService>> snapshot) {
                          // if (snapshot.connectionState ==
                          //     ConnectionState.waiting) {
                          //   return Center(child: CircularProgressIndicator());
                          // } else
                          if (snapshot.hasError) {
                            return Center(
                                child: Text("Error: ${snapshot.error}"));
                          } else if (snapshot.hasData) {
                            List<getService> data = snapshot.data!;
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 20),
                              child: ListView.builder(
                                itemCount: data.length,
                                itemBuilder: (context, index) {
                                  return Card(
                                    child: Column(
                                      children: [
                                        Container(
                                          height: 100,
                                          decoration: BoxDecoration(
                                            image: DecorationImage(
                                              image: NetworkImage(
                                                  'http://$api/uploads/product-images/${data[index].imagefile}'), // Your image URL
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                        ),
                                        ListTile(
                                          leading: IconButton(
                                            icon: Icon(Icons.edit),
                                            onPressed: () {
                                              _showEditDialog(data[index]);
                                            },
                                          ),
                                          title: Text(data[index].servName),
                                          subtitle: Text(
                                              'Serv_Code: ${data[index].servCode}'),
                                          trailing: IconButton(
                                            icon: Icon(Icons.delete),
                                            onPressed: () async {
                                              showDialog(
                                                context: context,
                                                builder:
                                                    (BuildContext context) {
                                                  return AlertDialog(
                                                    title:
                                                        Text("Delete Service"),
                                                    content: Text(
                                                        "Are you sure you want to delete ${data[index].servName}?"),
                                                    actions: [
                                                      TextButton(
                                                        onPressed: () {
                                                          Navigator.of(context)
                                                              .pop();
                                                        },
                                                        child: Text("Cancel"),
                                                      ),
                                                      TextButton(
                                                        onPressed: () async {
                                                          await _deleteService(
                                                              data[index]
                                                                  .servId
                                                                  .toString());
                                                          Navigator.of(context)
                                                              .pop();
                                                        },
                                                        child: Text("Delete",
                                                            style: TextStyle(
                                                                color: Colors
                                                                    .red)),
                                                      ),
                                                    ],
                                                  );
                                                },
                                              );
                                            },
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            );
                          } else {
                            return Center(child: CircularProgressIndicator());
                          }
                        },
                      ),
                    ),
                  ),
                  SizedBox(height: 20),
                ],
              ),
            );
          }),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => add_service(userId: widget.userId),
            ),
          );
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
// class ViewService extends StatefulWidget {
//   final int company_Id;
//   final String userId;
//
//   const ViewService(
//       {super.key, required this.company_Id, required this.userId});
//
//   @override
//   State<ViewService> createState() => _ViewServiceState();
// }
//
// class _ViewServiceState extends State<ViewService> {
//   late Future<List<getService>> getserv;
//   bool _isLoading = false;
//   File? _imageFile;
//
//   @override
//   void initState() {
//     super.initState();
//     getserv = get_service(widget.company_Id); // Initial fetch
//     _startAutoReload();
//   }
//
//   Timer? _timer;
//   bool _isLoading1 = true; // Track loading state
//
//   @override
//   void dispose() {
//     _timer?.cancel(); // Cancel the timer when disposing the widget
//     super.dispose();
//   }
//
//   void _startAutoReload() {
//     _timer = Timer.periodic(Duration(seconds: 1), (timer) {
//       setState(() {
//         get_service(widget.company_Id);
//       });
//       // Fetch in background
//     });
//   }
//
//   Future<void> _deleteService(String id) async {
//     setState(() => _isLoading = true);
//     await servicedelete().servicedeletefunc(id);
//     setState(() {
//       getserv = get_service(widget.company_Id);
//     });
//     setState(() => _isLoading = false);
//   }
//
//   Future<void> _showEditDialog(getService service) async {
//     TextEditingController servController =
//         TextEditingController(text: service.servName);
//     TextEditingController descController =
//         TextEditingController(text: service.servDescription);
//
//     showDialog(
//       context: context,
//       builder: (BuildContext context) {
//         return AlertDialog(
//           title: Text("Edit Service"),
//           content: SingleChildScrollView(
//             child: Column(
//               mainAxisSize: MainAxisSize.min,
//               children: [
//                 TextField(
//                   controller: servController,
//                   decoration: InputDecoration(labelText: "Service Name"),
//                 ),
//                 TextField(
//                   controller: descController,
//                   decoration: InputDecoration(labelText: "Service Description"),
//                 ),
//                 SizedBox(height: 10),
//                 ElevatedButton(
//                   onPressed: () async {
//                     final pickedFile = await ImagePicker()
//                         .getImage(source: ImageSource.gallery);
//                     if (pickedFile != null) {
//                       setState(() {
//                         _imageFile = File(pickedFile.path);
//                       });
//                     }
//                   },
//                   child: Text("Pick Image"),
//                 ),
//                 if (_imageFile != null) ...[
//                   SizedBox(height: 10),
//                   Image.file(_imageFile!, height: 100, width: 100),
//                 ],
//               ],
//             ),
//           ),
//           actions: [
//             TextButton(
//               onPressed: () => Navigator.of(context).pop(),
//               child: Text("Cancel"),
//             ),
//             TextButton(
//               onPressed: () async {
//                 await _editDeliveryMan(
//                   service.servId,
//                   servController.text,
//                   descController.text,
//                   _imageFile,
//                 );
//                 Navigator.of(context).pop();
//               },
//               child: Text("Save"),
//             ),
//           ],
//         );
//       },
//     );
//   }
//
//   Future<void> _editDeliveryMan(int serv_Id, String servName,
//       String servDescription, File? imageFile) async {
//     setState(() => _isLoading = true);
//
//     if (servName.isEmpty || servDescription.isEmpty) {
//       showDialog(
//         context: context,
//         builder: (BuildContext context) {
//           return AlertDialog(
//             title: Text("Validation Error"),
//             content: Text("All fields are required."),
//             actions: [
//               TextButton(
//                 onPressed: () => Navigator.of(context).pop(),
//                 child: Text("OK"),
//               ),
//             ],
//           );
//         },
//       );
//       setState(() => _isLoading = false);
//       return;
//     }
//
//     try {
//       var request = http.MultipartRequest(
//         'PUT',
//         Uri.parse('http://136.185.14.8:8100/api/service/update/$serv_Id'),
//       );
//       request.headers.addAll({
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
//       });
//
//       // Add text fields to the request
//       request.fields['serv_Id'] = serv_Id.toString();
//       request.fields['serv_Name'] = servName;
//       request.fields['serv_Description'] = servDescription;
//
//       // Add image file to the request if it exists
//       if (imageFile != null) {
//         request.files.add(
//             await http.MultipartFile.fromPath('imagefile', imageFile.path));
//       }
//
//       final response = await request.send();
//
//       if (response.statusCode == 200) {
//         print('Service edited successfully');
//       } else {
//         print('Failed to update service: ${response.statusCode}');
//         print('Response body: ${await response.stream.bytesToString()}');
//       }
//     } catch (error) {
//       print('Error editing service: $error');
//     } finally {
//       setState(() => _isLoading = false);
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text("Services"),
//       ),
//       body: SingleChildScrollView(
//         child: Padding(
//           padding: const EdgeInsets.all(5.0),
//           child: LayoutBuilder(builder: (context, constraints) {
//             return Container(
//               child: Column(
//                 children: [
//                   Padding(
//                     padding: EdgeInsets.all(8.0),
//                     child: Container(
//                       height: MediaQuery.of(context).size.height / 1.18,
//                       child: FutureBuilder<List<getService>>(
//                         future: getserv,
//                         builder: (BuildContext context,
//                             AsyncSnapshot<List<getService>> snapshot) {
//                           if (snapshot.connectionState ==
//                               ConnectionState.waiting) {
//                             return Center(child: CircularProgressIndicator());
//                           } else if (snapshot.hasError) {
//                             return Center(
//                                 child: Text("Error: ${snapshot.error}"));
//                           } else if (snapshot.hasData) {
//                             List<getService> data = snapshot.data!;
//                             return Padding(
//                               padding: const EdgeInsets.only(bottom: 20),
//                               child: ListView.builder(
//                                 itemCount: data.length,
//                                 itemBuilder: (context, index) {
//                                   return Card(
//                                     child: Column(
//                                       children: [
//                                         Container(
//                                           height: 100,
//                                           decoration: BoxDecoration(
//                                             image: DecorationImage(
//                                               image: NetworkImage(
//                                                   'http://136.185.14.8:8100/uploads/product-images/${data[index].imagefile}'), // Your image URL
//                                               fit: BoxFit.cover,
//                                             ),
//                                           ),
//                                         ),
//                                         ListTile(
//                                           leading: IconButton(
//                                             icon: Icon(Icons.edit),
//                                             onPressed: () {
//                                               _showEditDialog(data[index]);
//                                             },
//                                           ),
//                                           title: Text(data[index].servName),
//                                           subtitle: Text(
//                                               'Serv_Code: ${data[index].servCode}'),
//                                           trailing: IconButton(
//                                             icon: Icon(Icons.delete),
//                                             onPressed: () async {
//                                               showDialog(
//                                                 context: context,
//                                                 builder:
//                                                     (BuildContext context) {
//                                                   return AlertDialog(
//                                                     title:
//                                                         Text("Delete Service"),
//                                                     content: Text(
//                                                         "Are you sure you want to delete ${data[index].servName}?"),
//                                                     actions: [
//                                                       TextButton(
//                                                         onPressed: () {
//                                                           Navigator.of(context)
//                                                               .pop();
//                                                         },
//                                                         child: Text("Cancel"),
//                                                       ),
//                                                       TextButton(
//                                                         onPressed: () async {
//                                                           await _deleteService(
//                                                               data[index]
//                                                                   .servId
//                                                                   .toString());
//                                                           Navigator.of(context)
//                                                               .pop();
//                                                         },
//                                                         child: Text("Delete",
//                                                             style: TextStyle(
//                                                                 color: Colors
//                                                                     .red)),
//                                                       ),
//                                                     ],
//                                                   );
//                                                 },
//                                               );
//                                             },
//                                           ),
//                                         ),
//                                       ],
//                                     ),
//                                   );
//                                 },
//                               ),
//                             );
//                           } else {
//                             return Center(
//                                 child: Text("No services available."));
//                           }
//                         },
//                       ),
//                     ),
//                   ),
//                   SizedBox(height: 20),
//                 ],
//               ),
//             );
//           }),
//         ),
//       ),
//       floatingActionButton: FloatingActionButton(
//         onPressed: () {
//           Navigator.push(
//             context,
//             MaterialPageRoute(
//               builder: (context) => add_service(userId: widget.userId),
//             ),
//           );
//         },
//         child: Icon(Icons.add),
//       ),
//     );
//   }
// }
