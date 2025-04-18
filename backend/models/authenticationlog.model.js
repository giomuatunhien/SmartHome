const mongoose = require('mongoose');

const AuthenticationLogSchema = new mongoose.Schema({
  result: { 
    type: String, 
    enum: ['success', 'failure'], 
    required: true 
  }, // Kết quả xác thực
  timestamp: { 
    type: Date, 
    default: Date.now, required: true }, // Thời gian xác thực
  imageData: { 
    data: Buffer,  // Lưu dữ liệu ảnh dưới dạng nhị phân
    contentType: String // Kiểu dữ liệu ảnh (jpeg, png, ...)
  }, // Đường dẫn ảnh xác thực
  type: { 
    type: String, 
    enum: ['face', 'password'], 
    required: true 
  }, // Loại xác thực (vd: "Face", "Password")
  userID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  }, // Người thực hiện xác thực
  systemID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'system', 
    required: true 
  } // Hệ thống xác thực
},  { versionKey: false });

const AuthenticationLog = mongoose.model('AuthenticationLog', AuthenticationLogSchema , 'authenticationlog');

module.exports = AuthenticationLog;
