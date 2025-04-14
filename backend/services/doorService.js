//Tạo ra tránh import lặp vì door muốn nhận từ adafruit và adafruit cũng muốn nhận từ door
const Door = require('../models/smart_door.model');
const DoorHistory = require('../models/smart_door_history');

const updateDoorStatusFromMQTT = async (value) => {
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
            const doorHistory = new DoorHistory({ door: door._id, action: 'open', notes: 'Mật khẩu đúng, cửa được mở.' });
            await doorHistory.save();
            console.log('🔓 Cửa mở!');
        } else if (value === "0") {
            door.status = 'locked';
            await door.save();
            const doorHistory = new DoorHistory({ door: door._id, action: 'close', notes: 'Cửa tự động đóng sau 10 giây.' });
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

registerListener(DOOR_TOPIC, (message) => {
    console.log(`Door message từ topic ${DOOR_TOPIC}:`, message);
    updateDoorStatusFromMQTT(message);
});

const sendDoorStatus = (status) => {
    publishMessage(DOOR_TOPIC, status.toString());
};

module.exports = { sendDoorStatus };
