import { Tag } from "./Tag.js";

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
			type: Tag.Type.ARRAY,

			...rest
		});

		this.addReducer(TagArray.Encoder);
		this.addReducers(...reducers);

		this.update(value);
	}
	toObject(verbose = false) {
		if(verbose) {
			return {
				id: this.id,

				...this.toObject(false),

				events: [ this.events.size, ...this.events.keys ],
				reducers: this.reducers.length,
				meta: this.meta,
			};
		}

		return {
			type: this.type,
			value: this.state.map(child => child.toObject(verbose)),
		};
	}
}

export default TagArray;