import 'package:flutter/material.dart';

class delivery extends StatefulWidget {
  const delivery({super.key});

  @override
  State<delivery> createState() => _deliveryState();
}

class _deliveryState extends State<delivery> {
  @override
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
    'Rossy', 'Jeni', 'Kavin',
    'Jason',
    'Vijay',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Ready to delivery"),
      ),
      body: LayoutBuilder(builder: (context, constraints) {
        return ListView.builder(
          itemCount: place.length,
          itemBuilder: (context, index) => ItemTile3(index,myList[index],place[index] ,number[index],cloth[index],time[index]),

        );
      }),
    );
  }
}

class ItemTile3 extends StatelessWidget {
  final int itemNo;
  final String name;
  final String place;
  final String number;
  final String cloth;  final String time;


  ItemTile3(
      this.itemNo, this.name, this.place, this.number, this.cloth, this.time,
      );
  final List<String> myList = <String> [
    'Karthi', 'Ravi',
    'Kumar',
    'Ganesh',
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
                showModalBottomSheet(context: context, builder:openCustomSettings(context),);
              }, child: Text("Assign"),),

            ),
          )

      );




  }
  openCustomSettings(BuildContext context) {
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
                      itemBuilder: (context, index) => ItemTile4(myList[index],image[index]),

                    );
                  }),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

}


class ItemTile4 extends StatelessWidget {

  final String name;
  final String image;



  ItemTile4(
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
