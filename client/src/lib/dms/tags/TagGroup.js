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
	static RemoveEncoder = (tag) => {
		tag.removeReducer(this.Encoder);
	};

	constructor (value = [], { reducers = [], ...rest } = {}) {
		super({
			dtype: Tag.Type.GROUP,

			...rest
		});

		this.addReducer(TagGroup.Encoder);
		this.addReducers(...reducers);

		this.update(value);
	}

	addChild(child) {
		if(child instanceof Tag) {
			this.update([ ...this.value, child ]);
			
			return true;
		}

		return false;
	}
	addChildren(...children) {
		let results = [];
		this.update([ ...this.value, ...children.filter(child => {
			if(child instanceof Tag) {
				results.push(true);

				return true;
			}

			results.push(false);

			return false;
		}) ]);

		return results;
	}
	removeChild(child) {
		if(child instanceof Tag) {
			this.update(this.value.filter(item => item !== child));

			return true;
		}

		return false;
	}
	removeChildren(...children) {
		let results = [];
		this.update(this.value.filter(item => {
			if(children.includes(item)) {
				results.push(true);

				return false;
			}

			results.push(false);

			return true;
		}));

		return results;
	}

	replaceChild(child, newChild) {
		if(child instanceof Tag && newChild instanceof Tag) {
			this.update(this.value.map(item => item === child ? newChild : item));

			return true;
		}

		return false;
	}

	toObject(verbose = false) {
		let obj = {
			...super.toObject(verbose),
			value: this.state.map(child => child.toObject(verbose)),
		};

		return obj;
	}
}

export default TagGroup;