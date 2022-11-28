import { Tag } from "./Tag";

export class TagArray extends Tag {
	static Encoder = ({ emitter }, next) => {
		if(next instanceof Tag) {
			return [ next ];
		} else if(!Array.isArray(next)) {
			return [];
		}

		return next.filter(item => item instanceof Tag);
	};
	static RemoveEncoder = (tag) => {
		tag.removeReducer(this.Encoder);
	};

	constructor (value = [], { reducers = [], ...rest } = {}) {
		super({
			dtype: Tag.Type.ARRAY,

			...rest
		});

		this.addReducer(TagArray.Encoder);
		this.addReducers(...reducers);

		this.update(value);
	}
	toObject(verbose = false) {
		let obj = {
			...super.toObject(verbose),
			value: this.state.map(child => child.toObject(verbose)),
		};

		return obj;
	}
}

export default TagArray;