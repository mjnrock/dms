import { Tag } from "./Tag";
import { TagString } from "./TagString";

export class TagCharacter extends TagString {
	static Encoder = ({ current }, next) => {
		if(typeof next === "string") {
			return next[ 0 ];
		}

		return current;
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value, { ...rest } = {}) {
		super(value, {
			type: Tag.Type.CHARACTER,
			encoders: [ TagCharacter.Encoder ],

			...rest
		});

		this.next(value);
	}
}

export default TagCharacter;