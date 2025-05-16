//Tạo ra tránh import lặp vì door muốn nhận từ adafruit và adafruit cũng muốn nhận từ door
const Door = require('../models/smart_door.model');
const DoorHistory = require('../models/smart_door_history');

const updateDoorStatusFromMQTT = async (value, userId = null) => {
    try {
        let door = await Door.findOne();// vì hiện tại chỉ có 1 cửa
        if (!door) {
            door = new Door({ password: '111111', status: 'locked' });
            await door.save();
            console.log('🚪 Cửa mới đã được tạo.');
        }

        if (value === "1") {
            door.status = 'unlocked';
            await door.save();
            const doorHistory = new DoorHistory({ door: door._id, action: 'open', notes: 'Nhập mật mã', userID: userId });
            await doorHistory.save();
            console.log('🔓 Cửa mở!');
        } else if (value === "0") {
            door.status = 'locked';
            await door.save();
            const doorHistory = new DoorHistory({ door: door._id, action: 'close', notes: 'Đóng cửa', userID: userId });
            await doorHistory.save();
            console.log('🔒 Cửa đóng!');
        } else {
            console.error(`⚠️ Giá trị không hợp lệ: ${value}`);
        }
    } catch (error) {
        console.error('❌ Lỗi cập nhật cửa:', error);
    }
};


const { registerListener, publishMessage } = require('./mqttService');

const DOOR_TOPIC = 'minkjonk/feeds/door';
let lastSentUserId = null;
registerListener(DOOR_TOPIC, (message) => {
    const statusStr = message.toString();

    // Gọi update kèm userId đã lưu
    updateDoorStatusFromMQTT(statusStr, lastSentUserId);

    // Xóa userId sau khi dùng để tránh lỗi về sau
    lastSentUserId = null;
});

const sendDoorStatus = (status, userId = null) => {
    const statusStr = typeof status === 'number' ? status.toString() : status;

    // Lưu userId tạm thời
    lastSentUserId = userId;

    // Gửi status lên feed
    publishMessage(DOOR_TOPIC, statusStr);
};

module.exports = { sendDoorStatus };
