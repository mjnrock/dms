import { Node } from "./../Node.js";

export const EnumTagType = {
	ANY: "any",
	NAMESPACE: "namespace",
	GROUP: "group",
	BOOLEAN: "bool",
	UINT8: "uint8",
	// UINT16: "uint16",
	// UINT32: "uint32",
	// UINT64: "uint64",
	INT8: "int8",
	// INT16: "int16",
	// INT32: "int32",
	// INT64: "int64",
	// FLOAT32: "float32",
	// FLOAT64: "float64",
	STRING: "string",
	CHARACTER: "char",
	ARRAY: "array",
	// OBJECT: "object",
	// DATE: "date",
	// TIME: "time",
	// DATETIME: "datetime",
	// ENUM: "enum",
	// LIST: "list",
	// MAP: "map",
	// REFERENCE: "reference",
	// FUNCTION: "function",
	// GEOLOCATION: "geolocation",	// lat, long, alt, acc
	// UUID: "uuid",
	SCHEMA: "schema",
};

export function ReverseEnumTagType(value) {
	for(let key in EnumTagType) {
		if(EnumTagType[ key ] === value) {
			return key;
		}
	}

	return EnumTagType.ANY;
}

export const EnumResponseType = {
	INVALID_VALUE: "10af8701-8a02-4580-a6d5-f45ed27093f9",
};

/**
 * A `Tag` is a specialized dtype of `Node` that is used to represent schematized data.
 * You should think of these in similar terms to the NBT tags in Minecraft, but with
 * the underlying capabilities of a `Node`, when needed in data scenarios with complex
 * data structures or interactions.
 */
export class Tag extends Node {
	/**
	 * As a general paradigm, an `Encoder` is a function that takes the previous
	 * value, the next value, and any additional arguments and returns a value
	 * that is to be used as the next value.
	 * 
	 * These are meant to be "standard reducers" for a given dtype of tag.  If
	 * you do not want a standard reducer to be present, you must manually empty
	 * the `reducers` array, as *all* Tag instances have a default reducer that
	 * gets attach upon instantiation.
	 */
	static Encoder = ({ current }, next) => {
		if(next !== void 0) {
			if(next === null) {
				return null;
			}
			return next;
		}

		return current;
	};
	static RemoveEncoder = (tag) => {
		tag.removeReducer(this.Encoder);
	};

	static Type = EnumTagType;

	constructor ({ dtype, alias, value, ...rest } = {}) {
		super({
			type: "tag",
			state: value,

			...rest,
		});

		this.dtype = dtype || Tag.Type.ANY;

		if(alias === true) {
			this.alias = this.id;
		} else {
			this.alias = alias;
		}

		/**
		 * Does not allow for assignment of `undefined`.
		 */
		this.addReducer(Tag.Encoder);

		/**
		 * Attach a listener to the `update` event, and fire a 'modify' event for "state"
		 */
		this.events.add("update", ({ module, current, previous } = {}) => this.emit("modify", { prop: "state", current, previous }));

		return new Proxy(this, {
			set: (target, prop, value, receiver) => {
				let oldValue = target[ prop ],
					result = value;

				if(prop === "state") {
					result = target.update(value);
				}

				target.emit("modify", { prop, current: value, previous: oldValue });

				return Reflect.set(target, prop, result, receiver);
			}
		});
	}

	get value() {
		return this.state;
	}
	set value(value) {
		this.state = value;
	}

	toObject(verbose = false) {
		let obj = {
			dtype: this.dtype,
			value: this.state,
			alias: this.alias,
		};

		if(verbose) {
			obj = {
				id: this.id,
				...obj,				
				events: [ this.events.size, ...this.events.keys ],
				reducers: this.reducers.length,
				meta: this.meta,
			};
		}

		return obj;
	}
	toJson(verbose = false) {
		return JSON.stringify(this.toObject(verbose));
	}
	toString(verbose = false) {
		return this.toJson(verbose);
	}

	modify(prop, value) {
		this[ prop ] = value;

		return this;
	}
}

export default Tag;