import { Tag } from "./Tag.js";

export class TagGroup extends Tag {
	static Encoder = (prev, next, ...args) => {
		if(next instanceof Tag) {
			return [ next ];
		} else if(!Array.isArray(next)) {
			return [];
		}

		return next.filter(item => item instanceof Tag);
	};

	constructor (value = [], { ...rest } = {}) {
		super({
			type: Tag.Type.BOOLEAN,
			reducers: [ TagGroup.Encoder ],

			...rest
		});

		this.state = value;
	}
}

export default TagGroup;