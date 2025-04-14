const Door = require('../../models/smart_door.model');
const DoorHistory = require('../../models/smart_door_history');
const DoorData = require('../../models/smart_door_data.model');
const MQTT = require('../../services/doorService')

const setDoorPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu.' });
    }

    let door = await Door.findOne();
    if (door) {
      return res.status(400).json({ message: 'Mật khẩu đã được đặt. Vui lòng sử dụng chức năng thay đổi mật khẩu.' });
    } else {
      door = new Door({ password, status: 'locked' });
      await door.save();
      return res.status(200).json({ message: 'Đặt mật khẩu thành công!', door });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi đặt mật khẩu cho cửa.', error: error.message });
  }
};

const changeDoorPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.' });
    }

    let door = await Door.findOne();
    if (!door) {
      return res.status(404).json({ message: 'Cửa chưa được thiết lập. Vui lòng đặt mật khẩu trước.' });
    }

    if (door.password !== currentPassword) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng.' });
    }

    door.password = newPassword;
    door.status = 'locked';
    await door.save();

    res.status(200).json({ message: 'Thay đổi mật khẩu thành công!', door });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thay đổi mật khẩu cho cửa.', error: error.message });
  }
};


const accessDoor = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Vui lòng nhập mật khẩu.' });
    }

    const door = await Door.findOne();
    if (!door) {
      return res.status(404).json({ message: 'Cửa chưa được thiết lập mật khẩu.' });
    }


    if (door.password === password) {
      door.status = 'unlocked';
      door.lastAccessedAt = new Date();
      await door.save();

      // const doorHistory = new DoorHistory({
      //   door: door._id,
      //   action: 'open',
      //   notes: 'Mật khẩu đúng, cửa được mở.'
      // });
      // await doorHistory.save();
      MQTT.sendDoorStatus(1)
      res.status(200).json({ message: 'Cửa đã mở!', door });
    } else {
      const doorHistory = new DoorHistory({
        door: door._id,
        action: 'failed',
        notes: 'Mật khẩu không đúng.'
      });
      await doorHistory.save();
      res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi truy cập cửa.', error: error.message });
  }
};

const closeDoor = async (req, res) => {
  try {
    let updatedDoor = await Door.findOne();

    if (!updatedDoor) {
      return res.status(404).json({ message: "Không tìm thấy cửa!" });
    }

    if (updatedDoor.status === 'locked') {
      return res.status(400).json({ message: "Cửa đã đóng rồi!" });
    }

    updatedDoor.status = 'locked';
    await updatedDoor.save();

    // Gửi tín hiệu đóng cửa đến MQTT (nếu có)
    MQTT.sendDoorStatus(0);
    console.log("🔒 Cửa đã tự động đóng.");

    res.status(200).json({ message: "Cửa đã đóng thành công!" });
  } catch (error) {
    console.error("Lỗi đóng cửa:", error);
    res.status(500).json({ message: "Lỗi server khi đóng cửa!", error: error.message });
  }
};


// const getdoorData = async (value) => {
//   try {
//     let status;
//     if (value === '1') {
//       status = true;
//     } else if (value === '0') {
//       status = false;
//     } else {
//       throw new Error(`Giá trị không hợp lệ: ${value}. Chỉ chấp nhận '1' hoặc '0'.`);
//     }
//     const newRecord = new DoorData({ status });
//     await newRecord.save();

//     console.log('Đã lưu trạng thái cửa:', newRecord);
//   } catch (error) {
//     console.error('Lỗi khi cập nhật trạng thái cửa:', error);
//   }
// };

const getDoorStatus = async (req, res) => {
  try {
    const door = await Door.findOne();
    if (!door) {
      return res.status(404).json({ message: 'Cửa chưa được thiết lập.' });
    }

    res.status(200).json({ data: door.status }); // Trả về 'locked' hoặc 'unlocked'
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy trạng thái cửa.', error: error.message });
  }
};

module.exports = {
  setDoorPassword,
  accessDoor,
  changeDoorPassword,
  //getdoorData,
  closeDoor,
  getDoorStatus
};
