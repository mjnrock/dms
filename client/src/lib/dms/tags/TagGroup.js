import { Tag } from "./Tag.js";

export class TagGroup extends Tag {
	static Encoder = ({}, next) => {
		if(next instanceof Tag) {
			return [ next ];
		} else if(!Array.isArray(next)) {
			return [];
		}

		return next.filter(item => item instanceof Tag);
	};

	constructor (value = [], { reducers = [], ...rest } = {}) {
		super({
			type: Tag.Type.GROUP,

			...rest
		});

		this.addReducer(TagGroup.Encoder);
		this.addReducers(...reducers);

		this.state = value;
	}

	getByIndex(index) {
		return this.state[ index ];
	}
	getByProp(key, value) {
		if(value !== void 0) {
			return this.state.find(child => child[ key ] === value);
		}

		return this.state.find(child => child[ key ]);
	}
	getByAlias(alias) {
		return this.state.find(child => child.meta.alias === alias);
	}
	getById(id) {
		return this.getByProp("id", id);
	}
	getByTag(...tags) {
		return this.state.filter(child => {
			if(tags.some(t => child.tags.has(t))) {
				return true;
			}

			return false;
		});
	}
}

export default TagGroup;