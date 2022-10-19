import Node from "./../package";

/**
 * Convert some struct data object into its representative Node tree.
 * 
 * NOTE: This expects @obj to be a "Struct Object", NOT a "Schema Object".
 */
export function StructToNode(obj = {}) {
	let parent = new Node.GroupNode({
		tags: [ "test", "cat" ],
	});

	for(let [ key, value ] of Object.entries(obj)) {
		let node;

		if(Array.isArray(value)) {
			let [ type, data, ...rest ] = value;

			if(type === "text") {
				node = new Node.TextNode({ data, alias: key });
			} else if(type === "number") {
				let [ dtype ] = rest;

				node = new Node.NumberNode({ data, alias: key, dtype });
			}
		} else if(typeof value === "object") {
			let sub = StructToNode(value);

			node = new Node.GroupNode({
				data: sub.data,
				alias: key,
			});
		} else {
			node = new Node.Node({ data: value, alias: key });
		}

		if(node) {
			parent.addChild(node);
		}
	}

	return parent;
};

export function ArrayToNode(arr = []) {
	return StructToNode(Object.fromEntries(arr));
};

export function JsonToNode(json = "") {
	let obj = json;
	while(typeof obj === "string") {
		obj = JSON.parse(obj);
	}

	return StructToNode(obj);
};

/**
 * Dynamically select which parser to use based on the type of the input.
 */
export function DataToNode(data) {
	if(Array.isArray(data)) {
		return ArrayToNode(data);
	} else if(typeof data === "object") {
		return StructToNode(data);
	} else if(typeof data === "string") {
		return JsonToNode(data);
	}

	return false;
};

export default {
	StructToNode,
	ArrayToNode,
	JsonToNode,

	DataToNode,
};