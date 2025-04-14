const account = require("./account.route")


module.exports = (app) => {
    app.use("/user", account);
}