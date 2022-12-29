import { Identity } from "./../util/Identity";
import { Events } from "./../util/Events";

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

export class Tag extends Identity {
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

	/**
	 * @id {string} - The unique identifier for this tag.
	 * @tags {Tag} - The (categorical) tags that search can leverage.
	 */
	constructor ({ alias, type, value, encoders = [], events, ...rest } = {}) {
		super({ ...rest });

		this.type = type || Tag.Type.ANY;

		this.alias = alias;

		/**
		 * Allow a Tag's value to be controlled by reducers, but also
		 * allow for direct assignment.
		 */
		this.encoders = [ Tag.Encoder, ...encoders ];
		this.value = value;

		this.events = new Events(events);

		return new Proxy(this, {
			set: (target, prop, value) => {
				let current = target[ prop ];

				if(current !== value) {
					target[ prop ] = value;

					target.events.emit("update", {
						prop,
						previous: current,
						current: value,
					});
				}

				return true;
			}
		});
	}

	next(value) {
		let previous = this.value;

		for(let reducer of this.encoders) {
			value = reducer(this, value);
		}

		this.value = value;

		return {
			previous,
			current: value,
		};
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
				reducers: this.encoders.length,
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