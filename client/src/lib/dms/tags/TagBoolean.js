import { Tag } from "./Tag.js";

export class TagBoolean extends Tag {
	static Encoder = ({}, next) => {
		return !!next;
	};
	static RemoveEncoder = (tag) => {
		tag.removeReducer(this.Encoder);
	};

	constructor (value, { reducers = [], ...rest } = {}) {
		super({
			type: Tag.Type.BOOLEAN,

			...rest
		});

		this.addReducer(TagBoolean.Encoder);
		this.addReducers(...reducers);

		this.update(value);
	}
}

export default TagBoolean;