import { useTagEvent } from "./../lib/react/useTagEvent";

import { EnumTagType } from "./../lib/tags/Tag";

import { TypeColor } from "./EnumTypeColor";

export function Meta({ tag, parent, solid = false } = {}) {
	const { prop, current, previous } = useTagEvent("update", tag);

	let [ color, magnitude ] = TypeColor(tag.type);

	let backgroundColor = solid ? `${ color }-${ magnitude }` : `white`,
		backgroundBorderColor = solid ? `${ color }-${ magnitude }` : `white`;

	return (
		<div className={ `whitespace-nowrap shadow-sm cursor-crosshair m-2 pt-1 ml-3 rounded flex flex-col bg-${ backgroundColor } border border-l-4 border-${ color }-${ solid ? 400 : magnitude } hover:bg-${ backgroundBorderColor } hover:border-${ color }-${ solid ? 700 : magnitude + 200 } border-solid` }>
			<div className="flex flex-col">
				<div className={ `flex flex-row` }>
					{/* DType */ }
					<div className={ `basis-1/6 p-1 ml-2 font-mono font-bold text-${ color }-${ solid ? 600 : magnitude }` }>{ tag.type }</div>

					{/* Alias */ }
					<div className={ `basis-5/6 ml-2 p-1 pr-2 text-left` }>{ tag.alias }</div>
				</div>
			</div>
			<>
				<div className={ `pr-1 mb-1` }>
					{
						[ EnumTagType.COMPOUND, EnumTagType.GROUP ].includes(tag.type)
							? tag.value.map((child, index) => {
								return (
									<Meta key={ `meta:${ child.id }` } tag={ child } parent={ tag } solid={ solid } />
								);
							}) : null
					}
				</div>
			</>
		</div>
	);
};

export default Meta;