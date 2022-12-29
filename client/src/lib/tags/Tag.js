import { Identity } from "./../util/Identity";
import { Events } from "./../util/Events";

export const EnumTagType = {
	ANY: "any",
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
	OBJECT: "object",
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
	NAMESPACE: "namespace",
	GROUP: "group",
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
				/* This may initially seem pointless, but prevents things like TagBoolean from coercing null into false, etc. */
				return null;
			}

			return next;
		}

		return current;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
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

		this.events = new Events(events);

		let proxy = new Proxy(this, {
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

		proxy.next(value);

		return proxy;
	}

	addEncoder(encoder) {
		this.encoders.push(encoder);

		return this;
	}
	removeEncoder(encoder) {
		let index = this.encoders.indexOf(encoder);

		if(index > -1) {
			this.encoders.splice(index, 1);
		}

		return this;
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
			id: this.id,
			alias: this.alias,
			type: this.type,
			value: this.value,
		};

		if(verbose) {
			obj = {
				...obj,
				events: [ this.events.size, ...this.events.keys ],
				encoders: this.encoders.length,
				tokens: [ ...this.tokens ],
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
	toKVP(...props) {
		let obj = {};

		for(let prop of props) {
			obj[ prop ] = this[ prop ];
		}

		return obj;
	}
}

export default Tag;