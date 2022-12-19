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

export function Meta({ tag, parent }) {
	const { prop, current, previous } = useTagEvent("modify", tag);

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);

	return (
		<div className={ `m-2 ml-3 rounded flex flex-col border border-b-2 border-${ color }-200 border-solid shadow` }>
			<div className="flex flex-col">
				<div className="flex flex-row">
					{/* Alias */ }
					<div className={ `basis-1/6 ml-2 p-1` }>{ tag.alias }</div>

					{/* DType */ }
					<div className={ `basis-5/6 p-1 ml-2 font-mono font-bold text-${ color }-${ magnitude }` }>{ tag.dtype }</div>
				</div>
			</div>
			<>
				<div className="pr-2 mb-1">
					{
						[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype)
							? tag.state.map((child, index) => {
								return (
									<Meta key={ `meta:${ child.id }` } tag={ child } parent={ tag } />
								);
							}) : null
					}
				</div>
			</>
		</div>
	);
};

export default Meta;