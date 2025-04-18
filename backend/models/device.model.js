const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true 
  }, // Loại thiết bị
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'maintenance'], 
    required: true 
  }, // Trạng thái thiết bị
  installeddate: { 
    type: Date, 
    required: true 
  }, // Ngày cài đặt
  systemID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'system', 
    required: true 
  } // Liên kết với bảng System
});

const Device = mongoose.model('Device', DeviceSchema, 'device');

module.exports = Device;
