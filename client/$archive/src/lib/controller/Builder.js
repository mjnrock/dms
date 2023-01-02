import { TagSchema } from "./../TagSchema";
import { Tag } from "./../Tag";
import { TagArray } from "./../TagArray";
import { TagBoolean } from "./../TagBoolean";
import { TagCharacter } from "./../TagCharacter";
import { TagGroup } from "./../TagGroup";
import { TagInt8 } from "./../TagInt8";
import { TagString } from "./../TagString";
import { TagUint8 } from "./../TagUint8";

export const TypeToClass = new Map([
	[ Tag.Type.ANY, Tag ],
	[ Tag.Type.ARRAY, TagArray ],
	[ Tag.Type.BOOLEAN, TagBoolean ],
	[ Tag.Type.CHARACTER, TagCharacter ],
	[ Tag.Type.GROUP, TagGroup ],
	[ Tag.Type.INT8, TagInt8 ],
	[ Tag.Type.STRING, TagString ],
	[ Tag.Type.UINT8, TagUint8 ],
]);

export const Builder = {
	Factory: (dtype, value = null, { ...args }) => {
		let clazz = TypeToClass.get(dtype);

		if(clazz) {
			return new clazz(value, args);
		}

		return null;
	},
	FromArrayObject: (arr = [], asTagSchema = true) => {
		let root = [];

		for(let [ dtype, value, ...args ] of arr) {
			let clazz = TypeToClass.get(dtype);

			if(clazz) {
				let tag;
				if([ TagArray, TagGroup, TagSchema ].includes(clazz)) {
					let children = Builder.FromArrayObject(value, false);

					tag = new clazz(children, ...args);
				} else {
					tag = new clazz(value, ...args);
				}

				root.push(tag);
			}
		}

		if(asTagSchema) {
			return new TagSchema(root, { alias: "$root" });
		}

		return root;
	},
	FromAliasObject: (obj = {}, asTagSchema = true) => {
		let root = [];

		for(let [ alias, [ dtype, value, ...args ] ] of Object.entries(obj)) {
			let clazz = TypeToClass.get(dtype);

			if(clazz) {
				let tag;
				if([ TagArray, TagGroup, TagSchema ].includes(clazz)) {
					let children = Builder.FromAliasObject(value, false);

					tag = new clazz(children, { alias, ...args });
				} else {
					tag = new clazz(value, { alias, ...args });
				}

				root.push(tag);
			}
		}

		if(asTagSchema) {
			return new TagSchema(root, { alias: "$root" });
		}

		return root;
	},
	FromAliasSchema: (schema = {}, asTagSchema = true) => {
		let root = [];

		for(let [ alias, dtype ] of Object.entries(schema)) {
			let tag;
			if(typeof dtype === "object") {
				let clazz = TypeToClass.get("group");
				let children = Builder.FromAliasSchema(dtype, false);

				tag = new clazz(children, { alias });
			} else {
				let clazz = TypeToClass.get(dtype);

				if(clazz) {
					tag = new clazz(null, { alias });
				}
			}

			root.push(tag);
		}

		if(asTagSchema) {
			return new TagSchema(root, { alias: "$root" });
		}

		return root;
	},

	ToArrayObject(tag) {
		let arr = [];

		if([ Tag.Type.GROUP, Tag.Type.ARRAY, Tag.Type.SCHEMA ].includes(tag.dtype)) {
			for(let child of tag.value) {
				arr.push(Builder.ToArrayObject(child));
			}
		} else {
			if(tag.alias) {
				arr.push([ tag.dtype, tag.value, { alias: tag.alias } ]);
			} else {
				arr.push([ tag.dtype, tag.value ]);
			}
		}

		return arr;
	},
	ToAliasSchema(tag, obj = {}) {
		if([ Tag.Type.GROUP, Tag.Type.ARRAY, Tag.Type.SCHEMA ].includes(tag.dtype)) {
			for(let child of tag.value) {
				obj[ child.alias ] = Builder.ToAliasSchema(child);
			}

			/**
			 * If the grouping is an array, the *first* child will be the data object.
			 * NOTE: This syntax is to tersely differentiate between an "array" and a "group", while still preserving aliases in a key-value pair.
			 */
			if(tag.dtype === Tag.Type.ARRAY) {
				obj = [ obj ];
			}

			return obj;
		} else {
			return tag.dtype;
		}
	}
};

export default Builder;