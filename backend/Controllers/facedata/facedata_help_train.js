// POST /train
const { spawn } = require('child_process');
const FaceData = require('../../models/facedata.model');

const trainFaceModel = async (req, res) => {
    try {
        const facedata = await FaceData.find();
        const payload = facedata.map(doc => ({
            userID: doc.userID.toString(),
            images: doc.imageData.map(img => ({
                contentType: img.contentType,
                base64: img.data.toString('base64')
            }))
        }));

        const py = spawn(process.env.pythonExe, ['./train_model_face.py']);

        py.stdin.write(JSON.stringify(payload));
        py.stdin.end();

        py.stdout.on('data', data => console.log('[PYTHON]', data.toString()));
        py.stderr.on('data', err => console.error('[PYTHON ERROR]', err.toString()));
        py.on('error', err => {
            console.error("[PY ERROR]", err);
        });
        py.on('exit', code => {
            console.log("[PY EXIT]", code);
        });
        py.on('close', code => {
            res?.status(200).json({ message: "Train complete", code });
        });
    } catch (err) {
        if (res && res.status) {
            return res.status(500).json({ message: "Lỗi khi lấy dữ liệu khuôn mặt.", error: err.message });
        }
    }
};


const recognizeFace = (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "Phải truyền userId trong đường dẫn" });
    }
    const py = spawn(process.env.pythonExe, ['./recognize_camera.py', userId]);
    let output = '';
    py.stdout.on('data', data => output += data.toString());
    py.stderr.on('data', err => console.error('Python error:', err.toString()));

    py.on('close', code => {
        try {
            const result = JSON.parse(output);  // Parse kết quả trả về từ Python
            res.json({ userId: result.userID, dist: result.dist });  // Trả về userId và confidence
        } catch (e) {
            res.status(500).json({ message: "Không parse được kết quả từ Python", error: e.message });
        }
    });
};


module.exports = { trainFaceModel, recognizeFace }