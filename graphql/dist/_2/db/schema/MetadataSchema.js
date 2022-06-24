const mongoose = require("mongoose");
export const MetadataSchema = new mongoose.Schema({
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
