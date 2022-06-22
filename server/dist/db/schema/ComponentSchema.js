"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentSchema = void 0;
const mongoose = require("mongoose");
exports.ComponentSchema = new mongoose.Schema({
    uuid: {
        type: String,
    },
    parent: {
        type: String,
    },
    domain: {
        type: String,
    },
    data: {
        type: String,
    },
});
