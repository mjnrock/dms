import { Tag } from "./Tag";

export class TagObject extends Tag {
	static Encoder = ({ current }, next) => {
		if(typeof next === "object" && next !== null) {
			return next;
		}

		return current;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value = [], { ...rest } = {}) {
		super({
			type: Tag.Type.OBJECT,
			encoders: [ TagObject.Encoder ],
			...rest
		});

		this.next(value);
	}
}

export default TagObject;