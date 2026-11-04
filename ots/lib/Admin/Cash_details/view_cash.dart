import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class view_cash extends StatefulWidget {
  const view_cash({super.key});

  @override
  State<view_cash> createState() => _view_cashState();
}

class _view_cashState extends State<view_cash> {

  TextEditingController fromdateInput = TextEditingController();
  String fromdate = DateFormat("dd-MMM-yyyy").format(DateTime.now());
  var formatter = DateFormat('dd-MMM-yyyy');
  final place = <String>[
    'Woraiyur', 'Thilainagar', 'Mraket', 'Juction','Vayaulur'
  ];
  final List<String> name = <String> [
    'Karthi', 'Ravi',
    'Kumar',
    'Ganesh',
    'Vijay'
  ];

  final cloth = <String>[
    '4', '5', '2', '2','1'
  ];

  final status = <String>[
    'Pick up', 'Delivery', 'Processing', 'Assign','Processing'
  ];

  final clothcount = <String>[
    '1.Cotton Kurti - 3\n2.Shirt - 2\n3.Vesti - 1\n4.Cotton Saree - 2', '1.Silk Kurti - 3\n2.T-Shirt - 2\n3.Vesti - 1\n4.Cotton Saree - 2\n5.Shirt - 2\n', '1.Cotton Saree - 2\n2.Shirt - 2', '1.Cotton Silk Saree - 2\n2.Cotton Shirt - 2','1.Cotton Silk Saree'
  ];


  final service = <String>[
    'Washing\nIroning\nWashing & Ironing\nWashing', 'Washing\nWashing\nIroning\nWashing&Ironing\nIroning\n', 'Washing\nWashing&Ironing', 'Washing&Ironing\nWashing','Washing&Ironing'
  ];

  final List<String> myList = <String> [
    'Karthi', 'Ravi',
    'Kumar',
    'Ganesh',
  ];
  final List<String> image = <String> [
    'assets/profile1.jpg', 'assets/profile2.jpg', 'assets/profile3.jpg',
    'assets/profile4.jpg',
  ];

  final number = <String>[
    '9876543210', '9876543211', '9876543212', '987654312','9876543214'
  ];
  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    fromdateInput.text = fromdate;

  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Cash"),
      ),

      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: SingleChildScrollView(
            child: Column(
              children: [

                Card(
                  child: Container(
                    child: Column(
                      children: [
                        ListTile(
                          leading: Icon(Icons.calendar_month),
                          title: Text("Date ",style: TextStyle(fontWeight: FontWeight.w700,fontSize: 17  ),),
                          trailing: Text(fromdate,style: TextStyle(fontWeight: FontWeight.w700,fontSize: 15),),
                          onTap: () async {
                            DateTime? date = await showDatePicker(
                              context: context,
                              initialDate: DateTime(
                                  DateTime.now().year,
                                  DateTime.now().month,
                                  DateTime.now().day),
                              firstDate: DateTime(
                                  DateTime.now().year,
                                  DateTime.now().month,
                                  DateTime.now().day - 180),
                              lastDate: new DateTime(
                                  DateTime.now().year,
                                  DateTime.now().month,
                                  DateTime.now().day + 30),
                            );
                            if (date != null) {
                              setState(() {
                                fromdate = formatter.format(date);
                                fromdateInput.text = fromdate;
                                // fromdate =
                                //     "${date.day}-${date.month}-${date.year}";
                                print(fromdate);
                              });
                            }
                          },
                        ),
                        ListTile(
                          leading: Icon(Icons.currency_rupee),
                          title: Text("Total Amount",style: TextStyle(fontWeight: FontWeight.w700,fontSize: 17  ),),
                          trailing: Text("7000",style: TextStyle(fontWeight: FontWeight.w700,fontSize: 17  ),),
                        ),
                      ],
                    ),
                  ),
                ),

                Card(
                  color: Color(0xFFC8E6C9),
                  child: Container(
                    child: Column(
                      children: [
                        ListTile(
                          leading: Icon(Icons.payments_outlined),
                          title: Text("Month wise Salary Details ",style: TextStyle(fontWeight: FontWeight.w700,fontSize: 17  ),),
                        ),
                        ListTile(
                          leading: Icon(Icons.currency_rupee),
                          title: Text("Total Salary Amount ",style: TextStyle(fontWeight: FontWeight.w700,fontSize: 17  ),),
                          trailing: Text("5000",style: TextStyle(fontWeight: FontWeight.w700,fontSize: 17  ),),
                        ),

                      ],
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
}
