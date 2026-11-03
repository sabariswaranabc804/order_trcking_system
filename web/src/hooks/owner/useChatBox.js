import { useState, useEffect, useRef } from 'react';
import chatService from '../../service/owner/chatService';

const useChatBox = (senderId, receiverId, senderRole, receiverRole) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesContainerRef = useRef(null);
  const { socket } = chatService;

  const fetchMessages = async () => {
    const data = await chatService.fetchMessages(senderId, receiverId);
    setMessages(data);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    
    const msg = { 
      sender_Id: senderId, 
      receiver_Id: receiverId, 
      sender_Role: senderRole, 
      receiver_Role: receiverRole, 
      message: text 
    };
    
    const success = await chatService.sendMessage(msg);
    if (success) {
      setText('');
    }
  };

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    fetchMessages();
    
    socket.on('receiveMessage', (msg) => {
      if ((msg.sender_Id === senderId && msg.receiver_Id === receiverId) || 
          (msg.sender_Id === receiverId && msg.receiver_Id === senderId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    
    return () => socket.off('receiveMessage');
  }, [senderId, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return {
    messages,
    text,
    setText,
    handleSend,
    messagesContainerRef
  };
};

export default useChatBox;