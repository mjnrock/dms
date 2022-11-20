import { v4 as uuid, validate } from "uuid";

/**
 * The `Identity` is meant to act a unique ancestor for an object, and it contains
 * both a UUID and optional tags to facilitate this end.  As the `Identity` is
 * meant to be the single source of truth for tracking, all related tracking is
 * done at the static level (though it is disabled by default).
 */
export class Identity {
	/**
	 * This registry will work *similarly* to flyweight version of `util\Registry`,
	 * using the identity's ID as the key.  If tags are present **upon instantiation**
	 * then the identity's ID will be registered under those tags, as well.
	 * 
	 * NOTE: This Registry must be maintained manually, though it has a working baseline in `.deconstructor()`
	 */
	static Registry = new Map();

	/**
	 * Enable/disable tracking for **all** descendants of this class.
	 */
	static EnableTracking = false;
	/**
	 * A static middleware to run when an Identity has been fully registered.
	 */
	static Tracker = (self) => void 0;

	static Comparators = {
		/**
		 * Single-comparison evaluators
		 */
		IsUndefined(input) {
			return input === void 0;
		},
		IsNull(input) {
			return input === null;
		},
		IsDefined(input) {
			return input != null;
		},
		IsBoolean(input) {
			return typeof input === "boolean";
		},
		IsNumber(input) {
			return typeof input === "number";
		},
		IsNumeric(input) {
			return !isNaN(parseFloat(input));
		},
		IsString(input) {
			return typeof input === "string" || input instanceof String;
		},
		IsSymbol(input) {
			return typeof input === "symbol";
		},
		IsSet(input) {
			return input instanceof Set;
		},
		IsMap(input) {
			return input instanceof Map;
		},
		IsArray(input) {
			return Array.isArray(input);
		},
		IsObject(input) {
			return input != null && typeof input === "object";
		},
		IsStrictObject(input) {
			return Object.getPrototypeOf(input) === Object.prototype;
		},
		IsFunction(input) {
			return typeof input === "function";
		},
		IsDate(input) {
			return input instanceof Date;
		},
		IsRegExp(input) {
			return input instanceof RegExp;
		},
		IsPromise(input) {
			return input instanceof Promise;
		},
		IsIterable(input) {
			return input != null && typeof input[ Symbol.iterator ] === "function";
		},
		IsUUID(input) {
			return validate(input);
		},
		IsIdentity(input) {
			return input instanceof Identity;
		},
		IsHierarchy(input) {
			if(Identity.Comparators.IsArray(input)) {
				return input.every(row => {
					return Identity.Comparators.IsArray(row) && row.length === 4	//NOTE: [ id, tags, data, children ]
						&& Identity.Comparators.IsNumeric(row[ 0 ])
						&& (Identity.Comparators.IsNumeric(row[ 1 ]) || Identity.Comparators.IsNull(row[ 1 ]));
				});
			}

			return false;
		},
		IsClass(input) {
			return input.toString().substring(0, 5) === "class";
		},
		IsInstance(input) {
			if(typeof input !== "object") {
				return false;
			}

			return input instanceof input.constructor;
		},
		/**
		 * This is meant as a broader "instanceof" checker,
		 * allowing either @clazz instances and/or Objects that
		 * have an @keys-defined shape (i.e. duck typing).
		 */
		Conforms(input, { keys = [], clazz } = {}) {
			if(!Identity.Comparators.IsObject(input)) {
				return false;
			}

			if(clazz && input instanceof clazz) {
				return true;
			}

			return keys.every(key => key in input);
		},

		/**
		 * Complex comparators
		 */
		IsStringOrSymbol(input) {
			return Identity.Comparators.IsString(input) || Identity.Comparators.IsSymbol(input);
		},
		IsArrayOrSet(input) {
			return Identity.Comparators.IsArray(input) || Identity.Comparators.IsSet(input);
		},

		HasTag(input, tag) {
			return input.tags.has(tag);
		},
		HasTags(input, ...tags) {
			return tags.every(tag => input.tags.has(tag));
		},
	};

	constructor ({ id, tags = [] } = {}) {
		this.id = id || uuid();
		this.tags = new Set(tags);

		/**
		 * If tracking is enabled, register:
		 * 	1) The identity itself as { id: self }
		 * 	2) The identity's tags as { tag: Set<id> }
		 */
		if(Identity.EnableTracking) {
			Identity.Registry.set(this.id, this);

			for(let tag of tags) {
				let set = Identity.Registry.get(tag) || new Set();

				set.add(this.id);

				Identity.Registry.set(tag, set);
			}

			Identity.Tracker(this);
		}
	}

	deconstructor() {
		Identity.Registry.delete(this.id);

		for(let tag of this.tags) {
			let set = Identity.Registry.get(tag) || new Set();

			set.delete(this.id);

			Identity.Registry.set(tag, set);
		}
	}

	hasTag(...tags) {
		return tags.every(tag => this.tags.has(tag));
	}

	toObject() {
		return {
			id: this.id,
			tags: Array.from(this.tags),
		};
	}
	toString() {
		return JSON.stringify(this.toObject());
	}
};

export default Identity;