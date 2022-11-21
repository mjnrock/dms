import { Tag } from "./Tag.js";

export class TagString extends Tag {
	static Encoder = (prev, next, ...args) => {
		if(next != null) {
			return next.toString();
		}

		return prev;
	};

	constructor (value = [], { reducers = [], ...rest } = {}) {
		super({
			type: Tag.Type.STRING,

			...rest
		});

		this.addReducer(TagString.Encoder);
		this.addReducers(...reducers);

		this.state = value;
	}
}

export default TagString;