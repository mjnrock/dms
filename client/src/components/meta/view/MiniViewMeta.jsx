import { useTagEvent } from "../../../lib/dms/react/useTagEvent";

import { EnumTagType } from "../../../lib/dms/tags/Tag";


export const EnumTypeColor = new Map([
	[ EnumTagType.ANY, [ "gray", 200 ] ],
	[ EnumTagType.ARRAY, [ "gray", 200 ] ],
	[ EnumTagType.BOOLEAN, [ "purple", 200 ] ],
	[ EnumTagType.CHARACTER, [ "orange", 200 ] ],
	[ EnumTagType.GROUP, [ "gray", 400 ] ],
	[ EnumTagType.NAMESPACE, [ "neutral", 600 ] ],
	[ EnumTagType.INT8, [ "blue", 200 ] ],
	[ EnumTagType.STRING, [ "red", 200 ] ],
	[ EnumTagType.UINT8, [ "teal", 200 ] ],
	[ EnumTagType.SCHEMA, [ "gray", 400 ] ],
]);

export function Meta({ tag, parent, offset = 0, size = 10, isVertical = true, ...rest }) {
	const { prop, current, previous } = useTagEvent("modify", tag);

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);
	return (
		<div className={ `inline-flex ${ isVertical ? `flex-col` : `` } ${ rest.className ? rest.className : "" }` }>
			<div className={ `inline-flex ${ isVertical ? `` : `flex-col` }` }>
				{
					[ ...Array(offset).keys() ].map((_, index) => {
						return (
							<div
								key={ `meta:offset:${ index }` }
								className={ `select-none text-neutral-200 cursor-auto` }
								style={ {
									width: `${ size }px`,
									height: `${ size }px`,
								} }>&nbsp;</div>
						);
					})
				}
				<div style={ {
					width: `${ size }px`,
					height: `${ size }px`,
				} } className={ `select-none bg-${ color }-${ magnitude } hover:bg-${ color }-${ magnitude + 200 } border border-solid rounded border-white` }>&nbsp;</div>
			</div>
			<>
				{
					[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype)
						? tag.state.map((child, index) => {
							return (
								<Meta key={ `meta:${ child.id }` } tag={ child } parent={ tag } offset={ offset + 1 } isVertical={ isVertical } size={ size } />
							);
						}) : null
				}
			</>
		</div>
	);
};

export default Meta;