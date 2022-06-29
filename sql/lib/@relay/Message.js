//eslint-ignore
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
exports.__esModule = true;
exports.Message = void 0;
var uuid_1 = require("uuid");
var Message = /** @class */ (function () {
    function Message(_a) {
        var data = _a.data, type = _a.type, emitter = _a.emitter, _b = _a.tags, tags = _b === void 0 ? [] : _b, _c = _a.meta, meta = _c === void 0 ? {} : _c;
        this.id = (0, uuid_1.v4)();
        this.data = data;
        this.emitter = emitter;
        if (typeof tags === "string") {
            tags = [tags];
        }
        else if (!Array.isArray(tags)) {
            tags = Array.from(tags);
        }
        this.meta = __assign(__assign({}, meta), { type: meta.type || type || tags[0], tags: new Set(meta.tags || tags), timestamp: Date.now() });
    }
    Message.prototype.toObject = function () {
        var obj = __assign({}, this);
        obj.meta.tags = Array.from(obj.meta.tags);
        return obj;
    };
    Message.prototype.toJson = function () {
        return JSON.stringify(this.toObject());
    };
    Message.prototype.toString = function () {
        return this.toJson();
    };
    Message.From = function (data) {
        return new this(data);
    };
    Message.FromJson = function (json) {
        return this.From(JSON.parse(json));
    };
    Message.FromString = function (str) {
        return this.FromJson(str);
    };
    return Message;
}());
exports.Message = Message;
;
exports["default"] = Message;
