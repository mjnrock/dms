import Node from "./../package";

/**
 * Convert some generic data object into its representative Node tree.
 */
//TODO: Needs parsing logic and potentially memory management.
export function ObjectToNode(obj = {}) {
	let parent = new Node.GroupNode();

	for(let [ key, value ] of Object.entries(obj)) {
		let node;

		
		if(Array.isArray(value)) {
			let [ type, data, ...rest ] = value;
			
			if(type === "text") {
				node = new Node.TextNode({ data, alias: key });
			} else if(type === "number") {
				node = new Node.NumberNode({ data , alias: key});
			}
		} else if(typeof value === "object") {
			let sub = ObjectToNode(value);

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