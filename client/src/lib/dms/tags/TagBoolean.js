import { Tag } from "./Tag.js";

export class TagBoolean extends Tag {
	static Encoder = (prev, next, ...args) => {
		return !!next;
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.BOOLEAN,
			reducers: [ TagBoolean.Encoder ],

			...rest
		});

		this.state = value;
	}
}

export default TagBoolean;