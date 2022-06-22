"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataSchema = void 0;
const mongoose = require("mongoose");
exports.MetadataSchema = new mongoose.Schema({
    uuid: {
        type: String,
    },
    ref: {
        type: String,
    },
    refType: {
        type: String,
    },
    namespace: {
        type: String,
    },
    tags: {
        type: Array,
    },
    description: {
        type: String,
    },
});
