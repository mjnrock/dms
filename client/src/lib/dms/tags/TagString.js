import { Tag } from "./Tag.js";

export class TagString extends Tag {
	static Encoder = (prev, next, ...args) => {
		if(next !== void 0) {
			return next.toString();
		}

		return prev;
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.STRING,
			reducers: [ TagString.Encoder ],

			...rest
		});

		this.state = value;
	}
}

export default TagString;