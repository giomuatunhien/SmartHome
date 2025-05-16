const FaceData = require('../../models/facedata.model');
//const FaceData_help = require('./facedata_help_train');

// Tạo thiết bị mới
const addFacedata = async (req, res) => {
    try {
        const { userID } = req.params;
        if (!userID) {
            return res.status(400).json({ message: 'Thiếu userID' });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Phải upload ít nhất 1 ảnh' });
        }

        // Chuẩn bị mảng imageData mới
        const imageData = req.files.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));

        // Kiểm tra và xử lý nếu đã tồn tại
        let faceDoc = await FaceData.findOne({ userID });
        if (faceDoc) {
            // Xóa ảnh cũ bằng cách ghi đè mảng mới
            faceDoc.imageData = imageData;
            await faceDoc.save();
            return res.status(200).json({
                message: 'Cập nhật ảnh thành công',
                faceDataId: faceDoc._id
            });
        }

        // Nếu chưa tồn tại thì tạo mới
        faceDoc = new FaceData({ userID, imageData });
        await faceDoc.save();

        return res.status(201).json({
            message: 'Lưu ảnh thành công',
            faceDataId: faceDoc._id
        });

    } catch (error) {
        console.error('Lỗi thêm/cập nhật dữ liệu khuôn mặt:', error);
        res.status(500).json({ message: error.message });
    }
};

const getFacedata = async (req, res) => {
    try {
        const facedatas = await FaceData.find();
        res.status(200).json({
            message: "Lấy dữ liệu khuôn mặt thành công!",
            facedatas
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy dữ liệu khuôn mặt.",
            error: error.message
        });
    }
};


module.exports = {
    addFacedata,
    getFacedata
};
