import { Tag } from "../Tag";
import { TagCompound } from "../TagCompound";

export class TagGroup extends TagCompound {
	static Encoder = ({ current }, next) => {
		if(next instanceof Tag) {
			return [ next ];
		} else if(!Array.isArray(next)) {
			return [];
		}

		return next.filter(item => item instanceof Tag);
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value = [], { ...rest } = {}) {
		super(value, {
			type: Tag.Type.GROUP,
			encoders: [ TagGroup.Encoder ],

			...rest
		});

		this.next(value);
	}
}

export default TagGroup;