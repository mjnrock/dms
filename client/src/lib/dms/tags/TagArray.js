import { Tag } from "./Tag.js";
import { TagGroup } from "./TagGroup.js";

export class TagArray extends TagGroup {
	static Encoder = ({ }, next) => {
		if(next instanceof Tag) {
			return [ next ];
		} else if(!Array.isArray(next)) {
			return [];
		}

		return next.filter(item => item instanceof Tag);
	};

	constructor (value = [], { reducers = [], ...rest } = {}) {
		super({
			type: Tag.Type.ARRAY,

			...rest
		});

		this.addReducer(TagArray.Encoder);
		this.addReducers(...reducers);

		this.state = value;
	}
}

export default TagArray;