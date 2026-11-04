import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class delivery_order_details extends StatefulWidget {
  const delivery_order_details({super.key});

  @override
  State<delivery_order_details> createState() => _delivery_order_detailsState();
}

class _delivery_order_detailsState extends State<delivery_order_details> {
  TextEditingController fromdateInput = TextEditingController();
  String fromdate = DateFormat("dd-MMM-yyyy").format(DateTime.now());
  var formatter = DateFormat('dd-MMM-yyyy');
  final place = <String>[
    'Woraiyur', 'Thilainagar', 'Mraket', 'Juction','Vayaulur'
  ];
  final List<String> name = <String> [
    'Suresh', 'Rani', 'Ravi',
    'Jack',
    'Vijay',
  ];

  final cloth = <String>[
    '4', '5', '2', '2','1'
  ];

  final Pickups = <String>[
    'Assign', 'Assigned to Mike', 'Assigned to Harry', 'Assign','Assign'
  ];

  final clothcount = <String>[
    '1.Cotton Kurti - 3\n2.Shirt - 2\n3.Vesti - 1\n4.Cotton Saree - 2', '1.Silk Kurti - 3\n2.T-Shirt - 2\n3.Vesti - 1\n4.Cotton Saree - 2\n5.Shirt - 2\n', '1.Cotton Saree - 2\n2.Shirt - 2', '1.Cotton Silk Saree - 2\n2.Cotton Shirt - 2','1.Cotton Silk Saree'
  ];


  final service = <String>[
    'Washing\nIroning\nWashing & Ironing\nWashing', 'Washing\nWashing\nIroning\nWashing&Ironing\nIroning\n', 'Washing\nWashing&Ironing', 'Washing&Ironing\nWashing','Washing&Ironing'
  ];


  final List<String> myList = <String> [
    'Suresh', 'Rani', 'Ravi',
    'Jack',
    'Vijay',
  ];

  final List<String> time = <String> [
    '9.34 am', '3.03 pm', '10.55 am',
    '2.30 pm',
    '9.34 am',
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
        leading:IconButton(
          icon: Icon(Icons.arrow_back,color: Colors.black,), onPressed: () {
            Navigator.pop(context);
        },
        ),
        backgroundColor: Colors.transparent,
        title: Text("Delivery Orders",
          style: TextStyle(color: Colors.black,),),


      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: SingleChildScrollView(
            child: Column(
              children: [
                Card(
                  color:  Color(0xFFE8F5E9),
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
                          leading: Icon(CupertinoIcons.cube_box_fill),
                          title: Text("Delivery Orders ",style: TextStyle(fontWeight: FontWeight.w700,fontSize: 17  ),),
                          trailing: Text("50",style: TextStyle(fontWeight: FontWeight.w700,fontSize: 17  ),),
                        ),
                      ],
                    ),
                  ),
                ),


                Container(
                  child: ListView.builder(
                    shrinkWrap: true,
                    physics: BouncingScrollPhysics(),
                    itemCount: place.length,
                    itemBuilder: (context, index) =>

                        Card(
                          color: Colors.white,
                          child: ExpansionTile(
                            collapsedShape: RoundedRectangleBorder(
                              side: BorderSide.none,
                            ),
                            shape: RoundedRectangleBorder(
                              side: BorderSide.none,
                            ),

                            title: ListTile(
                              title:  RichText(
                                text: TextSpan(
                                  children: [
                                    TextSpan(
                                      text: 'Booking Time : ',
                                      style: TextStyle(
                                          color: Colors.blue,     fontSize: 13
                                      ),
                                    ),   TextSpan(
                                      text: time[index]+'\n\n',
                                      style: TextStyle(
                                          color: Colors.black,     fontSize: 13
                                      ),
                                    ),
                                    TextSpan(
                                      text: name[index].toString(),
                                      style: TextStyle(fontWeight: FontWeight.bold,color: Colors.black,fontSize: 14),
                                    ),

                                  ],
                                ),
                              ),
                              subtitle: Text(place[index].toString()+"\nType.of clothes : "+cloth[index].toString()+"\n"+number[index].toString() ),

                            ),
                            subtitle:
                            Pickups[index]=="Assign"?
                            Container(
                                alignment: Alignment.topLeft,
                                width: 20,
                                child: ElevatedButton(

                                    style: ButtonStyle(
                                      backgroundColor: MaterialStateProperty.all(Color(0xFFFFCC80),),
                                    ),
                                    onPressed: (){}, child: Text("Assign",style: TextStyle(color: Colors.white),)))
                                :
                            Text(
                              Pickups[index],
                              style: TextStyle(
                                  color: Pickups[index]=="Assign"?Color(0xffFF7D29):Pickups[index]=="Delivery"? Color(0xFF1B5E20):Pickups[index]=="Pick up"? Colors.blue:Colors.teal
                              ),
                            ),
                            children: <Widget>[
                              ListTile(
                                title: Container(

                                  child: Text(
                                    clothcount[index].toString(),
                                    style: TextStyle(fontWeight: FontWeight.w700),
                                  ),
                                ),
                                subtitle:  Text(
                                  service[index].toString(),
                                  style: TextStyle(fontWeight: FontWeight.w700),
                                ),

                              )
                            ],
                          ),
                        ),),
                )


              ],
            ),
          ),
        ),
      ),

    );
  }
}
