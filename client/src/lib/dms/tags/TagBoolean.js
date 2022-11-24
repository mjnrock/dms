import { Tag } from "./Tag.js";

export class TagBoolean extends Tag {
	static Encoder = ({}, next) => {
		return !!next;
	};

	constructor (value = [], { reducers = [], ...rest } = {}) {
		super({
			type: Tag.Type.BOOLEAN,

			...rest
		});

		this.addReducer(TagBoolean.Encoder);
		this.addReducers(...reducers);

		this.state = value;
	}
}

export default TagBoolean;