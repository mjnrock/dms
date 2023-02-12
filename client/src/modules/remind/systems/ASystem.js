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
export const toObject = (input = {}, { systems, depth = 0, forManifest = false } = {}) => {
	if(input instanceof Node) {
		if(depth > 0 && forManifest === true) {
			return `@${ input.id.toUpperCase() }`;
		}

		let shared = {};
		for(let [ component, state ] of Object.entries(input.shared)) {
			if(systems instanceof Map) {
				/* Assume that it is a Registry<ASystem>, check if entry contains .toObject (which would be treated as an override) */
				const system = systems.get(component);
				if(system && "toObject" in system) {
					shared[ component ] = system.toObject(input);
				} else {
					shared[ component ] = toObject(state, { systems, forManifest, depth: depth + 1 });
				}
			} else {
				shared[ component ] = toObject(state, { systems, forManifest, depth: depth + 1 });
			}
		}

		let state = {};
		if(systems instanceof Map) {
			/* Assume that it is a Registry<ASystem>, check if entry contains .toObject (which would be treated as an override) */
			for(let [ key, value ] of systems.entries()) {
				if(input.hasToken(key)) {
					state = value.$.toState(input, { systems, forManifest });
					break;
				}
			}
		} else {
			state = toObject(input.state, { systems, forManifest, depth: depth + 1 });
		}

		return {
			...input,
			events: input.events.toObject(),
			state,
			shared,
		};
	}

	const obj = {};
	for(let [ key, value ] of Object.entries(input)) {
		if(value === null) {
			obj[ key ] = null;
		} else if(value instanceof Node) {
			obj[ key ] = toObject(value, { systems, forManifest, depth: depth + 1 });
		} else if(typeof value === "function") {
			obj[ key ] = value.toString();
		} else if(value instanceof Set) {
			obj[ key ] = Array.from(value).map(toObject);
		} else if(typeof value === "object") {
			if(Array.isArray(value)) {
				if(key === "tokens") {
					obj[ key ] = value;
				} else {
					obj[ key ] = value.map(toObject);
				}
			} else if("toObject" in value) {
				obj[ key ] = value.toObject();
			} else {
				obj[ key ] = { ...value };
			}
		} else {
			obj[ key ] = value;
		}
	}

	return obj;
};

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