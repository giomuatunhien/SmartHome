const mongoose = require('mongoose');

const FaceDataSchema = new mongoose.Schema({
  imageData: [{ 
    data: Buffer, 
    contentType: String,
  _id: false
  }], // Lưu ảnh dạng nhị phân
  createddate: { 
    type: Date, 
    default: Date.now 
  }, // Mặc định là ngày tạo
  userID: {
    type: mongoose.Schema.Types.ObjectId,      
    length: 24, // Đảm bảo đủ 24 ký tự
    ref: "user"
  }
},{versionKey: false});

// Mongoose tự động tạo _id làm khóa chính
const FaceData = mongoose.model('FaceData', FaceDataSchema, 'facedata');

module.exports = FaceData;
