const Chat = require('../model/Chat/Chatmodel');

const SocketHandler = (io) => {
  io.on('connection', async (socket) => {
    console.log(`New client connected: ${socket.id}`);

    try {
      const allMessages = await Chat.find().sort({ createdAt: 1 });
      socket.emit('all_messages', allMessages);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }

    socket.on('send_message', async (data) => {
      try {
        console.log('Received message:', data);
        const newMessage = new Chat({
          content: data.content,
          senderName: data.senderName,
          senderPhoto: data.senderPhoto,
          senderID: data.senderID,
          role: data.role,
        });
        await newMessage.save();
        io.emit('receive_message', newMessage);
      } catch (error) {
        console.error('Error saving message:', error.message);
      }
    });
    socket.on('delete_message', async (data) => {
      try {
        console.log('Deleting message:', data._id);
        await Chat.findByIdAndDelete(data._id);
        const allMessages = await Chat.find().sort({ createdAt: 1 });
        io.emit('all_messages', allMessages);
      } catch (error) {
        console.error('Error deleting message:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = SocketHandler;
