import { Tag } from "./Tag.js";

export class TagBoolean extends Tag {
	static Encoder = ({ }, next) => {
		return !!next;
	};
	static RemoveEncoder = (tag) => {
		tag.removeReducer(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.BOOLEAN,
			encoders: [ TagBoolean.Encoder ],
			value,

			...rest
		});
	}
}

export default TagBoolean;