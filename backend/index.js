const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const database = require('./config/mongoDB.database');

dotenv.config();
require('dotenv').config();

const clientRoute = require('./routes/member/index.route');
const adminRoute = require('./routes/admin/index.route');
const userRoute = require('./routes/user/index.route');//new

const smart_door_Route = require('./routes/smart_door/index.route');
const voice_recognition_system_Router = require('./routes/voice_recognition_system/index.route');
const facedata = require('./routes/facedata/index.route');

const sensorRoute = require('./routes/sensor/index.route');
const environmentRoute = require('./routes/environmentdata/index.route');
const deviceRoute = require('./routes/device/index.route');//new


const notification = require('./routes/notification/index.route');


// phải gọi để các file này được đọc và chạy trước để khi file mqttSevice chạy thì nó có thông tin trong subscriptions
const sensorService = require('./services/sensorService'); // Đảm bảo nó chạy khi server khởi động
const doorService = require('./services/doorService'); // Đảm bảo nó chạy khi server khởi động
const deviceService = require('./services/deviceService'); // Đảm bảo nó chạy khi server khởi động



const app = express();
const port = process.env.PORT;
//const mqttService = require('./services/mqttService');


const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDocument = yamljs.load(path.resolve(__dirname, 'swagger.yaml'));

database.connect();


app.use(cors({
    origin: "http://localhost:3000", // Allow "http://localhost:3000"
    methods: 'GET, POST, DELETE, PATCH, OPTIONS, PUT', // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers, including Content-Type
    credentials: true // Cho phép gửi cookie
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

clientRoute(app);
adminRoute(app);
userRoute(app);


smart_door_Route(app);
voice_recognition_system_Router(app);
facedata(app);

sensorRoute(app);
environmentRoute(app);
deviceRoute(app);
notification(app);

//mqttService.initMQTT();
//sensorService.initMQTT();

// mongoose.connect(`mongodb+srv://giomuatunhien:${process.env.MONGO_DB}@ttdadn.3ltrv.mongodb.net/?retryWrites=true&w=majority&appName=TTDADN`)
//     .then(() => {
//         console.log('connect to DB success')
//     })
//     .catch((err) => {
//         console.log(err)
//     })

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

