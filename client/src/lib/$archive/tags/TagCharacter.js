import { Tag } from "./Tag";
import TagString from "./TagString";

export class TagCharacter extends TagString {
	static Encoder = ({ current }, next) => {
		if(next != null) {
			return next.toString()[ 0 ];
		}

		if(current) {
			return current[ 0 ];
		}

		return null;
	};
	static RemoveEncoder = (tag) => {
		tag.removeReducer(this.Encoder);
	};

	constructor (value, { reducers = [], ...rest } = {}) {
		super(null, {
			...rest
		});
		
		this.dtype =  Tag.Type.CHARACTER;

		this.addReducer(TagCharacter.Encoder);
		this.addReducers(...reducers);

		this.update(value);
	}
}

export default TagCharacter;