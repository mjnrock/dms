import { Tag } from "./Tag.js";

export class TagInt8 extends Tag {
	static MIN_VALUE = -128;
	static MAX_VALUE = 127;

	static Encoder = (prev, next, ...args) => {
		let value = parseInt(next);

		if(isNaN(value)) {
			return prev;
		} else if(value < TagInt8.MIN_VALUE) {
			return TagInt8.MIN_VALUE;
		} else if(value > TagInt8.MAX_VALUE) {
			return TagInt8.MAX_VALUE;
		}
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.INT8,
			reducers: [ TagInt8.Encoder ],

			...rest
		});

		this.state = value;
	}
}

export default TagInt8;