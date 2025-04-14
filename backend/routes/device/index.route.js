const deviceRoute = require("./device.route")


module.exports = (app) => {
    app.use("/device", deviceRoute);
}