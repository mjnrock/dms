import { Tag } from "../Tag";

export class TagGroup extends Tag {
	static Encoder = ({ current }, next) => {
		if(next instanceof Tag) {
			return [ next ];
		} else if(!Array.isArray(next)) {
			return [];
		}

		return next.filter(item => item instanceof Tag);
	};
	static RemoveEncoder = (tag) => {
		tag.removeEncoder(this.Encoder);
	};

	constructor (value = [], { ...rest } = {}) {
		super({
			type: Tag.Type.GROUP,
			encoders: [ TagGroup.Encoder ],

			...rest
		});

		this.next(value);
	}

	addChild(child) {
		if(child instanceof Tag) {
			this.next([ ...this.value, child ]);

			return true;
		}

		return false;
	}
	addChildren(...children) {
		let results = [];
		this.next([ ...this.value, ...children.filter(child => {
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
			this.next(this.value.filter(item => item !== child));

			return true;
		}

		return false;
	}
	removeChildren(...children) {
		let results = [];
		this.next(this.value.filter(item => {
			if(children.includes(item)) {
				results.push(true);

				return false;
			}

			results.push(false);

			return true;
		}));

		return results;
	}

	swapChildren(child1, child2) {
		if(child1 instanceof Tag && child2 instanceof Tag) {
			let index1 = this.value.indexOf(child1);
			let index2 = this.value.indexOf(child2);

			if(index1 !== -1 && index2 !== -1) {
				let value = this.value.slice();

				value[ index1 ] = child2;
				value[ index2 ] = child1;

				this.next(value);

				return true;
			}
		}

		return false;
	}
	replaceChild(child1, child2) {
		if(child1 instanceof Tag && child2 instanceof Tag) {
			let index = this.value.indexOf(child1);

			if(index !== -1) {
				let value = this.value.slice();

				value[ index ] = child2;

				this.next(value);

				return true;
			}
		}

		return false;
	}

	toObject(verbose = false) {
		let obj = {
			...super.toObject(verbose),
			value: this.value.map(child => child.toObject(verbose)),
		};

		return obj;
	}
	toJson(verbose = false) {
		return JSON.stringify(this.value.map(child => child.toObject(verbose)));
	}
	toString(verbose = false) {
		return this.toJson(verbose);
	}
	toKVP(...props) {
		let obj = {};

		for(let prop of props) {
			if(prop === "value") {
				obj.value = this.value.map(child => child.toKVP(...props));
			} else {
				obj[ prop ] = this[ prop ];
			}
		}


		return obj;
	}
}

export default TagGroup;