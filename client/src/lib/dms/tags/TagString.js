import { Tag } from "./Tag.js";

export class TagString extends Tag {
	static Encoder = ({ current }, next) => {
		if(next != null) {
			return next.toString();
		}

		return current;
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