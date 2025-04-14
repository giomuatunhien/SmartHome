const { registerListener, publishMessage } = require('./mqttService');

// Các topic cho các thiết bị
const DEVICE_TOPICS = {
    light: 'minkjonk/feeds/light',
    fan: 'minkjonk/feeds/fan'
};

// Đăng ký lắng nghe message từ cả hai thiết bị
Object.keys(DEVICE_TOPICS).forEach(device => {
    registerListener(DEVICE_TOPICS[device], (message) => {
        console.log(`Message từ ${device} (${DEVICE_TOPICS[device]}):`, message);
    });
});

// Hàm gửi lệnh điều khiển thiết bị
const controlDevice = (device, command) => {
    const topic = DEVICE_TOPICS[device];
    if (topic) {
        publishMessage(topic, command.toString());
        console.log(`📩 Đã gửi lệnh '${command}' tới ${device} (${topic})`);
    } else {
        console.error(`❌ Thiết bị không hợp lệ: ${device}`);
    }
};

module.exports = { controlDevice };
