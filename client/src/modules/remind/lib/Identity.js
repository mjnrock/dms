import { v4 as uuid, validate } from "uuid";

/**
 * !IMPORTANT: This version has "tokens" instead of "tags"
 * 
 * The `Identity` is meant to act a unique ancestor for an object, and it contains
 * both a UUID and optional tokens to facilitate this end.  As the `Identity` is
 * meant to be the single source of truth for tracking, all related tracking is
 * done at the static level * 
 */
export class Identity {
	/**
	 * This registry will work *similarly* to flyweight version of `util\Registry`,
	 * using the identity's ID as the key.  If tokens are present **upon instantiation**
	 * then the identity's ID will be registered under those tokens, as well.
	 * 
	 * NOTE: This Registry must be maintained manually, though it has a working baseline in `.deconstructor()`
	 */
	static Registry = new Map();

	/**
	 * Enable/disable tracking for **all** descendants of this class.
	 */
	static EnableTracking = true;
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
					return Identity.Comparators.IsArray(row) && row.length === 4	//NOTE: [ id, tokens, data, children ]
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

		HasToken(input, token) {
			return input.tokens.has(token);
		},
		HasTokens(input, ...tokens) {
			return tokens.every(token => input.tokens.has(token));
		},
	};

	constructor ({ id, tokens = [] } = {}) {
		this.id = id || uuid();
		this.tokens = new Set(tokens);

		/**
		 * If tracking is enabled, register:
		 * 	1) The identity itself as { id: self }
		 * 	2) The identity's tokens as { token: Set<id> }
		 */
		if(Identity.EnableTracking) {
			Identity.Registry.set(this.id, this);

			for(let token of tokens) {
				let set = Identity.Registry.get(token) || new Set();

				set.add(this.id);

				Identity.Registry.set(token, set);
			}

			Identity.Tracker(this);
		}

		this.tokens.add(`@${ this.id }`);
		this.tokens.add(`@remind:identity`);
	}

	deconstructor() {
		Identity.Registry.delete(this.id);

		for(let token of this.tokens) {
			let set = Identity.Registry.get(token) || new Set();

			set.delete(this.id);

			Identity.Registry.set(token, set);
		}
	}

	hasToken(...tokens) {
		return tokens.every(token => this.tokens.has(token));
	}
	hasAnyToken(...tokens) {
		return tokens.some(token => this.tokens.has(token));
	}

	toObject() {
		return {
			id: this.id,
			tokens: Array.from(this.tokens),
		};
	}
	toString() {
		return JSON.stringify(this.toObject());
	}
};

export default Identity;