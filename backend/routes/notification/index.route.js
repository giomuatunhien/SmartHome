const notificationRoute = require('./notification.router')

module.exports = (app) => {
    app.use("/notification", notificationRoute);
}