const commandController = require('./command.controller');
const deviceService = require('../../services/deviceService');
const stringSimilarity = require('string-similarity');
const Device = require('../../models/device.model');
const DeviceHistory = require('../../models/device_history');
const Notification = require('../../models/notification.model');
const { Admin } = require('../../models/account.model');


exports.handleTranscript = async (transcript, userId) => {
  try {
    console.log("Transcript received:", transcript);


    if (!transcript || typeof transcript !== 'string') {
      console.error("Error: Transcript is missing or not a string.");
      return;
    }

    const commands = await commandController.getCommandsFromDB();

    if (!commands || commands.length === 0) {
      console.error("Error: No commands found in database.");
      return;
    }


    const transcriptStr = transcript.toLowerCase();


    const matches = commands.map(cmd => {
      if (!cmd.commandText || typeof cmd.commandText !== 'string') {
        console.warn("Warning: Found invalid command commandText in database.");
        return { command: cmd, similarity: 0 };
      }

      return {
        command: cmd,
        similarity: stringSimilarity.compareTwoStrings(transcriptStr, cmd.commandText.toLowerCase())
      };
    });


    const bestMatch = matches.reduce((prev, curr) => (prev.similarity > curr.similarity ? prev : curr));
    const THRESHOLD = 0.5;

    if (bestMatch.similarity >= THRESHOLD) {

      console.log(`Identified command: ${bestMatch.command.commandText} (similarity: ${bestMatch.similarity})`);

      //let payload = null;
      const action = bestMatch.command.commandText.toLowerCase();

      let device, newStatus, speed;
      switch (action) {
        case 'mở đèn':
          publish = deviceService.controlDevice("light", "1");
          device = 'light';
          newStatus = 'On';
          break;
        case 'tắt đèn':
          publish = deviceService.controlDevice("light", "0");
          device = 'light';
          newStatus = 'Off';
          break;
        case 'mở quạt':
          publish = deviceService.controlDevice("fan", "30");
          device = 'fan';
          newStatus = 'On';
          speed = 30;
          break;
        case 'tắt quạt':
          publish = deviceService.controlDevice("fan", "0");
          device = 'fan';
          newStatus = 'Off';
          speed = 0;
          break;
        default:
          console.log("Command action not mapped to any payload.");
          break;
      }

      let updatedDevice;
      // Cập nhật trạng thái và speed của quạt trong database nếu là quạt
      if (device === "fan") {
        updatedDevice = await Device.findOneAndUpdate(
          { type: "fan" }, // Tìm quạt trong database
          { status: newStatus, speed: speed }, // Cập nhật trạng thái và tốc độ
        );
      } else {
        updatedDevice = await Device.findOneAndUpdate(
          { type: device },
          { status: newStatus },
        );
      }
      if (updatedDevice) {
        const status = newStatus;
        const notes = device === 'fan'
          ? `Speed set to ${speed} by voice`
          : `Status set to ${newStatus} by voice`;

        await DeviceHistory.create({
          device: updatedDevice._id,
          deviceModel: device,
          action: status,
          notes: notes,
          userId: userId || null
        });
      }
      // if (payload !== null) {
      //   publish(payload);
      //   console.log("Payload published:", payload);
      // }

    } else {
      console.log("check")
      await DeviceHistory.create({
        device: null,             // hoặc một device mặc định nếu cần
        deviceModel: 'Unknown',
        action: 'failed',
        notes: `Không nhận diện được lệnh: "${transcript}"`,
        userId: userId || null
      });
      const aminId = await Admin.findOne({}).select('_id')
      await Notification.create({
        message: `Người dùng ${userId} điều khiển thiết bị bằng giọng nói thất bại`,             // hoặc một device mặc định nếu cần
        userID: aminId || null
      });
      console.log("No matching command found.");
    }
  } catch (err) {
    console.error("Error in handleTranscript:", err);
  }
};


