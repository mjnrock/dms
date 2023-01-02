import { Tag } from "./../tags/Tag";
import { TagArray } from "./../tags/TagArray";
import { TagBoolean } from "./../tags/TagBoolean";
import { TagCharacter } from "./../tags/TagCharacter";
import { TagCompound } from "./../tags/TagCompound";
import { TagFloat32 } from "./../tags/TagFloat32";
import { TagFunction } from "./../tags/TagFunction";
import { TagInt8 } from "./../tags/TagInt8";
import { TagInt16 } from "./../tags/TagInt16";
import { TagInt32 } from "./../tags/TagInt32";
import { TagObject } from "./../tags/TagObject";
import { TagString } from "./../tags/TagString";
import { TagUint8 } from "./../tags/TagUint8";
import { TagUint16 } from "./../tags/TagUint16";
import { TagUint32 } from "./../tags/TagUint32";

import { TagGroup } from "../tags/meta/TagGroup";

export const TypeToClass = new Map([
	[ Tag.Type.ARRAY, TagArray ],
	[ Tag.Type.BOOLEAN, TagBoolean ],
	[ Tag.Type.CHARACTER, TagCharacter ],
	[ Tag.Type.COMPOUND, TagCompound ],
	[ Tag.Type.FLOAT32, TagFloat32 ],
	[ Tag.Type.FUNCTION, TagFunction ],
	[ Tag.Type.INT8, TagInt8 ],
	[ Tag.Type.INT16, TagInt16 ],
	[ Tag.Type.INT32, TagInt32 ],
	[ Tag.Type.OBJECT, TagObject ],
	[ Tag.Type.STRING, TagString ],
	[ Tag.Type.UINT8, TagUint8 ],
	[ Tag.Type.UINT16, TagUint16 ],
	[ Tag.Type.UINT32, TagUint32 ],

	[ Tag.Type.GROUP, TagGroup ],
]);

/**
 * Helper function to "promote" a TagCompound to a TagGroup
 */
export function PromoteToTagGroup(tag) {
	if(tag instanceof TagCompound) {
		let children = tag.value;

		tag = new TagGroup(children, { alias: tag.alias });
	}

	return tag;
};

export const Builder = {
	Factory: (type, value = null, { ...args }) => {
		let clazz = TypeToClass.get(type);

		if(clazz) {
			return new clazz(value, args);
		}

		return null;
	},
	FromArrayObject: (arr = [], asTagGroup = true) => {
		let root = [];

		for(let [ type, value, ...args ] of arr) {
			let clazz = TypeToClass.get(type);

			if(clazz) {
				let tag;
				if([ TagCompound, TagGroup ].includes(clazz)) {
					let children = Builder.FromArrayObject(value, false);

					tag = new clazz(children, ...args);
				} else {
					tag = new clazz(value, ...args);
				}

				root.push(tag);
			}
		}

		if(asTagGroup) {
			let tag = new TagGroup(root, { alias: "$root" });

			/* This is not robustly implemented, but the idea is that it "converts" the group-level TagCompound into a TagGroup */
			if(tag.size() === 1 && tag.getChildAt(0).type === Tag.Type.COMPOUND) {
				return PromoteToTagGroup(tag.getChildAt(0));
			}
		}

		return root;
	},
	FromAliasObject: (obj = {}, asTagGroup = true) => {
		let root = [];

		for(let [ alias, [ type, value, ...args ] ] of Object.entries(obj)) {
			let clazz = TypeToClass.get(type);

			if(clazz) {
				let tag;
				if([ TagCompound, TagGroup ].includes(clazz)) {
					let children = Builder.FromAliasObject(value, false);

					tag = new clazz(children, { alias, ...args });
				} else {
					tag = new clazz(value, { alias, ...args });
				}

				root.push(tag);
			}
		}

		if(asTagGroup) {
			let tag = new TagGroup(root, { alias: "$root" });

			/* This is not robustly implemented, but the idea is that it "converts" the group-level TagCompound into a TagGroup */
			if(tag.size() === 1 && tag.getChildAt(0).type === Tag.Type.COMPOUND) {
				return PromoteToTagGroup(tag.getChildAt(0));
			}
		}

		return root;
	},
	FromAliasSchema: (schema = {}, asTagGroup = true) => {
		let root = [];

		for(let [ alias, type ] of Object.entries(schema)) {
			let tag;
			if(typeof type === "object") {
				let clazz = TypeToClass.get("comp");
				let children = Builder.FromAliasSchema(type, false);

				tag = new clazz(children, { alias });
			} else {
				let clazz = TypeToClass.get(type);

				if(clazz) {
					tag = new clazz(null, { alias });
				}
			}

			root.push(tag);
		}

		if(asTagGroup) {
			let tag = new TagGroup(root, { alias: "$root" });

			/* This is not robustly implemented, but the idea is that it "converts" the single-child, group-level TagCompound into a TagGroup */
			if(tag.size() === 1 && tag.getChildAt(0).type === Tag.Type.COMPOUND) {
				return PromoteToTagGroup(tag.getChildAt(0));
			}
		}

		return root;
	},

	ToArrayObject(tag) {
		let arr = [];

		if([ Tag.Type.COMPOUND, Tag.Type.GROUP ].includes(tag.type)) {
			for(let child of tag.value) {
				arr.push(Builder.ToArrayObject(child));
			}
		} else {
			if(tag.alias) {
				arr.push([ tag.type, tag.value, { alias: tag.alias } ]);
			} else {
				arr.push([ tag.type, tag.value ]);
			}
		}

		return arr;
	},
	ToAliasSchema(tag, obj = {}) {
		if([ Tag.Type.COMPOUND, Tag.Type.GROUP ].includes(tag.type)) {
			for(let child of tag.value) {
				obj[ child.alias ] = Builder.ToAliasSchema(child);
			}

			return obj;
		} else {
			return tag.type;
		}
	}
};

export default Builder;