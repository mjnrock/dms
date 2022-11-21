import { Tag } from "./Tag.js";

export class TagArray extends Tag {
	static Encoder = (prev, next, ...args) => {
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

		this.addReducer(TagArray.Encoder);
		this.addReducers(...reducers);

		this.state = value;
	}
}

export default TagArray;