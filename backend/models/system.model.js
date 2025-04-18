const mongoose = require('mongoose');

const SystemSchema = new mongoose.Schema({
  version: { 
    type: String, 
    required: true 
  }, // Phiên bản hệ thống
  lastupdatetime: { 
    type: Date, default: Date.now, 
    required: true 
  }, // Thời gian cập nhật cuối
  activitystatus: { 
    type: String, 
    enum: ['active', 'inactive', 'maintenance'], 
    required: true 
  } // Trạng thái hoạt động
},{versionKey: false});

const System = mongoose.model('System', SystemSchema ,'system');

module.exports = System;
