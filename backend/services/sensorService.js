const { registerListener, publishMessage } = require('./mqttService');
const sensorController = require('../Controllers/sensor/sensor.controller');

const SENSOR_TOPICS = {
  temperature: { topic: 'minkjonk/feeds/temperature', sensorID: '67da7bf0058ba8efaa8d6d60' },
  humidity: { topic: 'minkjonk/feeds/humidity', sensorID: '67da7c01058ba8efaa8d6d62' },
  light: { topic: 'minkjonk/feeds/light-intensity', sensorID: '67da7c0e058ba8efaa8d6d64' }
};

// Lắng nghe dữ liệu từ các sensor
Object.keys(SENSOR_TOPICS).forEach((key) => {
  const { topic, sensorID } = SENSOR_TOPICS[key];
  registerListener(topic, (message) => {
    try {
      const obj = {
        value: message,
        sensorID: sensorID, // SensorID cố định hoặc cập nhật nếu cần
        systemID: "111111111111111111111111",
      };

      sensorController.setsensorData(obj);
      console.log(`Sensor message từ topic ${topic}:`, message);
    }
    catch (err) {
      console.error(`❌ Lỗi khi xử lý dữ liệu từ topic ${topic}:`, err);
    }
  });
});

// const sendSensorData = (type, value) => {
//   if (SENSOR_TOPICS[type]) {
//     publishMessage(SENSOR_TOPICS[type], value.toString());
//   } else {
//     console.error(`Không tìm thấy topic cho sensor type: ${type}`);
//   }
// };

module.exports = {};
