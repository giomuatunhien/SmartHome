const authenticationlogRoute = require('./authenticationlog.router')

module.exports = (app) => {
    app.use("/authenticationlog", authenticationlogRoute);
}