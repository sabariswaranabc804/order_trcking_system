import React, { useState, useCallback, useRef } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl, ScaleControl } from 'react-map-gl/maplibre';
import { Dialog, DialogContent, DialogTitle, Button, Box, Typography, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function AdvancedMapLibreModal({ open, onClose, onSelectLocation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef();
  const [viewState, setViewState] = useState({
    longitude: 78.7047,
    latitude: 10.7905,
    zoom: 13
  });

  // OpenStreetMap style (free alternative)
  const mapStyle = {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'osm-tiles',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  };

  const handleMapClick = useCallback(async (event) => {
    const { lng, lat } = event.lngLat;
    setSelectedLocation({ lat, lng });
    await getAddressFromCoordinates(lat, lng);
  }, []);

  const getAddressFromCoordinates = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
     
       
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      /* console.error('Error getting address:', error); */
    } finally {
      setLoading(false);
    }
  };

  /* console.log("adddata",address); */
  
  const handleGeolocate = useCallback((event) => {
    const { coords } = event;
    const location = { lat: coords.latitude, lng: coords.longitude };
    setSelectedLocation(location);
    setViewState(prev => ({
      ...prev,
      longitude: coords.longitude,
      latitude: coords.latitude,
      zoom: 15
    }));
    getAddressFromCoordinates(coords.latitude, coords.longitude);
  }, []);

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedLocation(null);
    setAddress('');
    onClose();
  };

  // Preset locations for quick access
  const presetLocations = [
    { name: "Trichy Central", lat: 10.7905, lng: 78.7047 },
    { name: "Srirangam", lat: 10.8624, lng: 78.6918 },
    { name: "Airport", lat: 10.7654, lng: 78.7097 }
  ];

  const handlePresetLocation = (location) => {
    setSelectedLocation({ lat: location.lat, lng: location.lng });
    setViewState({
      longitude: location.lng,
      latitude: location.lat,
      zoom: 14
    });
    getAddressFromCoordinates(location.lat, location.lng);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon color="primary" />
          <Typography variant="h6">Choose Location on Map</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click anywhere on the map to select your location, or use the controls to navigate
        </Typography>

        {/* Quick Location Buttons */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>
            Quick select:
          </Typography>
          {presetLocations.map((location, index) => (
            <Chip
              key={index}
              label={location.name}
              onClick={() => handlePresetLocation(location)}
              variant="outlined"
              size="small"
              clickable
            />
          ))}
        </Box>

        <Box sx={{
          height: 400,
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: 1,
          overflow: 'hidden'
        }}>
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            onClick={handleMapClick}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle}
            attributionControl={true}
            interactiveLayerIds={[]}
          >
            {/* Navigation Controls */}
            <NavigationControl position="top-right" showCompass={true} showZoom={true} />

            {/* Geolocation Control */}
            <GeolocateControl
              position="top-left"
              trackUserLocation={false}
              onGeolocate={handleGeolocate}
              style={{
                backgroundColor: '#fff',
                border: '2px solid #ddd',
                borderRadius: '4px'
              }}
            />

            {/* Scale Control */}
            <ScaleControl position="bottom-left" />

            {/* Selected Location Marker */}
            {selectedLocation && (
              <Marker
                longitude={selectedLocation.lng}
                latitude={selectedLocation.lat}
                anchor="bottom"
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#ff0000',
                  borderRadius: '50%',
                  border: '3px solid #fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  cursor: 'pointer'
                }} />
              </Marker>
            )}
          </Map>
        </Box>

        {selectedLocation && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" color="success.dark" sx={{ fontWeight: 'bold' }}>
              ✓ Location Selected
            </Typography>
            <Typography variant="body2" color="success.dark">
              Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </Typography>
          </Box>
        )}

        {address && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              Address Preview:
            </Typography>
            <Typography variant="body2">
              {address}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedLocation || loading}
            startIcon={<LocationOnIcon />}
          >
            {loading ? 'Getting Address...' : 'Confirm Location'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}