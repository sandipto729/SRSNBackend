const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    sender: {
        type: String,
        enum: ['school', 'ashram'],
        required: [true, 'Sender is required'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
