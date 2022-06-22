"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainSchema = void 0;
const mongoose = require("mongoose");
exports.DomainSchema = new mongoose.Schema({
    uuid: {
        type: String,
    },
    parent: {
        type: String,
    },
    name: {
        type: String,
    },
});
