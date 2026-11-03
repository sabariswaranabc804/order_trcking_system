
// export default LocationButton;
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, TextField } from '@mui/material';
import axios from 'axios'; // For making API requests

const LocationButton = () => {
  const [open, setOpen] = useState(false);
  const [locationUrl, setLocationUrl] = useState("");

  const googleMapsLink = "https://www.google.com/maps/@10.8145558,78.8901637,10.5z?entry=ttu&g_ep=EgoyMDI0MTAxNi4wIKXMDSoASAFQAw%3D%3D";

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Open Google Maps link in new tab after closing the alert
    window.open(googleMapsLink, "_blank");
  };

  const handleSubmit = async () => {
    if (!locationUrl) {
      alert("Please enter a location URL!");
      return;
    }

    // Replace this with your actual API endpoint to save the URL
    const apiEndpoint = "https://your-api-endpoint.com/save-location";

    try {
      // Send a POST request to save the location URL
      await axios.post(apiEndpoint, { locationUrl });
      alert("Location saved successfully!");

      // Close the dialog after saving
      setOpen(false);

      // Optionally open the Google Maps link in a new tab
      window.open(locationUrl, "_blank");
    } catch (error) {
     // console.error("Error saving location:", error);
      alert("Failed to save location.");
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Share Location
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Video</DialogTitle>
        <DialogContent>
          {/* Video instead of carousel */}
          <video width="100%" height="auto" controls>
            <source src="https://youtu.be/umO3tlX7G2I?si=EUtuFaVMYWQVew2z" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>OK to continue and select your order's exact location</p>

          <Button onClick={handleClose} variant="contained" color="primary" fullWidth>
            OK
          </Button>
        </DialogContent>
      </Dialog>

      <TextField
        fullWidth
        margin="normal"
        variant="outlined"
        label="Your Location URL"
        placeholder="Your location URL, copy here"
        value={locationUrl}
        onChange={(e) => setLocationUrl(e.target.value)} // Set the URL from input
      />

      <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
        Submit
      </Button>
    </div>
  );
};

export default LocationButton;
