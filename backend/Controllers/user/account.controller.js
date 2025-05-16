const jwt = require('jsonwebtoken');
const UserModel = require("../../models/user.model")

const verifyToken = (req, res) => {
    const token = req.cookies.token;  // Đọc token từ cookie
    if (!token) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({
            message: "Token hợp lệ",
            user: decoded.fullname,
            role: decoded.role
        });
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};


const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message: "Đăng xuất thành công!",
        })
    } catch (error) {
        res.status(400).json({
            message: "Error!",
            error: error.message
        })
    }
}

const getUser = async (req, res) => {
    try {
        const { userid } = req.params;
        if (!userid) {
            return res.status(400).json({
                message: "User ID không hợp lệ!"
            });
        }
        const user = await UserModel.findById(userid);
        res.status(200).json({
            message: "Lấy thông tin người dùng thành công!",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi lấy thông tin người dùng!",
            error: error.message
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const { userid } = req.params;
        if (!userid) {
            return res.status(400).json({ message: "User ID không hợp lệ!" });
        }

        // Lọc ra những field được phép update
        const allowedFields = ['fullname', 'email', 'phone'];
        const updates = {};
        for (let key of allowedFields) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        // Nếu có file ảnh thì xử lý thêm imageData
        if (req.file) {
            updates.imageData = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Không có dữ liệu hợp lệ để cập nhật!" });
        }

        // Thực hiện cập nhật
        const updatedUser = await UserModel.findByIdAndUpdate(
            userid,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        res.status(200).json({
            message: "Cập nhật thông tin người dùng thành công!",
            data: updatedUser
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật người dùng:', error);
        res.status(500).json({
            message: "Lỗi khi cập nhật thông tin người dùng!",
            error: error.message
        });
    }
};



module.exports = {
    logout,
    verifyToken,
    getUser,
    updateUser
};
