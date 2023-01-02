import { Popup } from "semantic-ui-react";
import { useTagEvent } from "./../lib/react/useTagEvent";

import { EnumTagType } from "./../lib/tags/Tag";

import { TypeColor } from "./EnumTypeColor";

export function Meta({ tag, parent, offset = 0, size = 10, isVertical = false, displayGroup = false, ...rest }) {
	const { prop, current, previous } = useTagEvent("update", tag);

	if(displayGroup === false && EnumTagType.GROUP === tag.type) {
		/** Short-circuit execution and only render the children */
		return tag.value.map((child, index) => {
			return (
				<Meta key={ `meta:${ child.id }` } tag={ child } parent={ tag } offset={ offset } isVertical={ isVertical } size={ size } />
			);
		})
	}

	let [ color, magnitude ] = TypeColor(tag.type);

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
				<Popup
					position="top center"
					content={ (
						<div className={ `flex flex-col whitespace-nowrap` }>
							<div className={ `font-mono font-bold text-${ color }-${ magnitude }` }>{ tag.type }</div>
							<div className={ `` }>{ tag.alias }</div>
						</div>
					) }
					trigger={
						<div style={ {
							width: `${ size }px`,
							height: `${ size }px`,
						} } className={ `cursor-help select-none bg-${ color }-${ magnitude } hover:bg-${ color }-${ magnitude + 200 } border border-solid rounded border-white` }>&nbsp;</div>
					} />
			</div>
			<>
				{
					[ EnumTagType.GROUP, EnumTagType.COMPOUND ].includes(tag.type)
						? tag.value.map((child, index) => {
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