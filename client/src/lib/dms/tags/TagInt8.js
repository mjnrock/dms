import { Node } from "../Node.js";

export const EnumTagType = {
	ANY: "any",
	GROUP: "group",
	BOOLEAN: "boolean",
	// UINT8: "uint8",
	// UINT16: "uint16",
	// UINT32: "uint32",
	// UINT64: "uint64",
	INT8: "int8",
	// INT16: "int16",
	// INT32: "int32",
	// INT64: "int64",
	// FLOAT32: "float32",
	// FLOAT64: "float64",
	STRING: "string",
	// ARRAY: "array",
	// OBJECT: "object",
	// DATE: "date",
	// TIME: "time",
	// DATETIME: "datetime",
	// ENUM: "enum",
	// LIST: "list",
	// MAP: "map",
	// REFERENCE: "reference",
	// FUNCTION: "function",
}

export class Tag extends Node {
	static Type = EnumTagType;

	constructor ({ ...rest } = {}) {
		super({ ...rest });
	}
}

export default Tag;