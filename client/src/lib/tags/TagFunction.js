import { Tag } from "./Tag";

export class TagFunction extends Tag {
	static Encoder = ({ current }, next) => {
		if(typeof next === "function") {
			return next;
		}

		return current;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value = [], { ...rest } = {}) {
		super({
			type: Tag.Type.FUNCTION,
			encoders: [ TagFunction.Encoder ],
			...rest
		});

		this.next(value);
	}

	run(...args) {
		return this.value(...args);
	}

	toObject() {
		let obj = super.toObject();

		obj.value = this.value.toString();

		return obj;
	}
	toKVP(...props) {
		let obj = {};

		for(let prop of props) {
			if(prop === "value") {
				obj[ prop ] = this[ prop ].toString();
			} else {
				obj[ prop ] = this[ prop ];
			}
		}

		return obj;
	}

	/**
	 * A convenience function to deserialize a function from a string,
	 * after it has been serialized with toObject or similar, so that
	 * it will restore properly.
	 */
	static DeserializeFunction(obj, ...args) {
		let fn = new Function("return " + obj.value)();

		if(args.length > 0) {
			fn = fn(...args);
		}

		return fn;
	}
}

export default TagFunction;