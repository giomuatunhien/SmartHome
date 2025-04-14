const mqtt = require('mqtt');

const MQTT_BROKER_URL = 'mqtts://io.adafruit.com';
const options = {
  username: process.env.ADAFRUIT_IO_USERNAME,
  password: process.env.ADAFRUIT_IO_KEY,
  reconnectPeriod: 1000,
};

let client = mqtt.connect(MQTT_BROKER_URL, options);

const subscriptions = {};

client.on('connect', () => {
  console.log('Đã kết nối tới Adafruit IO MQTT Broker');
  Object.keys(subscriptions).forEach(topic => {
    client.subscribe(topic, (err) => {
      if (!err) console.log(`Đã subscribe tới topic: ${topic}`);
      else console.error(`Lỗi subscribe topic ${topic}:`, err);
    });
  });
});

client.on('message', (topic, message) => {
  const handlers = subscriptions[topic];
  if (handlers) {
    handlers.forEach(handler => handler(message.toString()));
  }
});

client.on('error', (error) => {
  console.error('Lỗi kết nối MQTT:', error);
});

const registerListener = (topic, handler) => {
  if (!subscriptions[topic]) subscriptions[topic] = [];
  subscriptions[topic].push(handler);

  if (client.connected) {
    client.subscribe(topic, (err) => {
      if (!err) console.log(`Đã subscribe topic: ${topic}`);
      else console.error(`Lỗi subscribe topic ${topic}:`, err);
    });
  }
};

const publishMessage = (topic, message) => {
  if (client.connected) {
    client.publish(topic, message, { qos: 1 }, (err) => {
      if (!err) console.log(`Đã gửi message tới topic ${topic}: ${message}`);
      else console.error('Lỗi gửi message:', err);
    });
  } else {
    console.error('Chưa kết nối MQTT, không thể gửi message.');
  }
};

module.exports = { registerListener, publishMessage };
