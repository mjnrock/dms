import Node from "./../package";

/**
 * Convert some generic data object into its representative Node tree.
 */
//TODO: Needs parsing logic and potentially memory management.
export function ObjectToNode(obj = {}) {
	let node;

	for(let [ key, value ] of Object.entries(obj)) {
		if(Array.isArray(value)) {
			let [ type, data, ...rest ] = value;

			//TODO: Generate a Node from the @type and @value (...rest will contain, e.g., NumberNode-specific data "int8")
		} else if(typeof value === "object") {
			//TODO: Consider it a GROUP and recurse
		}
	}
};

export function ArrayToNode(arr = []) {
	return ObjectToNode(Object.fromEntries(arr));
};

export function JsonToNode(json = "") {
	let obj = json;
	while(typeof obj === "string") {
		obj = JSON.parse(obj);
	}

	return ObjectToNode(obj);
};

/**
 * Dynamically select which parser to use based on the type of the input.
 */
export function DataToNode(data) {
	if(Array.isArray(data)) {
		return ArrayToNode(data);
	} else if(typeof data === "object") {
		return ObjectToNode(data);
	} else if(typeof data === "string") {
		return JsonToNode(data);
	}

	return false;
};

export default {
	ObjectToNode,
	ArrayToNode,
	JsonToNode,

	DataToNode,
};