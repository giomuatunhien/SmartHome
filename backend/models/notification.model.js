const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  message: {
    type: String,
    required: true
  }, // Nội dung thông báo
  attachment: {
    type: String
  }, // Đường dẫn file đính kèm (nếu có)
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { versionKey: false });

const Notification = mongoose.model('Notification', NotificationSchema, 'notification');

module.exports = Notification;
