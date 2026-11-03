import React, { useState } from "react";
import {
  Fab, Dialog, DialogTitle, DialogContent, IconButton, Box, Typography,
  TextField
} from "@mui/material";
import {
  Help as HelpIcon, Close as CloseIcon, SupportAgent as SupportAgentIcon,
  ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon
} from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../hooks/user/useChat";
import { commonQA } from "../../../utils/commonQuestions";




const receiverId = "admin01";

const SupportChat = () => {
  const [openChat, setOpenChat] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useAuth();
  const senderId = user?.user_code;

  const {
    message,
    setMessage,
    messages,
    chatBoxRef,
    handleSendMessage,
    handleSendQA
  } = useChat({ senderId, receiverId });

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setOpenChat(true)}
        style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}
      >
        <HelpIcon />
      </Fab>

      <Dialog
        open={openChat}
        onClose={() => setOpenChat(false)}
        PaperProps={{ sx: { borderRadius: "10px", maxWidth: 350, width: "100%" } }}
      >
        <DialogTitle sx={{ bgcolor: "#2790f5", color: "white", display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <SupportAgentIcon />
            <Typography variant="h6">OTS 2.0 Services</Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpenChat(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          {/* Welcome */}
          <Box sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <SupportAgentIcon sx={{ mr: 1, color: "#2790f5" }} />
              <Typography variant="body1" sx={{ bgcolor: "#f0f0f0", p: 1, borderRadius: 2 }}>
                Hi! I'm Kirush from OTS 2.0 👋. How can I help you today?
              </Typography>
            </Box>
          </Box>

          {/* Messages */}
          <Box ref={chatBoxRef} sx={{ maxHeight: 250, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.senderId === senderId ? "flex-end" : "flex-start",
                  bgcolor: msg.senderId === senderId ? "#d1edc1" : "#f0f0f0",
                  p: 1.2,
                  borderRadius: 2,
                  maxWidth: "80%",
                  whiteSpace: "pre-wrap",
                  boxShadow: 1,
                  mb: 2
                }}
              >
                <Typography variant="body2">{msg.message}</Typography>
              </Box>
            ))}
          </Box>

          {/* Toggle Suggestions */}
          <Box onClick={() => setShowSuggestions(!showSuggestions)} sx={{ display: "flex", justifyContent: "space-between", cursor: "pointer", mb: 2 }}>
            <Typography variant="subtitle2">Common questions:</Typography>
            {showSuggestions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          {/* Common Questions */}
          {showSuggestions && Object.keys(commonQA).map((question, index) => (
  <Box
    key={index}
    onClick={() => handleSendQA(question, commonQA[question])}
    sx={{
      border: "1px solid #e0e0e0",
      borderRadius: 2,
      p: 1,
      mb: 1,
      cursor: "pointer",
      "&:hover": { bgcolor: "#f5f5f5" }
    }}
  >
    <Typography variant="body2">{question}</Typography>
  </Box>
))}


          {/* Input */}
          <Box sx={{ display: "flex", mt: 2, borderTop: "1px solid #e0e0e0", pt: 2 }}>
            <TextField
              fullWidth
              placeholder="Tell us how we can help..."
              size="small"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              sx={{ mr: 1 }}
            />
            <IconButton color="primary" onClick={handleSendMessage} disabled={!message.trim()} sx={{ bgcolor: "#f0f0f0" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19" stroke="#2790f5" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 5L19 12L12 19" stroke="#2790f5" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportChat;
