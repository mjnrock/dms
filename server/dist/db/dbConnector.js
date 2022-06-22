"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = exports.Reducers = exports.Components = exports.Domains = void 0;
const mongoose = require("mongoose");
const { DomainSchema, ComponentSchema, ReducerSchema, MetadataSchema } = require("./schema");
/**
 * Mongoose Connection
 **/
const host = `localhost`;
const port = 27017;
mongoose.connect(`mongodb://${host}:${port}/dms`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let db = mongoose.connection;
db.on("error", () => {
    console.error("Error while connecting to DB");
});
const Domains = mongoose.model("Domains", DomainSchema);
exports.Domains = Domains;
const Components = mongoose.model("Components", ComponentSchema);
exports.Components = Components;
const Reducers = mongoose.model("Reducers", ReducerSchema);
exports.Reducers = Reducers;
const Metadata = mongoose.model("Metadata", MetadataSchema);
exports.Metadata = Metadata;
