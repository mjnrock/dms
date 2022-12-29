import { Tag } from "./Tag";

export class TagBoolean extends Tag {
	static Encoder = ({ }, next) => {
		return !!next;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.BOOLEAN,
			encoders: [ TagBoolean.Encoder ],

			...rest
		});

		this.next(value);
	}
}

export default TagBoolean;