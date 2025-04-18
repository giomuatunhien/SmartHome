const mongoose = require('mongoose');

const InteractsSchema = new mongoose.Schema({
  userID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  }, // Người dùng tương tác
  systemID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'system', 
    required: true 
  }, // Hệ thống được tương tác
  timestamp: { 
    type: Date, 
    default: Date.now, 
    required: true 
  } // Thời gian tương tác
},{versionKey: false});

const Interacts = mongoose.model('Interacts', InteractsSchema, 'interacts');

module.exports = Interacts;
