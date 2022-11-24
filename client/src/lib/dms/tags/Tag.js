import { Node } from "./../Node.js";

export const EnumTagType = {
	ANY: "any",
	GROUP: "group",
	BOOLEAN: "boolean",
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
	// ARRAY: "array",
	// OBJECT: "object",
	// DATE: "date",
	// TIME: "time",
	// DATETIME: "datetime",
	// ENUM: "enum",
	// LIST: "list",
	// MAP: "map",
	// REFERENCE: "reference",
	// FUNCTION: "function",
};

export const EnumResponseType = {
	INVALID_VALUE: "10af8701-8a02-4580-a6d5-f45ed27093f9",
};

/**
 * A `Tag` is a specialized type of `Node` that is used to represent schematized data.
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
	 * These are meant to be "standard reducers" for a given type of tag.  If
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

	static Type = EnumTagType;

	constructor ({ type, value, ...rest } = {}) {
		super({
			type: type || Tag.Type.ANY,
			state: value,

			...rest,
		});

		/**
		 * Does not allow for assignment of `undefined`.
		 */
		this.addReducer(Tag.Encoder);

		return new Proxy(this, {
			set: (target, prop, value, receiver) => {
				if(prop === "state") {
					let result = target.update(value);

					target[ prop ] = result;

					return true;
				}

				return Reflect.set(target, prop, value, receiver);
			}
		});
	}

	get value() {
		return this.state;
	}
	set value(value) {
		console.log(9998, value)
		this.state = value;
		console.log(9999, this.state)
	}

	toObject(verbose = false) {
		if(verbose) {
			return {
				id: this.id,

				...this.toObject(false),

				events: [ this.events.size, ...this.events.keys ],
				reducers: this.reducers.length,
				meta: this.meta,
			};
		}

		return {
			type: this.type,
			value: this.state,
		};
	}
	toJson(verbose = false) {
		return JSON.stringify(this.toObject(verbose));
	}
}

export default Tag;