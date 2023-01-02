import { Tag } from "./Tag";

export class TagAny extends Tag {
	static Encoder = ({ }, next) => {
		return next;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.ANY,
			encoders: [ TagAny.Encoder ],

			...rest
		});

		this.next(value);
	}
}

export default TagAny;