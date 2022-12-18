import { Tag } from "./Tag.js";
import { TagGroup } from "./TagGroup.js";

export class TagNamespace extends Tag {
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

	constructor (namespace, members, { reducers = [], ...rest } = {}) {
		super({
			dtype: Tag.Type.NAMESPACE,

			...rest
		});

		this.alias = namespace;

		this.addReducer(TagNamespace.Encoder);
		this.addReducers(...reducers);

		this.update(members);
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

	toObject(verbose = false) {
		let obj = {
			...super.toObject(verbose),
			value: this.state.map(child => child.toObject(verbose)),
		};

		return obj;
	}
}

export default TagNamespace;