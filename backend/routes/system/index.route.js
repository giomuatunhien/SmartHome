const systemRoute = require('./system.router')

module.exports = (app) => {
    app.use("/system", systemRoute);
}