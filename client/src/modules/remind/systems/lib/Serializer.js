import Node from "../../lib/Node";
import { Registry } from "../../lib/Registry";

export const EnumType = {
	OBJECT: "object",
	JSON: "json",
	STRING: "string",
};

export function toRegistry(registry) {
	if(registry instanceof Registry) {
		return new Registry({
			state: new Map(registry.state),
		});
	} else if(registry instanceof Node) {
		return toRegistry(registry.state);
	}

	return false;
};

/**
 * In general, this is primarily intended to be used with a value for @fn
 * in most cases, but it will default to the default way of handling that
 * thing, as dictated by its type.  Basically it's a way to allow for very
 * specific overrides to a particular invocation, while allowing for default
 * serialization behavior to be used, as a default.
 */
export function toObject({ node, resultType = "@node", result = {}, fn, systems } = {}) {
	if(resultType === "@node") {
		let ret = {
			...result,
			...Node.ToObject(node),
		};

		if(typeof fn === "function") {
			ret.state = fn({ node: node, resultType: "@state", result: ret.state, fn, systems });

			for(let comp in node.shared) {
				ret.shared[ comp ] = fn({ node: node, resultType: comp, result: ret.shared[ comp ] || {}, fn, systems });
			}
		}

		return ret;
	} else if(resultType === "@state") {
		let ret = {};

		for(let key in systems) {
			if(node.hasToken(key) && typeof systems[ key ].toObject === "function") {
				ret = systems[ key ].toObject(node, ret);
			}
		}

		if(Object.keys(result).length === 0) {
			return ret;
		} else {
			return {
				...result,
				...ret,
			};
		}
	} else if(!!resultType) {
		let ret = {
			...result,
		};

		if(resultType in systems && "toObject" in systems[ resultType ] && typeof systems[ resultType ].toObject === "function") {
			return systems[ resultType ].toObject(node);
		}

		if(typeof fn === "function") {
			return fn({ node: node, resultType: false, result: ret, fn, systems });
		}

		return ret;
	} else {
		if(typeof fn === "function") {
			return fn({ node: node, resultType: false, result: result, fn: false, systems });
		}

		return result || null;
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

export default {
	EnumType,

	toRegistry,
	toObject,

	Serialize,
};