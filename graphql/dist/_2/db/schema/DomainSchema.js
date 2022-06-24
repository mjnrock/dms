const mongoose = require("mongoose");
export const DomainSchema = new mongoose.Schema({
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
