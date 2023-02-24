export const EnumType = {
	OBJECT: "object",
	JSON: "json",
	STRING: "string",
};

/**
 * In general, this is primarily intended to be used with a value for @fn
 * in most cases, but it will default to the default way of handling that
 * thing, as dictated by its type.  Basically it's a way to allow for very
 * specific overrides to a particular invocation, while allowing for default
 * serialization behavior to be used, as a default.
 */
export function toObject({ node, target, result = {}, fn } = {}) {
	/* Create a generic payload object that the `fn` can use */
	let payload = {
		target,
		node,
		result,
	};

	if(target === "@node") {
		/* Add the "@node" `value` to the `result` */
		payload.value = node;

		/* The `fn` can be a function or an object of target:fn pairs */
		if(typeof fn === "object") {
			result.state = toObject({ node, target: "@state", result, fn: fn.state });

			let keys = Object.keys(fn.shared || {});
			delete keys[ "*" ];

			/* Create special "default" function for all components */
			if(typeof fn[ "*" ] === "function") {
				for(let key in node.shared) {
					result.shared[ key ] = toObject({ node, target: key, result, fn: fn[ "*" ] });
				}
			}

			/* Overwrite the "default" function with the specific component functions */
			for(let key in keys) {
				result.shared[ key ] = toObject({ node, target: key, result, fn: fn.shared[ key ] });
			}
		} else if(typeof fn === "function") {
			/* Set the `result` to the `fn` return value */
			result = fn(payload);
		}

		return result;
	} else if(target === "@state") {
		/* Add the "@state" `value` to the `result.state` */
		payload.value = node.state;

		if(typeof node.state === null) {
			/* Handle the null object case */
			result.state = null;
		} else if(typeof node.state === "object") {
			/* Handle the array case */
			if(Array.isArray(node.state)) {
				if(typeof fn === "function") {
					result.state = fn(payload);
				} else {
					result.state = [
						...(result.state || []),
						...node.state,
					];
				}
			} else {
				/* Handle the iterable case */
				result.state = {
					...result.state,
					...node.state,
				};
			}
		}

		return result;
	} else {
		/* Add the `target` `value` to the `result.shared[ target ]` */
		payload.value = node.shared[ target ];

		if(typeof fn === "function") {
			result.shared[ target ] = fn(payload);
		} else {
			/* Shallowly copy the node's component into the result space */
			result.shared[ target ] = { ...node.shared[ target ] };
		}

		return obj;
	}
};

export function Serialize({ format = EnumType.OBJECT, replacer, spaces, ...rest } = {}) {
	switch(format) {
		case EnumType.OBJECT:
			return toObject(rest);
		case EnumType.JSON:
			return JSON.stringify(toObject(rest), replacer, spaces);
		case EnumType.STRING:
			return JSON.stringify(toObject(rest), replacer, spaces);
		default:
			return JSON.stringify(rest, replacer, spaces);
	}
};