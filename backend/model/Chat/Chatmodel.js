const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 500, 
    },
    senderName: {
      type: String,
      required: true,
    },
    senderPhoto: {
      type: String,
      required: true,
      default: "https://via.placeholder.com/150", 
    },
    senderID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Teacher", "Alumni"], 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
