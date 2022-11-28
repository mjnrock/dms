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
export const EnumTypeColor = new Map([
	[ EnumTagType.ANY, `bg-gray-200` ],
	[ EnumTagType.ARRAY, `bg-gray-200` ],
	[ EnumTagType.BOOLEAN, `bg-purple-200` ],
	[ EnumTagType.CHARACTER, `bg-orange-200` ],
	[ EnumTagType.GROUP, `bg-gray-400` ],
	[ EnumTagType.INT8, `bg-blue-200` ],
	[ EnumTagType.STRING, `bg-red-200` ],
	[ EnumTagType.UINT8, `bg-teal-200` ],
]);

/**
 * Dynamically determines the appropriate JSX component to use, based on the `type` property of @tag.
 */
export function Factory(tag, props = {}) {
	let Clazz = TypeToJSX.get(tag.type);

	if(Clazz) {
		let isGroupingTag = [ EnumTagType.ARRAY, EnumTagType.GROUP ].includes(tag.type);
		return (
			<div key={ tag.id } className={ `flex ${ isGroupingTag ? "flex-col mt-4" : "flex-row" } m-2 border-2 border-gray-500 border-solid rounded` }>
				<div className={ `p-0 mt-auto mb-auto mr-0 font-mono font-bold text-center align-middle ${ EnumTypeColor.get(tag.type) } basis-2/12` }>{ tag.meta.alias }</div>
				{
					isGroupingTag
						? <Clazz tag={ tag } { ...props } />
						: <Clazz tag={ tag } css={ `pl-2 basis-10/12` } { ...props } />
				}
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