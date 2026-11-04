import 'dart:collection';

import 'package:flutter/material.dart';

import 'delivery.dart';



class App1 extends StatefulWidget {

  const App1({
    Key? key,
  }) : super(key: key);

  @override
  State<App1> createState() => _App1State();
}

class _App1State extends State<App1> {
  ListQueue<int> _navigationQueue = ListQueue();
  int index = 0;



  @override
  void initState() {
    // TODO: implement initState
    super.initState();

  }

  @override
  Widget build(BuildContext context) {
    ThemeData theme = Theme.of(context);

    return WillPopScope(
      ///this method will be called on press of the back button
      onWillPop: () async {
        //Use this code if you just want to go back to 0th index
        if (index == 0) return true;
        setState(() {
          index = 0;
        });
        return false;
      },
      child: Scaffold(
        body: (getBody(index)),
        bottomNavigationBar: BottomNavigationBar(
          backgroundColor: Colors.white,
          selectedItemColor: Color(0xFFf5851f),
          unselectedItemColor: Colors.grey,
          type: BottomNavigationBarType.fixed,
          currentIndex: index,
          onTap: (value) {
            _navigationQueue.addLast(index);
            setState(() => index = value);
            //print(value);
          },
          items: [
            BottomNavigationBarItem(
                icon: Icon(Icons.local_shipping_outlined, size: 28), label: 'Pickup'),
            BottomNavigationBarItem(
              icon: Icon(Icons.local_shipping_rounded, size: 28),
              label: 'Delivery',
            ),
          ],
        ),
      ),
    );
  }

  getBody(int index) {
    switch (index) {
      case 0:
        return pickup(
        );
      case 1:
        return delivery(

        );
    }
  }

}

class pickup extends StatefulWidget {
  const pickup({super.key});

  @override
  State<pickup> createState() => _pickupState();
}

class _pickupState extends State<pickup> {

  final place = <String>[
    'Woraiyur', 'Thilainagar', 'Mraket', 'Juction','Vayaulur'
  ];


    final cloth = <String>[
    '5', '8', '15', '9','4'
  ];


  final number = <String>[
    '9876543210', '9876543211', '9876543212', '987654312','9876543214'
  ];
  final List<String> time = <String> [
    '9.34 am', '3.03 pm', '10.55 am',
    '2.30 pm',
    '9.34 am',
  ];

  final List<String> myList = <String> [
    'Suresh', 'Rani', 'Ravi',
    'Jack',
    'Vijay',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Pick up"),
      ),
      body: LayoutBuilder(builder: (context, constraints) {
        return ListView.builder(
          itemCount: place.length,
          itemBuilder: (context, index) => ItemTile1(index,myList[index],place[index] ,number[index],cloth[index],time[index]),

        );
      }),
    );
  }
}

class ItemTile1 extends StatelessWidget {
  final int itemNo;
  final String name;
  final String place;
  final String number;
  final String cloth;
  final String time;


   ItemTile1(
      this.itemNo, this.name, this.place, this.number, this.cloth, this.time,
      );
  final List<String> myList = <String> [
    'Suresh', 'Ravi',
    'Jack',
    'Vijay',
  ];
  final List<String> image = <String> [
    'assets/profile1.jpg', 'assets/profile2.jpg', 'assets/profile3.jpg',
    'assets/profile4.jpg',
  ];

  @override
  Widget build(BuildContext context) {


    return
      Padding(
        padding: const EdgeInsets.all(8.0),
        child: Card(

          child: ListTile(
            title: RichText(
              text: TextSpan(
                children: [
                  TextSpan(
                    text: 'Booking Time : ',
                    style: TextStyle(
                        color: Colors.blue,     fontSize: 13
                    ),
                  ),   TextSpan(
                    text: time+'\n\n',
                    style: TextStyle(
                        color: Colors.black,     fontSize: 13
                    ),
                  ),
                  TextSpan(
                    text: name.toString(),
                    style: TextStyle(fontWeight: FontWeight.bold,color: Colors.black,fontSize: 14),
                  ),

                ],
              ),
            ),
            subtitle: Text(place+"\nNo.of clothes : "+cloth+"\n"+number ),

            trailing: TextButton(onPressed: () {
              showModalBottomSheet(
                context: context,
                builder: (context) {
                  return Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Color.fromARGB(115, 231, 231, 231),
                          Color.fromARGB(77, 131, 131, 131),
                        ],
                        begin: Alignment.center,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                    ),
                    child:  Padding(
                      padding: EdgeInsets.all(20),
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Available People',style: TextStyle(fontWeight: FontWeight.bold,fontSize: 15),),
                          Container(
                            height: MediaQuery.of(context).size.height/2.3,
                            // color: Colors.red,
                            child: LayoutBuilder(builder: (context, constraints) {
                              return ListView.builder(
                                itemCount: myList.length,
                                itemBuilder: (context, index) => ItemTile2(myList[index],image[index]),

                              );
                            }),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              );
            }, child: Text("Assign"),),

          ),
        )

      );




  }


}


class ItemTile2 extends StatelessWidget {

  final String name;
  final String image;



  ItemTile2(
      this.name, this.image,
      );

  @override
  Widget build(BuildContext context) {


    return
      Padding(
          padding: const EdgeInsets.all(8.0),
          child: Card(

            child: ListTile(
              leading: Container(
                height: 40,
                child: CircleAvatar(
                  backgroundImage:
                  AssetImage(image),
                  backgroundColor: Colors.transparent,

                ),
              ),
              title: Text(name,),


              trailing: TextButton(onPressed: () {

              }, child: Text("Assign"),),

            ),
          )

      );




  }


}
