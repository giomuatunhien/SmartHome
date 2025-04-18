const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, 
    default: Date.now, 
    required: true 
  }, // Thời gian gửi thông báo
  message: { 
    type: String, 
    required: true 
  }, // Nội dung thông báo
  attachment: { 
    type: String 
  }, // Đường dẫn file đính kèm (nếu có)
  userID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  }, // Người nhận thông báo
  systemID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'system', 
    required: true 
  } // Hệ thống liên quan
},{versionKey: false});

const Notification = mongoose.model('Notification', NotificationSchema, 'notification');

module.exports = Notification;
