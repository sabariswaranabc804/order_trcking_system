import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MicIcon from '@mui/icons-material/Mic';
import CloseIcon from '@mui/icons-material/Close';

const VoiceCommandDemo = () => {
  const [open, setOpen] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);

  const examples = [
    {
      command: "Add dry clean pant to cart",
      explanation: "This will find 'Dry Cleaning' service and 'Pant' sub-service, then add it to your cart",
      breakdown: ["Service: Dry Clean", "Item: Pant", "Action: Add to Cart"]
    },
    {
      command: "Show steam ironing services",
      explanation: "This will filter and show only Steam Ironing services on the page",
      breakdown: ["Service: Steam Iron", "Action: Filter/Show"]
    },
    {
      command: "Open cart",
      explanation: "This will navigate to your cart page to view all items",
      breakdown: ["Action: Open Cart"]
    },
    {
      command: "Remove shirt from cart",
      explanation: "This will find any shirt item in your cart and remove it",
      breakdown: ["Item: Shirt", "Action: Remove from Cart"]
    },
    {
      command: "Add dry clean silk towel to cart",
      explanation: "This will find 'Dry Cleaning' service for 'Silk Towel' and add to cart",
      breakdown: ["Service: Dry Clean", "Item: Silk Towel", "Action: Add to Cart"]
    },
    {
      command: "Add separate wash dress to cart",
      explanation: "This will find 'Separate Washing' service for 'Dress' and add to cart",
      breakdown: ["Service: Separate Wash", "Item: Dress", "Action: Add to Cart"]
    }
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length);
  };

  const currentCmd = examples[currentExample];

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 220,
          right: 20,
          bgcolor: 'secondary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'secondary.dark',
          },
        }}
      >
        <PlayArrowIcon />
      </IconButton>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MicIcon color="primary" />
          Voice Command Demo
          <IconButton
            onClick={handleClose}
            sx={{ ml: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Example {currentExample + 1} of {examples.length}
            </Typography>
            
            <Box sx={{ 
              p: 3, 
              bgcolor: 'grey.100', 
              borderRadius: 2, 
              mb: 2,
              border: '2px dashed',
              borderColor: 'primary.main'
            }}>
              <Typography variant="h5" sx={{ 
                fontStyle: 'italic', 
                color: 'primary.main',
                mb: 1
              }}>
                "{currentCmd.command}"
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              {currentCmd.explanation}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Command Breakdown:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                {currentCmd.breakdown.map((part, index) => (
                  <Chip 
                    key={index}
                    label={part}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              📝 How it works:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="1. Click the microphone button"
                  secondary="The voice recognition will start listening"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="2. Speak the command clearly"
                  secondary="Use the format: [Action] [Service] [Item] [to/from] [cart]"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="3. See the result"
                  secondary="The app will process your command and show feedback"
                />
              </ListItem>
            </List>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={nextExample} variant="outlined">
            Next Example
          </Button>
          <Button onClick={handleClose} variant="contained">
            Try It Now!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoiceCommandDemo;