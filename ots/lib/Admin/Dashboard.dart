import 'dart:async';

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:intl/intl.dart';
import 'package:ots/Admin/submitorder.dart';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import '../API/api.dart';
import '../Customer/Signin.dart';
import '../Model/admgetallordermodel.dart';
import 'Alerts.dart';
import 'Anchor_details/view_anchordetails.dart';
import 'Category/view_category.dart';
import 'Customer/customerview.dart';
import 'Service/view_services.dart';
import 'order/view_order.dart';

class Adm_dashboard extends StatefulWidget {
  const Adm_dashboard({
    super.key,
  });

  @override
  State<Adm_dashboard> createState() => _Adm_dashboardState();
}

class _Adm_dashboardState extends State<Adm_dashboard> {
  int user_type = 0;
  String userID = "";
  int company_Id = 0;
  getuser() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    setState(() {
      user_type = pref.getInt("user_type")!;
      userID = pref.getString("userID")!;
      company_Id = pref.getInt("company_Id")!;
    });
  }

  int totalorders = 0;
  int pending = 0;
  int compeleted = 0;
  int Picks = 0;
  int Deliveries = 0;
  Timer? _timer;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getuser();
    futureOrders = getorderdetailsfunc().getorderdetailsfunction();
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
        futureOrders = getorderdetailsfunc().getorderdetailsfunction();
      });
    });
  }

  late Future<List<Admorderdetailsmodel>> futureOrders;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // backgroundColor: Color(0xFFBBDEFB),
      appBar: AppBar(
        //    backgroundColor: Color(0xFFBBDEFB),
        title: Text(
          "Dashborad",
          style: TextStyle(fontSize: 22),
        ),
        actions: [
          Padding(
            padding: EdgeInsets.all(8.0),
            child: Container(
              alignment: Alignment.topRight,
              child: PopupMenuButton(
                child: Image(
                    image: AssetImage(
                        "assets/OTSLOGO.png") // Optional: transparent background if image has rounded edges
                    ),
                onSelected: (value) {
                  // your logic
                },
                itemBuilder: (BuildContext bc) {
                  return [
                    PopupMenuItem(
                      onTap: () {
                        showDialog<void>(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              title: const Text('Logout'),
                              content:
                                  const Text('Do you really want to logout?'),
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
                                    await prefs.remove('user_type');
                                    await prefs.remove('userID');
                                    await prefs.remove('company_Id');
                                    Navigator.of(context).pushAndRemoveUntil(
                                        MaterialPageRoute(builder: (context) {
                                      return signIn();
                                    }), (route) => false);
                                  },
                                ),
                              ],
                            );
                          },
                        );
                      },
                      child: InkWell(child: Text("Logout")),
                      value: '/about',
                    ),
                  ];
                },
              ),
            ),
          )
        ],
      ),
      body: Stack(
        children: [
          today_status(),
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
                height: 200, // Height of the bottom container
                decoration: BoxDecoration(
                  color: Color(0xff004aad),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(40)),
                ),
                child: GridView.count(
                  crossAxisCount: 4, // 3 items per row
                  mainAxisSpacing: 10,
                  crossAxisSpacing: 0,
                  //   padding: EdgeInsets.all(16),
                  children: [
                    // First Row
                    _buildIconCard(
                      context,
                      "assets/shirt (1).png",
                      "Products",
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => viewcategory(
                              user_type: user_type,
                              company_Id: company_Id,
                            ),
                          ),
                        );
                      },
                    ),
                    _buildIconCard(
                      context,
                      "assets/washing-machine (3).png",
                      "Services",
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ViewService(
                              company_Id: company_Id,
                              userId: userID,
                            ),
                          ),
                        );
                      },
                    ),
                    _buildIconCard(
                      context,
                      "assets/checkout.png",
                      "Submit Order",
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => LaundryOrderScreen(
                                    company_Id: company_Id,
                                  )),
                        );
                      },
                    ),
                    _buildIconCard(
                      context,
                      "assets/indian-rupee.png",
                      "Cash",
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => paymentys()),
                        );
                      },
                    ),
                    // Second Row
                    _buildIconCard(
                      context,
                      "assets/delivery (1).png",
                      "Anchor Details",
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => view_anchor(
                              companyid: company_Id,
                            ),
                          ),
                        );
                      },
                    ),
                    _buildIconCard(
                      context,
                      "assets/box.png",
                      "Order Details",
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ordersHomePage(
                              companyid: company_Id,
                            ),
                          ),
                        );
                      },
                    ),
                    _buildIconCard(
                      context,
                      "assets/people.png",
                      "Customer",
                      () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => CustomerDataTable(),
                          ),
                        );
                      },
                    ),
                  ],
                )),
          ),
        ],
      ),
    );
  }

  Widget _buildIconCard(BuildContext context, String imagePath, String label,
      VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisAlignment:
            MainAxisAlignment.center, // Center the content vertically
        children: [
          Container(
            height: 50,
            width: 50,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [
                  Color(0xffe0f7fa), Color(0xffe0f7fa), // Light cyan
                  // Soft blue
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: ClipOval(
              // Clip the image to fit within the circular shape
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: ColorFiltered(
                  colorFilter: ColorFilter.mode(
                    Colors.deepOrange,
                    BlendMode.srcATop, // Blend mode to apply the color
                  ),
                  child: Image.asset(
                    imagePath,
                    fit: BoxFit.cover, // Use cover to fill the circle
                  ),
                ),
              ),
            ),
          ),
          SizedBox(height: 8), // Space between icon and text
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIconCard1(
      BuildContext context, String details, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisAlignment:
            MainAxisAlignment.center, // Center the content vertically
        children: [
          Container(
            height: 50,
            width: 80,
            child: Card(
              elevation: 5,
              shape: RoundedRectangleBorder(
                borderRadius:
                    BorderRadius.circular(2), // Set the radius to zero
              ),
              //    color: Color(0xFF1565C0),
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: ColorFiltered(
                  colorFilter: ColorFilter.mode(
                    //Colors.white,
                    Color(0xFFB71C1C),
                    BlendMode.srcATop, // Blend mode to apply the color
                  ),
                  child: Center(
                      child: Text(
                    details,
                    style: TextStyle(fontWeight: FontWeight.w600),
                  )),
                ),
              ),
            ),
          ),
          SizedBox(height: 8), // Space between icon and text
          Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
          ),
        ],
      ),
    );
  }

  today_status() {
    return Column(
      children: [
        Container(
          child: FutureBuilder<List<Admorderdetailsmodel>>(
            future:
                futureOrders, // Assuming futureOrders is a Future<List<Admorderdetailsmodel>>
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                // Log the error and show a message or dialog
                print("Error: No orders found.");
                return Center(child: Text("No orders found"));
              } else if (snapshot.hasData && snapshot.data!.isEmpty) {
                // No orders found
                return Center(child: Text("No orders found"));
              } else if (snapshot.hasData) {
                // Access the list of orders from the snapshot
                List<Admorderdetailsmodel> orders = snapshot.data!;

                // Calculate order counts
                int completedOrders = orders
                    .where((order) => order.statusName == 'Completed')
                    .length;
                int pendingOrders = orders
                    .where((order) => order.statusName == 'Pending')
                    .length;
                int pickOrders =
                    orders.where((order) => order.statusName == 'Pick').length;
                int deliveryOrders =
                    orders.where((order) => order.statusName == 'Drop').length;
                int readyToPick = orders
                    .where((order) => order.statusName == 'Ready to Pick')
                    .length;
                int readyToDrop = orders
                    .where((order) => order.statusName == 'Ready to Drop')
                    .length;
                int cancel = orders
                    .where((order) => order.statusName == 'User Cancelled')
                    .length;
                int process = readyToDrop + readyToPick;
                int totalOrders = orders.length;

                int processChart =
                    pickOrders + deliveryOrders + readyToPick + readyToDrop;

                final DateTime today = DateTime.now();
                final DateTime previousDay = today.subtract(Duration(days: 1));

                // Count the orders for today and the previous day using the orders list
                final int todayOrders = countOrdersForDay(orders, today);
                final int previousDayOrders =
                    countOrdersForDay(orders, previousDay);

                return Column(
                  children: [
                    Container(
                      height: MediaQuery.of(context).size.height / 4,
                      child: GridView.count(
                        crossAxisCount: 3,
                        mainAxisSpacing: 0,
                        crossAxisSpacing: 40,
                        padding: EdgeInsets.all(16),
                        children: [
                          _buildIconCard1(
                              context, totalOrders.toString(), "Orders", () {}),
                          _buildIconCard1(context, pendingOrders.toString(),
                              "Pendings", () {}),
                          _buildIconCard1(
                              context, process.toString(), "Process", () {}),
                          _buildIconCard1(context, deliveryOrders.toString(),
                              "Delivery", () {}),
                          _buildIconCard1(
                            context,
                            pickOrders.toString(),
                            "Pickups",
                            () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      ordersHomePage(companyid: company_Id),
                                ),
                              );
                            },
                          ),
                          _buildIconCard1(
                              context, cancel.toString(), "Cancel", () {}),
                        ],
                      ),
                    ),
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Container(
                          height: 150,
                          width: 100,
                          child: OrderStatusPieChart(
                            completed: completedOrders,
                            pending: pendingOrders,
                            process: processChart,
                            cancel: cancel,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(bottom: 50),
                          child: Container(
                            height: 100,
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Icon(Icons.star,
                                        size: 20, color: Color(0xFF81C784)),
                                    SizedBox(width: 8),
                                    Text("Completed($completedOrders)"),
                                  ],
                                ),
                                Spacer(),
                                Row(
                                  children: [
                                    Icon(Icons.star,
                                        size: 20, color: Color(0xFF90CAF9)),
                                    SizedBox(width: 8),
                                    Text("Process($processChart)     "),
                                  ],
                                ),
                                Spacer(),
                                Row(
                                  children: [
                                    Icon(Icons.star,
                                        size: 20, color: Color(0xFFD95F59)),
                                    SizedBox(width: 8),
                                    Text("Pending($pendingOrders)      "),
                                  ],
                                ),
                                Spacer(),
                                Row(
                                  children: [
                                    Icon(Icons.star,
                                        size: 20, color: Color(0xFFEF9A9A)),
                                    SizedBox(width: 8),
                                    Text("Cancel($cancel)        "),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 30),
                    DailyOrderComparisonBarChart(
                      previousDayOrders: previousDayOrders,
                      todayOrders: todayOrders,
                    ),
                  ],
                );
              } else {
                // Handle unexpected state
                return Center(child: CircularProgressIndicator());
              }
            },
          ),
        ),
      ],
    );
  }

  int countOrdersForDay(List<Admorderdetailsmodel> orders, DateTime day) {
    return orders.where((order) {
      DateTime orderDate =
          order.orderDate; // Directly use orderDate if it's already a DateTime
      return DateFormat('yyyy-MM-dd').format(orderDate) ==
          DateFormat('yyyy-MM-dd').format(day);
    }).length;
  }

  Widget dashboard() {
    return Flexible(
      child: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        child: CustomScrollView(
          primary: false,
          slivers: <Widget>[
            SliverPadding(
              padding: const EdgeInsets.all(8),
              sliver: SliverGrid.count(
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                crossAxisCount: 3,
                children: <Widget>[
                  InkWell(
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => viewcategory(
                                    user_type: user_type,
                                    company_Id: company_Id,
                                  )));
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Color(0xffe0f7fa), // Light cyan
                            Color(0xffb2ebf2) // Soft blue
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            height: 80,
                            width: 80,
                            child: Image(
                              image: AssetImage("assets/clothes.png"),
                              fit: BoxFit.fitWidth,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(
                              "Products",
                              style: TextStyle(
                                  fontSize: 15, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => ViewService(
                                    company_Id: company_Id,
                                    userId: userID,
                                  )));
                    },
                    child: Card(
                      elevation: 10,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Color(0xfffff9c4), // Light yellow
                              Color(0xffffecb3) // Pastel gold
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              height: 80,
                              width: 80,
                              child: Image(
                                image:
                                    AssetImage("assets/laundry-unscreen.gif"),
                                fit: BoxFit.fitWidth,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                "Services",
                                style: TextStyle(
                                    fontSize: 15, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => view_anchor(
                                    companyid: company_Id,
                                  )));
                    },
                    child: Card(
                      elevation: 10,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Color(0xffe8f5e9), // Soft green
                              Color(0xffc8e6c9) // Pastel green
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              height: 80,
                              width: 80,
                              child: Image(
                                image: AssetImage("assets/warehouse.png"),
                                fit: BoxFit.fitWidth,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                "Anchor Details",
                                style: TextStyle(
                                    fontSize: 15, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => ordersHomePage(
                                    companyid: company_Id,
                                  )));
                    },
                    child: Card(
                      elevation: 10,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Color(0xfff3e5f5), // Soft purple
                              Color(0xffe1bee7) // Light lavender
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              height: 80,
                              width: 80,
                              child: Image(
                                image: AssetImage("assets/logistic.png"),
                                fit: BoxFit.fitWidth,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                "Order Details",
                                style: TextStyle(
                                    fontSize: 15, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => ordersHomePage(
                                    companyid: company_Id,
                                  )));
                    },
                    child: Card(
                      elevation: 10,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Color(0xfff3e5f5), // Soft purple
                              Color(0xffe1bee7) // Light lavender
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                        padding: const EdgeInsets.all(8),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              height: 80,
                              width: 80,
                              child: Image(
                                image: AssetImage("assets/logistic.png"),
                                fit: BoxFit.fitWidth,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                "Order Details",
                                style: TextStyle(
                                    fontSize: 15, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class OrderStatusPieChart extends StatefulWidget {
  final int completed;
  final int pending;
  final int process;
  final int cancel;

  const OrderStatusPieChart({
    Key? key,
    required this.completed,
    required this.pending,
    required this.process,
    required this.cancel,
  }) : super(key: key);

  @override
  _OrderStatusPieChartState createState() => _OrderStatusPieChartState();
}

class _OrderStatusPieChartState extends State<OrderStatusPieChart> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: <Widget>[
          SizedBox(height: 10),
          // Reducing the height of the container to fit the smaller pie chart
          Container(
            height: 50, // Adjust this height to make the chart more compact
            child: PieChart(
              PieChartData(
                sections: _buildPieChartSections(),
                centerSpaceRadius: 30, // Adjusted center space
                sectionsSpace: 1, // Reduced space between sections
                startDegreeOffset: -90,
                borderData: FlBorderData(show: false),
                // Enable animation and set the duration
                pieTouchData: PieTouchData(
                  enabled: true,
                  touchCallback: (FlTouchEvent event, pieTouchResponse) {},
                ),
              ),
              // Animation duration
              swapAnimationDuration: Duration(milliseconds: 800),
              swapAnimationCurve: Curves.easeInOut,
            ),
          ),
        ],
      ),
    );
  }

  List<PieChartSectionData> _buildPieChartSections() {
    final completedColor = Color(0xFF81C784);
    final pendingColor = Color(0xFFD95F59);
    final processcolor = Color(0xFF90CAF9);
    final cancelcolor = Color(0xFFEF9A9A);

    final total = widget.completed + widget.pending;
    final completedPercentage = (widget.completed / total) * 100;
    final pendingPercentage = (widget.pending / total) * 100;
    final cancelPercentage = (widget.cancel / total) * 100;
    final processPercentage = (widget.process / total) * 100;

    return [
      PieChartSectionData(
        color: cancelcolor,
        value: cancelPercentage,
        title: '',
        titleStyle: TextStyle(
            fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black),
        radius: 50, // Reduced radius
      ),
      PieChartSectionData(
        color: completedColor,
        value: completedPercentage,
        title: '',
        titleStyle: TextStyle(
            fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black),
        radius: 50, // Reduced radius
      ),
      PieChartSectionData(
        color: pendingColor,
        value: pendingPercentage,
        title: '',
        titleStyle: TextStyle(
            fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black),
        radius: 50, // Reduced radius
      ),
      PieChartSectionData(
        color: processcolor,
        value: processPercentage,
        title: '',
        titleStyle: TextStyle(
            fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black),
        radius: 50, // Reduced radius
      ),
    ];
  }
}

class DailyOrderComparisonBarChart extends StatelessWidget {
  final int previousDayOrders;
  final int todayOrders;

  const DailyOrderComparisonBarChart({
    Key? key,
    required this.previousDayOrders,
    required this.todayOrders,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 3,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: BarChart(
          BarChartData(
            titlesData: FlTitlesData(
              leftTitles: AxisTitles(
                sideTitles: SideTitles(showTitles: true),
              ),
              bottomTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  getTitlesWidget: (value, meta) {
                    switch (value.toInt()) {
                      case 0:
                        return Text('Previous Day');
                      case 1:
                        return Text('Today');
                      default:
                        return Container();
                    }
                  },
                ),
              ),
              topTitles: AxisTitles(
                sideTitles: SideTitles(showTitles: false),
              ),
              rightTitles: AxisTitles(
                sideTitles: SideTitles(showTitles: false),
              ),
            ),
            gridData: FlGridData(show: true),
            borderData: FlBorderData(
              show: true,
              border: Border.all(color: Color(0xFFD6D6D6), width: 1),
            ),
            barGroups: [
              BarChartGroupData(
                x: 0,
                barRods: [
                  BarChartRodData(
                    toY: previousDayOrders.toDouble(),
                    color: Colors.blue,
                    width: 20,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ],
                showingTooltipIndicators: [0],
              ),
              BarChartGroupData(
                x: 1,
                barRods: [
                  BarChartRodData(
                    toY: todayOrders.toDouble(),
                    color: Colors.green,
                    width: 20,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ],
                showingTooltipIndicators: [0],
              ),
            ],
            minY: 0,
            // maxY: (previousDayOrders > todayOrders
            //         ? previousDayOrders
            //         : todayOrders) +
            //     5, // Set max Y slightly higher for padding
          ),
        ),
      ),
    );
  }
}
