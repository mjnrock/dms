import { Tag } from "./Tag";

export class TagUint16 extends Tag {
	static MIN_VALUE = 0;
	static MAX_VALUE = 65535;

	static Encoder = ({ current }, next) => {
		let value = parseInt(next);

		if(isNaN(value)) {
			return current;
		} else if(value < TagUint16.MIN_VALUE) {
			return TagUint16.MIN_VALUE;
		} else if(value > TagUint16.MAX_VALUE) {
			return TagUint16.MAX_VALUE;
		}

		return value;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.UINT16,
			encoders: [ TagUint16.Encoder ],

			...rest,
		});

		this.next(value);
	}
}

export default TagUint16;