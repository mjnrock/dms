import { Tag } from "./Tag";

export class TagFloat32 extends Tag {
	static MIN_VALUE = -3.4028234663852886e+38;
	static MAX_VALUE = 3.4028234663852886e+38;

	static Encoder = ({ current }, next) => {
		let value = parseFloat(next);

		if(isNaN(value)) {
			return current;
		} else if(value < TagFloat32.MIN_VALUE) {
			return TagFloat32.MIN_VALUE;
		} else if(value > TagFloat32.MAX_VALUE) {
			return TagFloat32.MAX_VALUE;
		}

		return value;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.FLOAT32,
			encoders: [ TagFloat32.Encoder ],

			...rest,
		});

		this.next(value);
	}
}

export default TagFloat32;