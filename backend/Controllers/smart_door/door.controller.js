const Door = require('../../models/smart_door.model');
const DoorHistory = require('../../models/smart_door_history');
///require('../../models/user.model');
//const DoorData = require('../../models/smart_door_data.model');
const MQTT = require('../../services/doorService')
const Notification = require('../../models/notification.model');
const { Admin } = require('../../models/account.model');
const User = require('../../models/user.model');

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
    const { userId, currentPassword, newPassword } = req.body;
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
    const users = await User.find().select('_id');
    if (users.length > 0) {
      const payloads = users.map(u => ({
        message: `Người dùng ${userId} vừa đổi mật khẩu cửa thành ${newPassword}`,
        userID: u._id
      }));

      await Notification.insertMany(payloads);
    }

    res.status(200).json({ message: 'Thay đổi mật khẩu thành công!', door });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thay đổi mật khẩu cho cửa.', error: error.message });
  }
};


const accessDoor = async (req, res) => {
  try {
    const { password, userId } = req.body;
    //console.log(userId)
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
      MQTT.sendDoorStatus(1, userId)
      res.status(200).json({ message: 'Cửa đã mở!', door });
    } else {
      const doorHistory = new DoorHistory({
        door: door._id,
        action: 'failed',
        notes: 'Nhập mật mã',
        userID: userId
      });
      await doorHistory.save();

      const aminId = await Admin.findOne({}).select('_id')
      await Notification.create({
        message: `Người dùng ${userId} mở cửa bằng mật khẩu thất bại`,             // hoặc một device mặc định nếu cần
        userID: aminId || null
      });
      res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi truy cập cửa.', error: error.message });
  }
};

const closeDoor = async (req, res) => {
  try {
    let updatedDoor = await Door.findOne();
    const { userId } = req.body;

    if (!updatedDoor) {
      return res.status(404).json({ message: "Không tìm thấy cửa!" });
    }

    if (updatedDoor.status === 'locked') {
      return res.status(400).json({ message: "Cửa đã đóng rồi!" });
    }

    updatedDoor.status = 'locked';
    await updatedDoor.save();

    // Gửi tín hiệu đóng cửa đến MQTT (nếu có)
    MQTT.sendDoorStatus(0, userId);
    //console.log("🔒 Cửa đã tự động đóng.");

    res.status(200).json({ message: "Cửa đã đóng thành công!" });
  } catch (error) {
    console.error("Lỗi đóng cửa:", error);
    res.status(500).json({ message: "Lỗi server khi đóng cửa!", error: error.message });
  }
};


const getDoorHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const total = await DoorHistory.countDocuments();
    const historyList = await DoorHistory
      .find().sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'userID',
        select: 'fullname'
      })
    res.status(200).json({ success: true, data: historyList, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Lỗi khi lấy door history:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch sử cửa.' });
  }
};
const authorFaceAI = async (req, res) => {
  try {
    const { facePassword } = req.body;
    //console.log(facePassword)
    if (!facePassword) {
      return res.status(400).json({ message: 'Vui lòng nhập mật khẩu.' });
    }

    const door = await Door.findOne();
    if (!door) {
      return res.status(404).json({ message: 'Cửa chưa được thiết lập mật khẩu.' });
    }
    //console.log(door.password)
    if (door.password === facePassword) {
      return res.status(200).json({ message: 'Mật khẩu đúng!' });
    } else {
      return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi truy cập cửa.', error: error.message });
  }
};

const accessDoorByFaceAI = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'Thiếu userId.' });
    }

    const door = await Door.findOne();
    if (!door) {
      return res.status(404).json({ message: 'Cửa chưa được thiết lập.' });
    }

    // 1. Mở cửa
    door.status = 'unlocked';
    door.lastAccessedAt = new Date();
    await door.save();

    // 2. Gửi lệnh mở cửa qua MQTT (1 = unlock)
    MQTT.sendDoorStatus(1, userId);

    // 3. Ghi vào lịch sử
    const history = new DoorHistory({
      door: door._id,
      action: 'open',
      notes: 'Face AI',
      userID: userId
    });
    await history.save();

    return res.status(200).json({
      message: 'Cửa đã mở bằng Face AI!',
    });
  } catch (error) {
    console.error('Lỗi accessDoorByFaceAI:', error);
    return res.status(500).json({
      message: 'Lỗi khi truy cập cửa bằng Face AI.',
      error: error.message
    });
  }
};


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
  getDoorStatus,
  getDoorHistory,
  authorFaceAI,
  accessDoorByFaceAI
};
