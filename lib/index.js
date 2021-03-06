"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CenterServer = void 0;
var server_1 = require("./Provider/server");
var client_1 = require("./Consumer/client");
var logger_1 = require("./common/logger/logger");
var zego_config_1 = require("zego-config");
var zego_injector_1 = require("zego-injector");
var Path = require("path");
var CenterServer = (function () {
    function CenterServer() {
    }
    CenterServer.initConfig = function (config) {
        var injector = config == null || !('get' in config)
            ? zego_config_1.ConfigManage.craete(Path.join(__dirname, "./config/" + (process.env.NODE_ENV || 'production') + ".env"))
            : config;
        zego_injector_1.Factory.useFactory({
            provide: zego_config_1.ConfigService,
            useFactory: function () { return injector; },
        });
    };
    CenterServer.initLogger = function (logger) {
        if (logger == null || !('log' in logger)) {
            return;
        }
        zego_injector_1.Factory.useReplace({
            provide: logger_1.BusinessLogger,
            useFactory: function () { return logger; },
        });
    };
    CenterServer.createService = function (config, logger) {
        CenterServer.initConfig(config);
        CenterServer.initLogger(logger);
        return zego_injector_1.Factory.create(server_1.CenterService);
    };
    CenterServer.createClient = function (config, logger) {
        CenterServer.initConfig(config);
        CenterServer.initLogger(logger);
        return zego_injector_1.Factory.create(client_1.CenterClient);
    };
    return CenterServer;
}());
exports.CenterServer = CenterServer;
//# sourceMappingURL=index.js.map