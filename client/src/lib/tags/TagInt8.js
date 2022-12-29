import { Tag } from "./Tag";

export class TagInt8 extends Tag {
	static MIN_VALUE = -128;
	static MAX_VALUE = 127;

	static Encoder = ({ current }, next) => {
		let value = parseInt(next);

		if(isNaN(value)) {
			return current;
		} else if(value < TagInt8.MIN_VALUE) {
			return TagInt8.MIN_VALUE;
		} else if(value > TagInt8.MAX_VALUE) {
			return TagInt8.MAX_VALUE;
		}

		return value;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.INT8,
			encoders: [ TagInt8.Encoder ],

			...rest,
		});

		this.next(value);
	}
}

export default TagInt8;