import { Tag } from "./Tag";

export class TagArray extends Tag {
	static Encoder = ({ current }, next) => {
		if(Array.isArray(next)) {
			return next;
		}

		return current;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value = [], { ...rest } = {}) {
		super({
			type: Tag.Type.ARRAY,
			encoders: [ TagArray.Encoder ],

			...rest
		});

		this.next(value);
	}
}

export default TagArray;