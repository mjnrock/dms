import { Tag } from "./Tag.js";

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
		tag.removeReducer(this.Encoder);
	};

	constructor (value, { reducers = [], ...rest } = {}) {
		super({
			dtype: Tag.Type.INT8,

			...rest
		});

		this.addReducer(TagInt8.Encoder);
		this.addReducers(...reducers);

		this.update(value);
	}
}

export default TagInt8;