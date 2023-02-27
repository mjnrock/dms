import Node from "../../lib/Node";

export const EnumType = {
	OBJECT: "object",
	JSON: "json",
	STRING: "string",
};

export function fromObject({ obj, registry, type = EnumType.OBJECT } = {}) {
	if(type === EnumType.OBJECT) {
		//TODO: Recursively convert all functions to strings, and all `@UUID` refs into actual objects from @registry lookups
		return obj;
	}

	return false;
};

export default {
	EnumType,

	fromObject,
};