import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:image_gallery_saver/image_gallery_saver.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:screenshot/screenshot.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class UpiQrCode extends StatelessWidget {
  final double amount;
  final String orderId;
  final ScreenshotController screenshotController = ScreenshotController();

  UpiQrCode({required this.amount, required this.orderId});

  @override
  Widget build(BuildContext context) {
    final transactionNote = 'orderId# $orderId';

    GlobalKey repaintKey = GlobalKey();
    Future<void> _captureAndShareQrCode() async {
      try {
        // Wait until the frame is painted
        WidgetsBinding.instance.addPostFrameCallback((_) async {
          // Get the render object of the RepaintBoundary
          RenderRepaintBoundary boundary = repaintKey.currentContext!
              .findRenderObject() as RenderRepaintBoundary;

          // Capture the image from the RepaintBoundary widget
          var image = await boundary.toImage(
              pixelRatio: 3.0); // Increase pixel ratio for better quality
          ByteData? byteData =
              await image.toByteData(format: ImageByteFormat.png);
          Uint8List uint8List = byteData!.buffer.asUint8List();

          // Save the captured image as a file in the temporary directory
          final directory = await getTemporaryDirectory();
          final filePath = '${directory.path}/qr_code.png';
          final file = File(filePath);

          // Write the Uint8List (image) to the file
          await file.writeAsBytes(uint8List);

          // Optionally, save the image to the gallery (if needed)
          final result = await ImageGallerySaver.saveImage(uint8List);
          print("Image saved to gallery: $result");

          // Share the image file using the share_plus package
          await Share.shareFiles([filePath],
              text: 'Here is my UPI QR code for payment!');
        });
      } catch (e) {
        print("Error capturing QR code: $e");
      }
    }

    String gpay = "9159079191";

    return Scaffold(
        appBar: AppBar(
          title: Text("UPI Payment QR Code"),
          actions: [
            IconButton(
              icon: Icon(Icons.share),
              onPressed: _captureAndShareQrCode,
            ),
          ],
        ),
        body: Center(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  "Total : ${amount}",
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                ),
              ),
              Center(
                child: RepaintBoundary(
                  key: repaintKey, // Attach the GlobalKey here
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      QrImageView(
                        data: Uri.encodeFull(
                          'upi://pay?pa=9159079191@okbizaxis&pn=Kirush Laundry&am=${amount}&cu=INR&tn=${orderId}',
                        ),
                        version: QrVersions.auto,
                        size: 200.0,
                        backgroundColor: Colors.white,
                      ),
                      SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          TextButton(
                            onPressed: _captureAndShareQrCode,
                            child: Text("Share QR "),
                          ),
                          Text(
                            "Or   ",
                            style: TextStyle(
                                fontSize: 15, fontWeight: FontWeight.w600),
                          ),
                          Text("Scan QR"),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(
                height: 10,
              ),
              Text(
                "Or",
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
              Text("Pay to mobile number"),
              Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(gpay),
                    IconButton(
                        onPressed: () {
                          // Text to be copied
                          String textToCopy = gpay;

                          // Copy text to clipboard
                          Clipboard.setData(ClipboardData(text: textToCopy))
                              .then((_) {
                            // Show a snackbar to indicate the text has been copied
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Copied to clipboard!'),
                              ),
                            );
                          });
                        },
                        icon: Icon(Icons.copy)),
                    IconButton(
                        onPressed: () {
                          String textToShare = gpay;

                          // Share the text
                          Share.share(textToShare);
                        },
                        icon: Icon(Icons.share))
                  ],
                ),
              ),
            ],
          ),
        ));
  }
}
