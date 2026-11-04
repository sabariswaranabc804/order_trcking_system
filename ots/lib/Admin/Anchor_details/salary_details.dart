import 'package:flutter/material.dart';

class salarydetails extends StatefulWidget {
  const salarydetails({super.key});

  @override
  State<salarydetails> createState() => _salarydetailsState();
}

class _salarydetailsState extends State<salarydetails> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: SingleChildScrollView(
            child: Column(
              children: [
                SizedBox(
                  height: 50,
                  child: TextField(
                    cursorColor: Colors.grey,
                    decoration: InputDecoration(
                        fillColor:Color(0xFFFFE0B2),
                        filled: true,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide.none,),
                        hintText: 'Search by name or ID',
                        hintStyle: TextStyle(
                            color: Colors.grey,
                            height: 1,
                            fontSize: 18
                        ),
                        prefixIcon: Icon(Icons.search,color: Colors.grey,)
                    ),
                  ),
                ),

                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    // Datatable widget that have the property columns and rows.
                      columns: [
                        // Set the name of the column
                        DataColumn(label: Text('ID'),),
                        DataColumn(label: Text('Profile'),),
                        DataColumn(label: Text('Name'),),
                        DataColumn(label: Text('Status'),),

                      ],
                      rows:[
                        // Set the values to the columns
                        DataRow(cells: [
                          DataCell(Text("1")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile1.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("Alex")),
                          DataCell(Text("Avalaible",style: TextStyle(color: Colors.blue),)),

                        ]),


                        DataRow(cells: [
                          DataCell(Text("2")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile2.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("John")),
                          DataCell(Text("Pick up",style: TextStyle(color: Colors.orange),)),

                        ]),     DataRow(cells: [
                          DataCell(Text("3")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile3.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("Harry")),
                          DataCell(Text("Leave",style: TextStyle(color: Colors.red),)),

                        ]),     DataRow(cells: [
                          DataCell(Text("4")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile4.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("Mike")),
                          DataCell(Text("Delivery",style: TextStyle(color: Colors.green),)),

                        ]),      DataRow(cells: [
                          DataCell(Text("1")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile1.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("Alex")),
                          DataCell(Text("Avalaible",style: TextStyle(color: Colors.blue),)),

                        ]),


                        DataRow(cells: [
                          DataCell(Text("2")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile2.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("John")),
                          DataCell(Text("Pick up",style: TextStyle(color: Colors.orange),)),

                        ]),     DataRow(cells: [
                          DataCell(Text("3")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile3.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("Harry")),
                          DataCell(Text("Leave",style: TextStyle(color: Colors.red),)),

                        ]),     DataRow(cells: [
                          DataCell(Text("4")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile4.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("Mike")),
                          DataCell(Text("Delivery",style: TextStyle(color: Colors.green),)),

                        ]),      DataRow(cells: [
                          DataCell(Text("1")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile1.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("Alex")),
                          DataCell(Text("Avalaible",style: TextStyle(color: Colors.blue),)),

                        ]),


                        DataRow(cells: [
                          DataCell(Text("2")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile2.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("John")),
                          DataCell(Text("Pick up",style: TextStyle(color: Colors.orange),)),

                        ]),     DataRow(cells: [
                          DataCell(Text("3")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile3.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("Harry")),
                          DataCell(Text("Leave",style: TextStyle(color: Colors.red),)),

                        ]),     DataRow(cells: [
                          DataCell(Text("4")),
                          DataCell( Container(
                            height: 40,
                            child: CircleAvatar(
                              backgroundImage:
                              AssetImage('assets/profile4.jpg'),
                              backgroundColor: Colors.transparent,

                            ),
                          ),),
                          DataCell(Text("Mike")),
                          DataCell(Text("Delivery",style: TextStyle(color: Colors.green),)),

                        ]),
                      ]
                  ),
                ),



              ],
            ),
          ),
        ),
      ),
    );
  }
}
