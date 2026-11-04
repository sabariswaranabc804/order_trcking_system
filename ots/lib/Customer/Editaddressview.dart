import 'package:flutter/material.dart';
import '../API/api.dart';
import '../Model/editaddress.dart';

class EditAddressScreen extends StatefulWidget {
  final editAddress initialAddress; // Initial address passed to the screen

  EditAddressScreen({required this.initialAddress});

  @override
  _EditAddressScreenState createState() => _EditAddressScreenState();
}

class _EditAddressScreenState extends State<EditAddressScreen> {
  final _formKey = GlobalKey<FormState>();

  late String country;
  late String state;
  late String city;
  late String area;
  late String street;
  late String floorDoorNumber;
  late String landmark;
  late String pinCode;
  late String addressType;
  late String? location;
  late String phoneNumber;
  late String addressId;
  late String userId;

  @override
  void initState() {
    super.initState();
    // Initialize form fields with existing data
    final address = widget.initialAddress;
    addressId = address.addressId.toString();
    userId = address.userId;
    country = address.country;
    state = address.state;
    city = address.city;
    area = address.area;
    street = address.street;
    floorDoorNumber = address.floorDoorNumber;
    landmark = address.landmark;
    pinCode = address.pinCode;
    addressType = address.addressType;
    location = address.location;
    phoneNumber = address.phoneNumber;
  }

  // Submit form and call API to update address
  Future<void> _submitForm() async {
    if (_formKey.currentState?.validate() ?? false) {
      _formKey.currentState?.save();

      final updatedAddress = editAddress(
        country: country,
        state: state,
        city: city,
        area: area,
        street: street,
        floorDoorNumber: floorDoorNumber,
        landmark: landmark,
        pinCode: pinCode,
        addressType: addressType,
        location: location,
        phoneNumber: phoneNumber,
        addressId: addressId,
        userId: userId,
      );

      final api = AddressAPI();
      bool success = await api.editAddressfunc(updatedAddress);

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Address updated successfully')),
        );
        Navigator.pop(context); // Go back to the previous screen
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update address')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit Address'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                initialValue: country,
                decoration: InputDecoration(labelText: 'Country'),
                onSaved: (value) => country = value ?? '',
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter country' : null,
              ),
              TextFormField(
                initialValue: state,
                decoration: InputDecoration(labelText: 'State'),
                onSaved: (value) => state = value ?? '',
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter state' : null,
              ),
              TextFormField(
                initialValue: city,
                decoration: InputDecoration(labelText: 'City'),
                onSaved: (value) => city = value ?? '',
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter city' : null,
              ),
              TextFormField(
                initialValue: area,
                decoration: InputDecoration(labelText: 'Area'),
                onSaved: (value) => area = value ?? '',
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter area' : null,
              ),
              TextFormField(
                initialValue: street,
                decoration: InputDecoration(labelText: 'Street'),
                onSaved: (value) => street = value ?? '',
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter street' : null,
              ),
              TextFormField(
                initialValue: floorDoorNumber,
                decoration: InputDecoration(labelText: 'Floor/Door Number'),
                onSaved: (value) => floorDoorNumber = value ?? '',
              ),
              TextFormField(
                initialValue: landmark,
                decoration: InputDecoration(labelText: 'Landmark'),
                onSaved: (value) => landmark = value ?? '',
              ),
              TextFormField(
                initialValue: pinCode,
                decoration: InputDecoration(labelText: 'Pin Code'),
                onSaved: (value) => pinCode = value ?? '',
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter pin code' : null,
              ),
              DropdownButtonFormField<String>(
                value: addressType,
                decoration: InputDecoration(
                  labelText: 'Address Type',
                ),
                onChanged: (value) {
                  setState(() {
                    addressType = value ?? '';
                  });
                },
                onSaved: (value) {
                  addressType = value ?? '';
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select an address type';
                  }
                  return null;
                },
                items: <String>['Home', 'Work']
                    .map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
              ),
              TextFormField(
                initialValue: phoneNumber,
                decoration: InputDecoration(labelText: 'Phone Number'),
                onSaved: (value) => phoneNumber = value ?? '',
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter phone number' : null,
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _submitForm,
                child: Text('Save Address'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
