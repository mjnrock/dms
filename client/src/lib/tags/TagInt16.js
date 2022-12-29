import { Tag } from "./Tag";

export class TagInt16 extends Tag {
	static MIN_VALUE = -32768;
	static MAX_VALUE = 32767;

	static Encoder = ({ current }, next) => {
		let value = parseInt(next);

		if(isNaN(value)) {
			return current;
		} else if(value < TagInt16.MIN_VALUE) {
			return TagInt16.MIN_VALUE;
		} else if(value > TagInt16.MAX_VALUE) {
			return TagInt16.MAX_VALUE;
		}

		return value;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.INT16,
			encoders: [ TagInt16.Encoder ],

			...rest,
		});

		this.next(value);
	}
}

export default TagInt16;