import React from 'react';
import { Fab, Tooltip, Box, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useOpenAIVoiceCommands } from '../../hooks/user/useOpenAIVoiceCommands';

const OpenAIVoiceCommandButton = ({ services = [], onServiceFilter = null }) => {
  const { 
    isRecording, 
    isProcessing, 
    transcript, 
    feedback, 
    startRecording, 
    stopRecording, 
    isSupported 
  } = useOpenAIVoiceCommands(services, onServiceFilter);

  if (!isSupported) {
    return null; // Don't render if microphone is not supported
  }

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isProcessing) {
      startRecording();
    }
  };

  const getButtonColor = () => {
    if (isProcessing) return 'info';
    if (isRecording) return 'secondary';
    return 'primary';
  };

  const getButtonIcon = () => {
    if (isProcessing) return <SmartToyIcon />;
    if (isRecording) return <MicIcon />;
    return <MicOffIcon />;
  };

  const getTooltipText = () => {
    if (isProcessing) return 'AI is processing your command...';
    if (isRecording) return 'Recording... Click to stop';
    return 'Click to start AI voice command';
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
      <Tooltip title={getTooltipText()}>
        <Fab
          color={getButtonColor()}
          onClick={handleClick}
          disabled={isProcessing}
          sx={{
            animation: isRecording ? 'pulse 1.5s infinite' : 'none',
            position: 'relative',
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
          {isProcessing ? (
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={24} color="inherit" />
              <SmartToyIcon sx={{ position: 'absolute' }} />
            </Box>
          ) : (
            getButtonIcon()
          )}
        </Fab>
      </Tooltip>
      
      {(transcript || feedback) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            mb: 1,
            p: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            minWidth: 250,
            maxWidth: 350,
            boxShadow: 3,
          }}
        >
          {transcript && (
            <>
              <Box sx={{ 
                fontSize: '0.75rem', 
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 0.5
              }}>
                <SmartToyIcon sx={{ fontSize: '1rem' }} />
                AI Understood:
              </Box>
              <Box sx={{ 
                fontSize: '0.875rem', 
                fontWeight: 'medium', 
                mb: 1,
                p: 1,
                bgcolor: 'primary.light',
                borderRadius: 1,
                color: 'primary.contrastText'
              }}>
                "{transcript}"
              </Box>
            </>
          )}
          {feedback && (
            <>
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                Status:
              </Box>
              <Box sx={{ 
                fontSize: '0.875rem', 
                color: isProcessing ? 'info.main' : 'success.main',
                fontWeight: 'medium'
              }}>
                {feedback}
              </Box>
            </>
          )}
        </Box>
      )}
      
      {/* AI Badge */}
      {/* <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: -8,
          bgcolor: 'success.main',
          color: 'white',
          borderRadius: '50%',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          border: 2,
          borderColor: 'background.paper'
        }}
      >
        AI
      </Box> */}
    </Box>
  );
};

export default OpenAIVoiceCommandButton;