import React from 'react';
import { Fab, Tooltip, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useVoiceCommands } from '../../hooks/user/useVoiceCommands';

const VoiceCommandButton = ({ services = [], onServiceFilter = null }) => {
  const { isListening, transcript, feedback, startListening, stopListening, isSupported } = useVoiceCommands(services, onServiceFilter);

  if (!isSupported) {
    return null; // Don't render if speech recognition is not supported
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Tooltip title={isListening ? "Stop listening" : "Start voice command"}>
        <Fab
          color={isListening ? "secondary" : "primary"}
          onClick={handleClick}
          sx={{
            animation: isListening ? 'pulse 1.5s infinite' : 'none',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)',
              },
              '70%': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
              },
            },
          }}
        >
          {isListening ? <MicIcon /> : <MicOffIcon />}
        </Fab>
      </Tooltip>
      
      {(transcript || feedback) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            mb: 1,
            p: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            minWidth: 200,
            maxWidth: 300,
            boxShadow: 2,
          }}
        >
          {transcript && (
            <>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Command:
              </Box>
              <Box sx={{ fontSize: '0.875rem', fontWeight: 'medium', mb: 1 }}>
                "{transcript}"
              </Box>
            </>
          )}
          {feedback && (
            <>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Status:
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'primary.main' }}>
                {feedback}
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default VoiceCommandButton;