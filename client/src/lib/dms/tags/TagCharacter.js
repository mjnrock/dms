import { Tag } from "./Tag";

export class TagCharacter extends Tag {
	static Encoder = ({ current }, next) => {
		if(next != null) {
			return next.toString()[ 0 ];
		}

		return current[ 0 ];
	};
	static RemoveEncoder = (tag) => {
		tag.removeReducer(this.Encoder);
	};

	constructor (value, { reducers = [], ...rest } = {}) {
		super({			
			dtype: Tag.Type.CHARACTER,

			...rest
		});

		this.addReducer(TagCharacter.Encoder);
		this.addReducers(...reducers);

		this.update(value);
	}
}

export default TagCharacter;