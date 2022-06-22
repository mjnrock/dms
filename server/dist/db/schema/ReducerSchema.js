"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReducerSchema = void 0;
const mongoose = require("mongoose");
exports.ReducerSchema = new mongoose.Schema({
    uuid: {
        type: String,
    },
    parent: {
        type: String,
    },
    domain: {
        type: String,
    },
    fn: {
        type: String,
    },
});
