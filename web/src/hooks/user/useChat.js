import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "../../service/user/chatService";

export const useChat = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatBoxRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(senderId, receiverId);
      setMessages(data);
      setTimeout(() => {
        chatBoxRef.current?.scrollTo({
          top: chatBoxRef.current.scrollHeight,
          behavior: "smooth"
        });
      }, 100);
    } catch (err) {
      /* console.error("Error fetching messages:", err); */
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const msg = {
        sender_Id: senderId,
        receiver_Id: receiverId,
        sender_Role: 5,
        receiver_Role: 1,
        message: message.trim()
      };
      await sendMessage(msg);
      setMessage("");
      fetchMessages();
    } catch (err) {
      /* console.error("Error sending message:", err); */
    }
  };

  const handleSendQA = async (question, answer) => {
    const msg = {
      sender_Id: senderId,
      receiver_Id: receiverId,
      sender_Role: 5,
      receiver_Role: 1,
      message: `${question}\n\n${answer}`
    };
    await sendMessage(msg);
    fetchMessages();
  };

  useEffect(() => {
    if (senderId && receiverId) fetchMessages();
  }, [senderId, receiverId]);

  return {
    message,
    setMessage,
    messages,
    chatBoxRef,
    fetchMessages,
    handleSendMessage,
    handleSendQA
  };
};
