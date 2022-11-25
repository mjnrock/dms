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
	ArraySchema: (arr = [], asTagGroup = true) => {
		let root = [];

		for(let [ type, value, ...args ] of arr) {
			let clazz = TypeToClass.get(type);

			if(clazz) {
				if([ TagArray, TagGroup ].includes(clazz)) {
					let children = Builder.ArraySchema(value, false);

					root.push(new clazz(children, ...args));
				} else {
					root.push(new clazz(value, ...args));
				}
			}
		}

		if(asTagGroup) {
			return new TagGroup(root);
		}

		return root;
	},
};

export default Builder;