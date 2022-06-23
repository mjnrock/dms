const mongoose = require("mongoose");
export const ReducerSchema = new mongoose.Schema({
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
    scope: {
        type: Array,
    },
});
