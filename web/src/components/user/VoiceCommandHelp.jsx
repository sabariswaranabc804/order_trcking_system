import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MicIcon from '@mui/icons-material/Mic';
import CloseIcon from '@mui/icons-material/Close';
import { VOICE_COMMAND_EXAMPLES } from '../../utils/voiceCommandProcessor';

const VoiceCommandHelp = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const commandCategories = [
    {
      title: 'Add Items to Cart',
      commands: [
        'Add dry clean pant to cart',
        'Add dry clean silk towel to cart',
        'Add steam iron shirt to cart',
        'Add separate wash dress to cart',
        'Add normal wash kurta to cart'
      ]
    },
    {
      title: 'Cart Management',
      commands: [
        'Show my cart',
        'Open cart',
        'Remove pant from cart',
        'Remove shirt from cart',
        'Clear my cart'
      ]
    },
    {
      title: 'Filter & Browse Services',
      commands: [
        'Show dry cleaning services',
        'Filter steam ironing',
        'Show separate washing',
        'Filter normal washing services'
      ]
    },
   
  ];

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 150,
          right: 20,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MicIcon color="primary" />
          AI Voice Commands Help
          <Chip label="AI Powered" size="small" color="success" />
          <IconButton
            onClick={handleClose}
            sx={{ ml: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use these voice commands to control your laundry app hands-free.
            Click the microphone button and speak clearly.
          </Typography>

          {commandCategories.map((category, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                {category.title}
              </Typography>
              <List dense>
                {category.commands.map((command, cmdIndex) => (
                  <ListItem key={cmdIndex} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Chip
                        label={cmdIndex + 1}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`"${command}"`}
                      primaryTypographyProps={{
                        fontStyle: 'italic',
                        fontSize: '0.875rem'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}

          <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              💡 Tips for better recognition:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Speak clearly: "Add [service] [item] to cart"</li>
              <li>Use specific names: "dry clean pant", "steam iron shirt"</li>
              <li>For filtering: "Show [service name] services"</li>
              <li>Wait for the microphone to activate before speaking</li>
              <li>Try rephrasing if a command isn't recognized</li>
            </Typography>
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              🎯 Service Structure:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              <strong>Services:</strong> Dry Clean, Steam Iron, Separate Wash, Normal Wash<br />
              <strong>Items:</strong> Pant, Shirt, Coat, Dress, Saree, Kurta, Trouser<br />
              <strong>Example:</strong> "Add dry clean pant to cart" = Service + Item + Action
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoiceCommandHelp;