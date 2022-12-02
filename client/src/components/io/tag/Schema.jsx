import Builder from "../../../lib/dms/tags/controller/Builder";
import { Tag } from "./../../../lib/dms/tags/Tag";

export const EnumTypeColor = new Map([
	[ Tag.Type.ANY, `gray-200` ],
	[ Tag.Type.ARRAY, `gray-200` ],
	[ Tag.Type.BOOLEAN, `purple-200` ],
	[ Tag.Type.CHARACTER, `orange-200` ],
	[ Tag.Type.GROUP, `gray-400` ],
	[ Tag.Type.INT8, `blue-200` ],
	[ Tag.Type.STRING, `red-200` ],
	[ Tag.Type.UINT8, `teal-200` ],
]);

export function Schema({ tag, css = "" } = {}) {
	const schema = Builder.ToAliasSchema(tag);

	let isGroupingTag = [ Tag.Type.ARRAY, Tag.Type.GROUP ].includes(tag.dtype);
	return (
		<div className={ `flex ${ isGroupingTag ? "flex-col mt-4" : "flex-row" } m-2 border-2 border-gray-500 border-solid rounded` }>
			<div className={ `p-0 mt-auto mb-auto mr-0 font-bold text-center align-middle basis-2/12 ${ isGroupingTag ? `bg-${ EnumTypeColor.get(tag.dtype) }` : "" }` }>{ tag.alias }</div>
			{
				isGroupingTag
					? tag.value.map(t => <Schema key={ t.id } tag={ t } />)
					: <div className={ `font-mono pl-2 basis-10/12 bg-${ EnumTypeColor.get(tag.dtype) }` }>{ tag.dtype }</div>
			}
		</div>
	);
};

export function SchemaVariant({ tag, css = "" } = {}) {
	const schema = Builder.ToAliasSchema(tag);

	let isGroupingTag = [ Tag.Type.ARRAY, Tag.Type.GROUP ].includes(tag.dtype);
	return (
		<div className={ `m-2 border-2 border-gray-500 border-solid rounded` }>
			<div className={ `p-0 mt-auto mb-auto mr-0 font-bold text-center align-middle ${ isGroupingTag ? `bg-${ EnumTypeColor.get(tag.dtype) }` : "" }` }>{ tag.alias }</div>
			{
				isGroupingTag
					? tag.value.map(t => <SchemaVariant key={ t.id } tag={ t } />)
					: <div className={ `font-mono pl-2 bg-${ EnumTypeColor.get(tag.dtype) }` }>{ tag.dtype }</div>
			}
		</div>
	);
};

export default Schema;