import { Tag } from "./Tag";

export class TagUint32 extends Tag {
	static MIN_VALUE = 0;
	static MAX_VALUE = 4294967295;

	static Encoder = ({ current }, next) => {
		let value = parseInt(next);

		if(isNaN(value)) {
			return current;
		} else if(value < TagUint32.MIN_VALUE) {
			return TagUint32.MIN_VALUE;
		} else if(value > TagUint32.MAX_VALUE) {
			return TagUint32.MAX_VALUE;
		}

		return value;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.UINT32,
			encoders: [ TagUint32.Encoder ],

			...rest,
		});

		this.next(value);
	}
}

export default TagUint32;