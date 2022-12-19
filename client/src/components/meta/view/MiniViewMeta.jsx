import { useState, useEffect } from "react";

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

export function Meta({ tag, parent, offset = 0, size = 10, ...rest }) {
	const [ state, setState ] = useState({});

	useEffect(() => {
		let fn = ({ prop, current }) => {
			setState({
				...state,
				[ prop ]: current,
			});
		};

		tag.events.on("modify", fn);

		return () => {
			tag.events.off("modify", fn);
		};
	}, []);

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);
	return (
		<div className={ `inline-flex flex-col ${ rest.className ? rest.className : "" }` }>
			<div className={ `inline-flex` }>
				{
					[ ...Array(offset).keys() ].map((_, index) => {
						//IDEA: Decide on whether you should implement this or not, or something similar
						// if(index === offset - 1) {
						// 	return (
						// 		<div
						// 			className={ `select-none text-neutral-700 text-center` }
						// 			style={ {
						// 				width: `${ size }px`,
						// 				height: `${ size }px`,
						// 				display: "flex",
						// 				alignItems: "flex-start",
						// 				justifyContent: "center",
						// 			} }>{
						// 				[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype)
						// 					? `+`
						// 					: `-`
						// 			}</div>
						// 	);
						// }

						return (
							<div
								className={ `select-none text-neutral-200` }
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
				} } className={ `bg-${ color }-${ magnitude } border border-solid rounded border-white text-transparent` }>{ [ offset, tag.dtype ].join(",") }</div>
			</div>
			<>
				{
					[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype)
						? tag.state.map((child, index) => {
							return (
								<Meta key={ `meta:${ child.id }` } tag={ child } parent={ tag } offset={ offset + 1 } size={ size } />
							);
						}) : null
				}
			</>
		</div>
	);
};

export default Meta;