import { Tag } from "./Tag.js";

export class TagGroup extends Tag {
	static Encoder = ({}, next) => {
		if(next instanceof Tag) {
			return [ next ];
		} else if(!Array.isArray(next)) {
			return [];
		}

		return next.filter(item => item instanceof Tag);
	};

	constructor (value = [], { reducers = [], ...rest } = {}) {
		super({
			type: Tag.Type.GROUP,

			...rest
		});

		this.addReducer(TagGroup.Encoder);
		this.addReducers(...reducers);

		this.state = value;
	}
}

export default TagGroup;