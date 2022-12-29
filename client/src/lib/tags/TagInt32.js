import { Tag } from "./Tag";

export class TagInt32 extends Tag {
	static MIN_VALUE = -2147483648;
	static MAX_VALUE = 2147483647;

	static Encoder = ({ current }, next) => {
		let value = parseInt(next);

		if(isNaN(value)) {
			return current;
		} else if(value < TagInt32.MIN_VALUE) {
			return TagInt32.MIN_VALUE;
		} else if(value > TagInt32.MAX_VALUE) {
			return TagInt32.MAX_VALUE;
		}

		return value;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.INT32,
			encoders: [ TagInt32.Encoder ],

			...rest,
		});

		this.next(value);
	}
}

export default TagInt32;