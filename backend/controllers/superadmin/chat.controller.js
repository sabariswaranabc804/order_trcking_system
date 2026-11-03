
const chatModel=require("../../models/superadmin/chatModel")

exports.sendMessage = async (req, res) => {
    try {
      const { sender_Id, receiver_Id, sender_Role, receiver_Role, message } = req.body;
      await chatModel.saveMessage(sender_Id, receiver_Id, sender_Role, receiver_Role, message);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
  
  exports.getMessages = async (req, res) => {
    try {
      const { user1_Id, user2_Id } = req.params;
      const result = await chatModel.getMessages(user1_Id, user2_Id);
      res.json(result.recordset);
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
  