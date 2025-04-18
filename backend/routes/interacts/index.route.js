const interactsRoute = require('./interacts.router')

module.exports = (app) => {
    app.use("/interacts", interactsRoute);
}