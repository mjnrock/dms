const mongoose = require("mongoose");

export const ComponentSchema = new mongoose.Schema({
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
		type: Object,
	},
	default: {
		type: Array,
	},
});
