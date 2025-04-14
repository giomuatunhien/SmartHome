const jwt = require('jsonwebtoken');


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



module.exports = {
    logout,
    verifyToken
};
