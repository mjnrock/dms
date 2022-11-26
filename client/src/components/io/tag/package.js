import { EnumTagType } from "../../../lib/dms/tags/Tag";

import { Tag } from "./Tag";
import { TagArray } from "./TagArray";
import { TagBoolean } from "./TagBoolean";
import { TagCharacter } from "./TagCharacter";
import { TagGroup } from "./TagGroup";
import { TagInt8 } from "./TagInt8";
import { TagString } from "./TagString";
import { TagUint8 } from "./TagUint8";
import { MetaTag } from "./MetaTag";

export const TypeToJSX = new Map([
	[ EnumTagType.ANY, Tag ],
	[ EnumTagType.ARRAY, TagArray ],
	[ EnumTagType.BOOLEAN, TagBoolean ],
	[ EnumTagType.CHARACTER, TagString ],
	[ EnumTagType.GROUP, TagGroup ],
	[ EnumTagType.INT8, TagInt8 ],
	[ EnumTagType.STRING, TagString ],
	[ EnumTagType.UINT8, TagUint8 ],
]);

export function Factory(tag, props = {}) {
	let Clazz = TypeToJSX.get(tag.type);

	if(Clazz) {
		return <Clazz tag={ tag } { ...props } />;
	}

	return null;
}

export default {
	Tag,
	TagArray,
	TagBoolean,
	TagCharacter,
	TagGroup,
	TagInt8,
	TagString,
	TagUint8,
	MetaTag,

	TypeToJSX,
	Factory,
};