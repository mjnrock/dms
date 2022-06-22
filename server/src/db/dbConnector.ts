const mongoose = require("mongoose");
const { DomainSchema, ComponentSchema, ReducerSchema, MetadataSchema } = require("./schema");

/**
 * Mongoose Connection
 **/
const host = `localhost`;
const port = 27017;
mongoose.connect(`mongodb://${ host }:${ port } /dms`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

let db = mongoose.connection;
db.on("error", () => {
	console.error("Error while connecting to DB");
});

const Domains = mongoose.model("Domains", DomainSchema);
const Components = mongoose.model("Components", ComponentSchema);
const Reducers = mongoose.model("Reducers", ReducerSchema);
const Metadata = mongoose.model("Metadata", MetadataSchema);

export { Domains, Components, Reducers, Metadata };
