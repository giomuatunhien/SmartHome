const mongoose = require('mongoose');
const { Schema } = mongoose;

const deviceHistorySchema = new Schema({
    device: {
        type: Schema.Types.ObjectId,
        //required: true,
        ref: 'Device'
    },
    deviceModel: {
        type: String,
        required: true,
        enum: ['fan', 'light', 'Unknown']
    },
    action: {
        type: String,
        required: true,
        enum: ['On', 'Off', 'failed']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    notes: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('DeviceHistory', deviceHistorySchema);

