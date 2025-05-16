const jwt = require('jsonwebtoken');
const { Admin } = require('../../models/account.model');

// const create_admin_account = async (req, res) => {
//   try {
//     const existEmail = await Admin.findOne({
//       email: req.body.email,
//     });
//     if (existEmail) {
//       return res.status(400).json({ message: 'Email đã được sử dụng.' });
//     }

//     const newAccount = new Admin(req.body);

//     const token = jwt.sign(
//       {
//         id: newAccount._id,
//         fullname: newAccount.fullname,
//         role: newAccount.role
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );
//     newAccount.token = token;

//     await newAccount.save();

//     res.cookie("token", token, {
//       maxAge: 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       secure: true
//     });

//     res.status(201).json({
//       message: "Tạo tài khoản thành công",
//       account: newAccount,
//       token: newAccount.token
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating account!",
//       error: error.message
//     });
//   }
// };
const create_admin_account = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.status(400).json({ message: 'Hệ thống chỉ cho phép có một admin duy nhất.' });
    }

    const newAccount = new Admin(req.body);

    const token = jwt.sign(
      {
        id: newAccount._id,
        fullname: newAccount.fullname,
        role: newAccount.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    newAccount.token = token;

    await newAccount.save();

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true
    });

    res.status(201).json({
      message: "Tạo tài khoản admin thành công",
      account: newAccount,
      token: newAccount.token
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo tài khoản admin!",
      error: error.message
    });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select('-imageData')
  //console.log(admin);
  if (!admin) {
    return res.status(400).json({ message: 'Email đăng nhập không chính xác.' });
  }

  if (admin.password !== password) {
    return res.status(400).json({ message: 'Sai mật khẩu.' });
  }

  const token = jwt.sign(
    {
      id: admin.id,
      fullname: admin.fullname,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // admin.token = token;
  // await admin.save();

  // Lưu token vào cookie
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
  });

  res.status(200).json({
    message: "Đăng nhập thành công!",
    user: admin.fullname,
    role: admin.role,
    //token: admin.token,
    userId: admin.id
  });
};


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
  create_admin_account,
  login,
  logout,
  verifyToken
};
