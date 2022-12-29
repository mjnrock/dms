import { Tag } from "./Tag";

export class TagString extends Tag {
	static Encoder = ({ }, next) => {
		if(typeof next === "string") {
			return next;
		} else if(typeof next === "number") {
			return next.toString();
		} else if(typeof next === "boolean") {
			return next.toString();
		}

		return (next || "").toString();
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super({
			type: Tag.Type.STRING,
			encoders: [ TagString.Encoder ],

			...rest
		});

		this.next(value);
	}
}

export default TagString;