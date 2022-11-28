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

/**
 * Dynamically determines the appropriate JSX component to use, based on the `type` property of @tag.
 */
export function Factory(tag, props = {}, children = []) {
	let Clazz = TypeToJSX.get(tag.type);

	if(Clazz) {
		if(children.length) {
			return <Clazz tag={ tag } { ...props }>{ children }</Clazz>;
		}

		return (
			<div className={ `flex ${ [ EnumTagType.GROUP, EnumTagType.ARRAY].includes(tag.type) ? "flex-col" : "flex-row" } m-2 border-2 border-gray-500 border-solid rounded` }>
				<div className="p-0 mt-auto mb-auto mr-2 font-mono font-bold text-center align-middle bg-gray-200 basis-2/12">{ tag.meta.alias }</div>
				<Clazz tag={ tag } { ...props } />
			</div>
		);
	}

	return null;
};

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