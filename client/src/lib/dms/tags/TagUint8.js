import { Tag } from "./Tag.js";

export class TagUint8 extends Tag {
	static MIN_VALUE = 0;
	static MAX_VALUE = 255;

	static Encoder = (prev, next, ...args) => {
		let value = parseInt(next);

		if(isNaN(value)) {
			return prev;
		} else if(value < TagUint8.MIN_VALUE) {
			return TagUint8.MIN_VALUE;
		} else if(value > TagUint8.MAX_VALUE) {
			return TagUint8.MAX_VALUE;
		}
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.UINT8,
			reducers: [ TagUint8.Encoder ],

			...rest
		});

		this.state = value;
	}
}

export default TagUint8;