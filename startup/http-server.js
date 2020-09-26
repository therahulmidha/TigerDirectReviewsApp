const config = require('config');
module.exports = function (app) {
    // Http server
    const ip = config.get("server.ip");
    const port = process.env.PORT || config.get("server.port");
    app.listen(port, ip, () => {
        console.log(`Server started on http://${ip}:${port}`);
    });
}