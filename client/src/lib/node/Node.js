import Identity from "./../../util/Identity";
import Events from "./../../util/relay/Events";

export const EnumType = {
	DATA: "data",
	ROUTER: "router",

	GROUP: "group",
	BOOLEAN: "boolean",
	NUMBER: "number",
	TEXT: "text",
	OBJECT: "object",
	ARRAY: "array",

	ENUM: "enum",
	FUNCTION: "function",
	CLASS: "class",

	/**
	 * This is for the an "inverted enum" where the value is the key and the key
	 * is the value.
	 */
	$reverse: new Map(),

	/**
	 * This maps types to classes -- maybe do factories instead?
	 */
	$classes: {},
};

for(let [ key, value ] of Object.entries(EnumType)) {
	EnumType.$reverse.set(key, value);
	EnumType.$classes[ key ] = value;	//STUB: replace with fn map (hyper-parameter or -function)
}

export class Node extends Identity {
	/**
	 * Create a list of well-known UUIDs, for use in flagging result errors or warnings.
	 */
	static Error = {
		Unspecified: `1461EDE9-6172-4DD3-A27A-7AD5762C8A53`,
	};

	/**
	 * Attach the EnumType to the class, as a convenience accessor.
	 */
	static EnumType = EnumType;

	/**
	 * The terminal value is the result after all encoders have been serially applied.
	 */
	static Encoder = (self, value, ...args) => {
		if(value !== void 0) {
			let result = value;

			for(let encoder of self.meta.encoder) {
				result = encoder(result, ...args);
			}


			return result;
		}

		return void 0;
	};
	/**
	 * The terminal value is the result after all decoders have been serially applied.
	 */
	static Decoder = (self, value, ...args) => {
		if(value !== void 0) {
			let result = value;

			for(let decoder of self.meta.decoder) {
				result = decoder(result, ...args);
			}

			return result;
		}

		return value;
	};

	constructor ({ type, data, events = {}, alias, id, tags, encoder = [], decoder = [], ...meta } = {}) {
		super({ id, tags });

		/**
		 * A unique identifier for the type of node, exhaustively defined by the
		 * EnumType object (also accessible via the static property of the same).
		 */
		this.type = type || EnumType.DATA;

		/**
		 * A collection of events that can be triggered by the node.  To create attachments
		 * to the node, create a new event and attach a listener to it.
		 */
		this.events = new Events(events);

		/**
		 * A collection of metadata associated with the node.  All entries in this
		 * object are use-case specific.
		 */
		this.meta = {
			...meta,

			/**
			 * If a key or name is associated with the node, it is stored here.
			 */
			alias,

			/**
			 * The encoder is responsible for the "logical" encoding of the node's
			 * data.  This is used to convert the data into a format that is consistent
			 * with the node's type (e.g. Int8:Number, or Email:String).
			 * 
			 * As this result is stored, the encoder should enforce any constraints.
			 */
			encoder: typeof encoder === "function" ? [ encoder ] : encoder,

			/**
			 * The decoder is responsible for the "logical" decoding of the node's
			 * data.  This is used to convert the raw data into a format that is consistent
			 * with the node's type (e.g. Int8:Number, or Email:String).
			 */
			decoder: typeof decoder === "function" ? [ decoder ] : decoder,

			/**
			 * The timestamp of creation of the node.
			 */
			timestamp: Date.now(),
		};

		/**
		 * Create the proxy before populating data, so that the proxy can be
		 * hooked by encoder.
		 */
		const proxy = new Proxy(this, {
			get: (target, key) => {
				let value = target[ key ];

				/**
				 * If fetching data, invoke the decoder.
				 */
				if(key === "data") {
					return target.constructor.Decoder(target, value);
				}

				return value;
			},
			set: (target, key, value) => {
				/**
				 * If assigning data, invoke the encoder.
				 */
				if(key === "data") {
					target[ key ] = target.constructor.Encoder(target, value, target[ key ]);

					return true;
				}

				return Reflect.set(target, key, value);
			},
		});

		/**
		 * The data associated with the node. The type of data is determined by the
		 * type of node.
		 */
		proxy.data = data;

		return proxy;
	}

	emit(event, ...args) {
		return this.events.emit(event, ...args);
	}
	get dispatch() {
		return this.emit;
	}

	toObject(verbose = false) {
		let obj = {};

		for(let [ key, value ] of Object.entries(this)) {
			if(verbose) {
				obj[ key ] = value;
			} else {
				if(!!value) {
					obj[ key ] = value;
				}
			}
		}

		if(this.data instanceof Set) {
			obj.data = Array.from(this.data).map(item => item instanceof Node ? item.toObject() : item);
		}

		return obj;
	}
	toString() {
		return JSON.stringify(this.toObject());
	}
	toSchema(exclude = [ "id" ]) {
		let obj = {};

		for(let [ key, value ] of Object.entries(this)) {
			if(!exclude.includes(key)) {
				if(typeof value !== "object") {
					obj[ key ] = value;
				}
			}
		}

		if(this.meta.alias) {
			obj.alias = this.meta.alias;
		}

		if(this.data instanceof Set) {
			obj.data = Array.from(this.data).map(item => item instanceof Node ? item.toSchema() : item);
		}

		return obj;
	}
};

export default Node;