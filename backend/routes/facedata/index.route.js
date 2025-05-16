const facedataRoute = require('./facedata.router')

module.exports = (app) => {
    app.use("/facedata", facedataRoute);
}