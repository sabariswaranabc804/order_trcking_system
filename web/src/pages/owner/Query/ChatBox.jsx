import { Send, EmojiEmotions } from '@mui/icons-material';
import useChatBox from '../../../hooks/owner/useChatBox';

const ChatBox = ({ senderId, receiverId, senderRole, receiverRole }) => {
  const theme = useTheme();
  const {
    messages,
    text,
    setText,
    handleSend,
    messagesContainerRef
  } = useChatBox(senderId, receiverId, senderRole, receiverRole);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Messages container */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 1.5, sm: 2 },
          gap: 1,
          bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#e5ddd5',
          backgroundImage: theme.palette.mode === 'dark'
            ? 'none'
            : 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h60v60H0z" fill="none"/%3E%3Cpath d="M30 0L0 30l30 30 30-30z" fill="%23ffffff" opacity="0.05"/%3E%3C/svg%3E")',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: theme.palette.action.disabled,
            borderRadius: '4px',
            '&:hover': {
              bgcolor: theme.palette.action.active,
            },
          },
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column',
            gap: 2
          }}>
            <EmojiEmotions sx={{ fontSize: 64, color: 'text.disabled' }} />
            <Typography variant="body1" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                alignSelf: msg.sender_Id === senderId ? 'flex-end' : 'flex-start',
                maxWidth: { xs: '85%', sm: '75%', md: '60%' },
                animation: 'fadeIn 0.3s ease-in',
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(10px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  bgcolor: msg.sender_Id === senderId
                    ? theme.palette.primary.main
                    : theme.palette.background.paper,
                  color: msg.sender_Id === senderId
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  borderRadius: 2,
                  p: 1.5,
                  px: 2,
                  wordBreak: 'break-word',
                  position: 'relative',
                  '&::before': msg.sender_Id === senderId ? {
                    content: '""',
                    position: 'absolute',
                    right: -8,
                    top: 10,
                    width: 0,
                    height: 0,
                    borderLeft: `8px solid ${theme.palette.primary.main}`,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                  } : {
                    content: '""',
                    position: 'absolute',
                    left: -8,
                    top: 10,
                    width: 0,
                    height: 0,
                    borderRight: `8px solid ${theme.palette.background.paper}`,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                  },
                }}
              >
                <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    opacity: 0.7,
                    fontSize: '0.7rem',
                    textAlign: 'right'
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Paper>
            </Box>
          ))
        )}
      </Box>

      {/* Input area */}
      <Box sx={{
        display: 'flex',
        p: { xs: 1.5, sm: 2 },
        bgcolor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        alignItems: 'center',
        gap: 1,
        boxShadow: theme.shadows[2]
      }}>
        <TextField
          fullWidth
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder="Type a message..."
          variant="outlined"
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'action.hover',
              '&:hover': {
                bgcolor: 'action.selected',
              },
              '&.Mui-focused': {
                bgcolor: 'background.paper',
              }
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!text.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            }
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatBox;