import { EnumTagType, Tag } from "./Tag.js";

export class TagGroup extends Tag {
	static Encoder = ({ }, next) => {
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
	
	swapIndex(child, newChild) {
		if(child instanceof Tag && newChild instanceof Tag) {
			let index = this.value.indexOf(child),
				newIndex = this.value.indexOf(newChild);

			if(index !== -1 && newIndex !== -1) {
				let value = [ ...this.value ];
				value[ index ] = newChild;
				value[ newIndex ] = child;

				this.update(value);

				return true;
			}
		}

		return false;
	}

	replaceChild(child, newChild, convert = true) {
		if(child instanceof Tag && newChild instanceof Tag) {
			if(convert) {
				newChild.id = child.id;
				newChild.alias = child.alias;

				if([ EnumTagType.GROUP, EnumTagType.ARRAY ].includes(child.dtype && newChild.dtype)) {
					newChild.state = child.state;
				}
			}

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