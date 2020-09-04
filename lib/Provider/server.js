"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CenterService = void 0;
var fast_safe_stringify_1 = require("fast-safe-stringify");
var node_zookeeper_client_1 = require("node-zookeeper-client");
var zk_helper_1 = require("../common/zookeeper/zk.helper");
var injectable_1 = require("../common/injector/injectable");
var configService_1 = require("../common/config/configService");
var system_weight_1 = require("../common/system/system.weight");
var Path = require("path");
var logger_1 = require("../common/logger/logger");
var CenterService = (function () {
    function CenterService(helper, config, logger) {
        this.helper = helper;
        this.config = config;
        this.logger = logger;
        this.liveHeadTask = new Map();
        this.nextTick();
    }
    CenterService.prototype.isBreakZk = function (cpu, avg5, avg15, heap) {
        return cpu >= 0.8 || avg5 > 0.85 || avg15 > 0.85 || heap > 0.85;
    };
    CenterService.prototype.nextTick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tasks, _a, weight, cpu, avg5, avg15, heap, isNeedBreak, currentTask, path, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.nextHandler && clearTimeout(this.nextHandler);
                        tasks = Array.from(this.liveHeadTask.values());
                        this.nextHandler = setTimeout(this.nextTick.bind(this), 20000);
                        if (!(tasks.length >= 0)) return [3, 10];
                        return [4, system_weight_1.GetSystemWeight()];
                    case 1:
                        _a = _b.sent(), weight = _a.weight, cpu = _a.cpu, avg5 = _a.avg5, avg15 = _a.avg15, heap = _a.heap;
                        this.logger.log("[CenterService-isBreakZk] \r\n \u5F53\u524D\u670D\u52A1\u5668\u60C5\u51B5:cpu\u4F7F\u7528\u7387:" + cpu + ",avg5:" + avg5 + ",avg15:" + avg15 + ",node\u5185\u5B58\u4F7F\u7528\u7387:" + heap);
                        isNeedBreak = this.isBreakZk(cpu, avg5, avg15, heap);
                        if (!isNeedBreak) return [3, 3];
                        return [4, this.helper.close()];
                    case 2: return [2, _b.sent()];
                    case 3:
                        this.logger.log("[CenterService-nextTick] \r\n \u5F53\u524D\u8C03\u7528\u6CE8\u518C\u4E2D\u5FC3\u7684task:" + JSON.stringify(tasks) + ",\u5F53\u524D\u7684weight:" + weight);
                        currentTask = void 0;
                        _b.label = 4;
                    case 4:
                        if (!(currentTask = tasks.shift())) return [3, 10];
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 8, , 9]);
                        return [4, this.registerZK(__assign(__assign({}, currentTask), { weight: weight }))];
                    case 6:
                        path = _b.sent();
                        return [4, this.helper.setData(String(path), JSON.stringify({ ip: currentTask.serverIP, port: currentTask.serverPort, weight: weight }))];
                    case 7:
                        _b.sent();
                        return [3, 9];
                    case 8:
                        error_1 = _b.sent();
                        return [3, 9];
                    case 9: return [3, 4];
                    case 10: return [2];
                }
            });
        });
    };
    CenterService.prototype.register = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, registerPath;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = params;
                        _b = params.weight;
                        if (_b) return [3, 2];
                        return [4, system_weight_1.GetSystemWeight()];
                    case 1:
                        _b = (_c.sent()).weight;
                        _c.label = 2;
                    case 2:
                        _a.weight = _b;
                        return [4, this.registerZK(params)];
                    case 3:
                        registerPath = _c.sent();
                        this.liveHeadTask.set(fast_safe_stringify_1.default(params), params);
                        return [2, registerPath];
                }
            });
        });
    };
    CenterService.prototype.unregister = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var del;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.unRegisterZK(params)];
                    case 1:
                        del = _a.sent();
                        this.liveHeadTask.delete(fast_safe_stringify_1.default(params));
                        return [2, del];
                }
            });
        });
    };
    CenterService.prototype.registerZK = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var systemName, serviceName, serverIP, serverPort, weight, serverPath, path, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        systemName = params.systemName, serviceName = params.serviceName, serverIP = params.serverIP, serverPort = params.serverPort, weight = params.weight;
                        serverPath = Path.join(systemName, serviceName);
                        path = Path.join(serverPath, serverIP + ":" + serverPort);
                        data = { ip: serverIP, port: serverPort, weight: weight };
                        return [4, this.helper.mkdirp(serverPath)];
                    case 1:
                        _a.sent();
                        return [4, this.helper.mkdirp(path, JSON.stringify(data), zk_helper_1.ACLS.OPEN_ACL_UNSAFE, node_zookeeper_client_1.CreateMode.EPHEMERAL)];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    };
    CenterService.prototype.unRegisterZK = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var systemName, serviceName, serverIP, serverPort, serverPath, path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        systemName = params.systemName, serviceName = params.serviceName, serverIP = params.serverIP, serverPort = params.serverPort;
                        serverPath = Path.join(systemName, serviceName);
                        path = Path.join(serverPath, serverIP + ":" + serverPort);
                        return [4, this.helper.remove(path)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    CenterService = __decorate([
        injectable_1.Injectable(),
        __metadata("design:paramtypes", [zk_helper_1.ZkHelper,
            configService_1.ConfigService,
            logger_1.BusinessLogger])
    ], CenterService);
    return CenterService;
}());
exports.CenterService = CenterService;
//# sourceMappingURL=server.js.map