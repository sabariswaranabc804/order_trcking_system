# Map Location Picker Setup

To enable the map location picker feature, you need to install the required dependencies.

## Installation

Run the following command in your client directory:

```bash
npm install leaflet react-leaflet
```

Or if you're using yarn:

```bash
yarn add leaflet react-leaflet
```

## Features

Once installed, the map location picker will provide:

1. **Interactive Map**: Click anywhere on the map to select a location
2. **Current Location**: Get user's current GPS location
3. **Address Auto-fill**: Automatically fill form fields based on selected location
4. **Reverse Geocoding**: Convert coordinates to readable addresses
5. **Visual Feedback**: See selected coordinates and address preview

## Usage

1. Click "Pick Location on Map" button
2. Use "Use Current Location" to get GPS location
3. Click anywhere on the map to select a custom location
4. Confirm the location to auto-fill the address form

## Fallback

If the dependencies are not installed, users will see a fallback message with installation instructions and can still use the "Get Current Location" button or manually enter address details.