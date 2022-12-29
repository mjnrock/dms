import { Tag } from "./Tag";

export class TagUint8 extends Tag {
	static MIN_VALUE = 0;
	static MAX_VALUE = 255;

	static Encoder = ({ current }, next) => {
		let value = parseInt(next);

		if(isNaN(value)) {
			return current;
		} else if(value < TagUint8.MIN_VALUE) {
			return TagUint8.MIN_VALUE;
		} else if(value > TagUint8.MAX_VALUE) {
			return TagUint8.MAX_VALUE;
		}

		return value;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.UINT8,
			encoders: [ TagUint8.Encoder ],

			...rest,
		});

		this.next(value);
	}
}

export default TagUint8;