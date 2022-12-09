import { Tag } from "./Tag";

/**
 *  Importantly, you should use a `TagGroup` if you want to store values, as the
 *  Schema does not care about values, as it is *strictly* a metastructure for use
 *  in structurally defining data structures, interactions, or ecosystems.  
 *  
 *  Array Version:
 *  [
 *  	dtype | [ dtype, alias ] | [ dtype, { alias, ...rest } ],
 *  	[ dtype, [
 *  		dtype | [ dtype, alias ] | [ dtype, { alias, ...rest } ],
 * 			...,
 *  	], alias | { alias, ...rest } ],
 *  ]
 * 
 * Object Version:
 * 	{
 *  	alias: dtype | [ dtype, { ...rest } ],
 *  	alias: {
 * 			alias: dtype | [ dtype, { ...rest } ],
 * 			...,
 *  		$opts: [ dtype, { ...rest } ]
 *  	},
 *  }
 */
export class TagSchema extends Tag {
	static Encoder = ({ previous, emitter }, next) => {
		if(Array.isArray(next)) {
			return next;
		} else if(typeof next === "object") {
			return Object.entries(next);
		}

		return previous;
	};
	static RemoveEncoder = (tag) => {
		tag.removeReducer(this.Encoder);
	};

	constructor (value = [], { reducers = [], ...rest } = {}) {
		super({
			dtype: Tag.Type.SCHEMA,

			...rest
		});

		this.addReducer(TagSchema.Encoder);
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

export default TagSchema;