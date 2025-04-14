const Device = require('../../models/device.model');
const mongoose = require('mongoose');
const deviceService = require('../../services/deviceService')

// Tạo thiết bị mới
const create_device = async (req, res) => {
    try {
        let { deviceName, type, status, speed, systemID } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!deviceName || !type) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết (deviceName, type, systemID)" });
        }
        // Tạo systemID ngẫu nhiên nếu không có
        if (!systemID) {
            systemID = new mongoose.Types.ObjectId();
        }
        // Kiểm tra type và speed
        if (type === "light" && speed !== undefined) {
            return res.status(400).json({ message: "Thiết bị light không thể có speed" });
        }

        if (type === "fan" && (speed < 0 || speed > 100)) {
            return res.status(400).json({ message: "Speed của fan phải trong khoảng từ 0 đến 100" });
        }

        if (type === "fan" && (speed == undefined)) {
            speed = 0;
        }

        const newDevice = new Device({ deviceName, type, status, speed, systemID });
        const savedDevice = await newDevice.save();
        res.status(201).json(savedDevice);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả thiết bị
const get_all_devices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json({ data: devices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin thiết bị theo ID
const get_device_by_id = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) return res.status(404).json({ message: "Không tìm thấy thiết bị" });
        res.status(200).json({ data: device });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thiết bị
const update_device = async (req, res) => {
    try {
        const { deviceName, status, speed, activationThreshold, deactivationThreshold } = req.body;

        // Lấy thiết bị cần cập nhật
        const device = await Device.findById(req.params.id);
        if (!device) return res.status(404).json({ message: "Không tìm thấy thiết bị để cập nhật" });

        // Kiểm tra hợp lệ dữ liệu
        if (deviceName && typeof deviceName !== "string") {
            return res.status(400).json({ message: "deviceName phải là kiểu chuỗi" });
        }

        if (status && !["On", "Off"].includes(status)) {
            return res.status(400).json({ message: "status không hợp lệ" });
        }

        if (speed !== undefined) {
            if (device.type === "light" && speed !== null) {
                return res.status(400).json({ message: "Thiết bị light không thể có speed" });
            }
            if (device.type === "fan" && (typeof speed !== "number" || speed < 0 || speed > 5)) {
                return res.status(400).json({ message: "Speed của fan phải là số từ 0 đến 5" });
            }
        }

        // Lấy ngưỡng hiện tại từ database nếu cần
        const currentActivationThreshold = device.activationThreshold;
        const currentDeactivationThreshold = device.deactivationThreshold;

        // Kiểm tra điều kiện so sánh ngưỡng:
        const newActivationThreshold = activationThreshold ?? currentActivationThreshold;
        const newDeactivationThreshold = deactivationThreshold ?? currentDeactivationThreshold;
        // Kiểm tra điều kiện so sánh ngưỡng
        if (
            (device.type === "fan" && Number(newActivationThreshold) <= Number(newDeactivationThreshold)) ||
            (device.type === "light" && Number(newActivationThreshold) >= Number(newDeactivationThreshold))
        ) {
            return res.status(400).json({
                message: "Ngưỡng kích hoạt và ngưỡng tắt không hợp lệ"
            });
        }


        // Cập nhật thiết bị với các trường có trong request body
        const updatedFields = {};
        if (deviceName !== undefined) updatedFields.deviceName = deviceName;
        if (status !== undefined) updatedFields.status = status;
        if (speed !== undefined) updatedFields.speed = speed;
        if (activationThreshold !== undefined) updatedFields.activationThreshold = activationThreshold;
        if (deactivationThreshold !== undefined) updatedFields.deactivationThreshold = deactivationThreshold;

        const updatedDevice = await Device.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );

        res.status(200).json({ data: updatedDevice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Xóa thiết bị
const delete_device = async (req, res) => {
    try {
        const deletedDevice = await Device.findByIdAndDelete(req.params.id);
        if (!deletedDevice) return res.status(404).json({ message: "Không tìm thấy thiết bị để xóa" });

        res.status(200).json({ message: "Đã xóa thiết bị" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Tìm kiếm thiết bị
const search_device = async (req, res) => {
    try {
        const { type, deviceName, status } = req.query;
        const query = {};

        if (type) query.type = type;
        if (deviceName) query.deviceName = new RegExp(deviceName, "i");
        if (status) query.status = status;

        const devices = await Device.find(query);
        res.status(200).json({ data: devices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const controlDevice = async (req, res) => {
    try {
        const { device, newStatus } = req.body;
        if (!device || !newStatus) {
            return res.status(400).json({ error: "Thiếu thông tin device hoặc newStatus!" });
        }

        let speed = null; // Chỉ sử dụng nếu là quạt
        console.log(device, newStatus)
        // Xử lý điều khiển thiết bị
        if (device === "fan") {
            speed = newStatus === "On" ? "30" : "0"; // Bật quạt thì speed = 30, tắt thì 0
            deviceService.controlDevice(device, speed);
        } else if (device === "light") {
            const lightStatus = newStatus === "On" ? "1" : "0";
            deviceService.controlDevice(device, lightStatus);
        }

        // Cập nhật trạng thái và speed của quạt trong database nếu là quạt
        if (device === "fan") {
            await Device.findOneAndUpdate(
                { type: "fan" }, // Tìm quạt trong database
                { status: newStatus, speed: speed }, // Cập nhật trạng thái và tốc độ
            );
        } else {
            await Device.findOneAndUpdate(
                { type: device },
                { status: newStatus },
            );
        }

        res.status(200).json({ message: `Đã gửi lệnh '${newStatus}' tới thiết bị '${device}'` });

    } catch (error) {
        console.error("Lỗi khi điều khiển thiết bị:", error);
        res.status(500).json({ error: "Lỗi server trong quá trình điều khiển thiết bị!" });
    }
};


module.exports = {
    create_device,
    get_all_devices,
    get_device_by_id,
    update_device,
    delete_device,
    search_device,
    controlDevice
};
