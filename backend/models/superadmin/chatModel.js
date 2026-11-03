const { poolPromise, sql } = require('../../db');

async function saveMessage(sender_Id, receiver_Id, sender_Role, receiver_Role, message) {
    const pool = await poolPromise;
  const request = pool.request();  // Error: pool is not defined
  return request
    .input('sender_Id', sql.NVarChar, sender_Id)
    .input('receiver_Id', sql.NVarChar, receiver_Id)
    .input('sender_Role', sql.Int, sender_Role)
    .input('receiver_Role', sql.Int, receiver_Role)
    .input('message', sql.NVarChar(sql.MAX), message)
    .query(`INSERT INTO Chat_Message (sender_Id, receiver_Id, sender_Role, receiver_Role, message) 
            VALUES (@sender_Id, @receiver_Id, @sender_Role, @receiver_Role, @message)`);
}

async function getMessages(user1_Id, user2_Id) {
    const pool = await poolPromise;
  const request = pool.request();
  return request
    .input('user1_Id', sql.NVarChar, user1_Id)
    .input('user2_Id', sql.NVarChar, user2_Id)
    .query(`SELECT * FROM Chat_Message
             WHERE (sender_Id = @user1_Id AND receiver_Id = @user2_Id)
                OR (sender_Id = @user2_Id AND receiver_Id = @user1_Id)
             ORDER BY sent_At ASC`);
}

module.exports = { saveMessage, getMessages };