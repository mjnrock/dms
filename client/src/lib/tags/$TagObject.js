import { Tag } from "./Tag";
import { TagGroup } from "./TagGroup";

export class TagArray extends TagGroup {
	constructor (value = [], { reducers = [], ...rest } = {}) {
		super(value, {
			...rest
		});

		this.dtype = Tag.Type.ARRAY;

		this.addReducer(TagArray.Encoder);
		this.addReducers(...reducers);
	}
}

export default TagArray;