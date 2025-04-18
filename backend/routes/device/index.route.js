const deviceRoute = require('./device.router')

module.exports = (app) => {
    app.use("/device", deviceRoute);
}