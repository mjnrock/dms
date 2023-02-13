import Identity from "../lib/Identity";
import Node from "../lib/Node";

/**
 * Even though you can do basically this with the @emitter
 * directly, using this creates a consistent API for all
 * systems to use.
 */
export const dispatch = (emitter, event, ...args) => {
	if(emitter.events) {
		emitter.events.emit(event, ...args);
	}
};


/**
 * !This error seems to appear because of both the .parent and .children properties, causing infinite recursion
 * IDEA: Probably refactor this entirely where it returns { result: toObject(), registry: Registry<encounter Nodes> }, and accepts a Manifest as an argument
 * It may make sense to formalize the Manifest as a class, whose .state is the current ComponentManifest
 */
export function toObject(value, { idPath = '', registry, systems = {} } = {}) {
	if(value instanceof Node) {
		if(idPath.length > 0) {
			return `@${ value.id }`;
		}

		let [ node ] = arguments,
			state = {},
			lastToken = node.getLastToken();

		if(lastToken in systems) {
			state = systems[ lastToken ].toState(node);
		} else {
			state = toObject(node.state, { idPath: `${ idPath }/${ node.id }`, registry });
		}

		return {
			...Identity.ToObject(node),
			events: Identity.ToObject(node.events),
			state,
			shared: Object.entries(node.shared).reduce((acc, [ key, component ]) => {
				acc[ key ] = systems[ key ] && systems[ key ].toObject
					? systems[ key ].toObject(component)
					: toObject(component, { idPath: `${ idPath }/${ node.id }/${ key }`, registry });
				return acc;
			}, {})
		};
	}

	if(typeof value === "function") {
		return value.toString();
	}

	if(Array.isArray(value)) {
		return value.map((item, index) => toObject(item, { idPath: `${ idPath }/${ index }`, registry }));
	}

	if(value instanceof Map) {
		return Array.from(value.entries()).reduce((acc, [ key, item ]) => {
			acc[ key ] = toObject(item, { idPath: `${ idPath }/${ key }`, registry });
			return acc;
		}, {});
	}

	if(value instanceof Set) {
		return Array.from(value.values()).map((item, index) => toObject(item, { idPath: `${ idPath }/${ index }`, registry }));
	}

	if(typeof value === "object" && value !== null) {
		if(value.parent && value.children) {
			return {
				...value,
				parent: value.parent ? `@${ idPath }/${ value.parent.id }` : null,
				children: value.children.map(child => toObject(child, { idPath: `${ idPath }/${ child.id }`, registry }))
			};
		}

		return Object.entries(value).reduce((acc, [ key, item ]) => {
			acc[ key ] = toObject(item, { idPath: `${ idPath }/${ key }`, registry });
			return acc;
		}, {});
	}

	return value;
};
// export const toObject = (input = {}, { systems, depth = 0, forManifest = false } = {}) => {
// 	if(input instanceof Node) {
// 		if(depth > 0 && forManifest === true) {
// 			return `@${ input.id.toUpperCase() }`;
// 		}

// 		let shared = {};
// 		for(let [ component, state ] of Object.entries(input.shared)) {
// 			if(systems instanceof Map) {
// 				/* Assume that it is a Registry<ASystem>, check if entry contains .toObject (which would be treated as an override) */
// 				const system = systems.get(component);
// 				if(system && "toObject" in system) {
// 					shared[ component ] = system.toObject(input);
// 				} else {
// 					shared[ component ] = toObject(state, { systems, forManifest, depth: depth + 1 });
// 				}
// 			} else {
// 				shared[ component ] = toObject(state, { systems, forManifest, depth: depth + 1 });
// 			}
// 		}

// 		let state = {};
// 		if(systems instanceof Map) {
// 			/* Assume that it is a Registry<ASystem>, check if entry contains .toObject (which would be treated as an override) */
// 			for(let [ key, value ] of systems.entries()) {
// 				if(input.hasToken(key)) {
// 					state = value.$.toState(input, { systems, forManifest });
// 					break;
// 				}
// 			}
// 		} else {
// 			state = toObject(input.state, { systems, forManifest, depth: depth + 1 });
// 		}

// 		return {
// 			...input,
// 			events: input.events.toObject(),
// 			state,
// 			shared,
// 		};
// 	}

// 	const obj = {};
// 	for(let [ key, value ] of Object.entries(input)) {
// 		if(value === null) {
// 			obj[ key ] = null;
// 		} else if(value instanceof Node) {
// 			obj[ key ] = toObject(value, { systems, forManifest, depth: depth + 1 });
// 		} else if(typeof value === "function") {
// 			obj[ key ] = value.toString();
// 		} else if(value instanceof Set) {
// 			obj[ key ] = Array.from(value).map(toObject);
// 		} else if(typeof value === "object") {
// 			if(Array.isArray(value)) {
// 				if(key === "tokens") {
// 					obj[ key ] = value;
// 				} else {
// 					obj[ key ] = value.map(toObject);
// 				}
// 			} else if("toObject" in value) {
// 				obj[ key ] = value.toObject();
// 			} else {
// 				obj[ key ] = { ...value };
// 			}
// 		} else {
// 			obj[ key ] = value;
// 		}
// 	}

// 	return obj;
// };

export const toJSON = (input = {}, toObject = false) => {
	if(toObject === true) {
		return JSON.stringify(toObject(input));
	}

	return JSON.stringify(input);
};

export const fromObject = (input = {}, { systems, depth = 0 } = {}) => {
	//TODO: Implement this, it should be the inverse of toObject
};

export default {
	dispatch,
	toObject,
	toJSON,
	fromObject,
};