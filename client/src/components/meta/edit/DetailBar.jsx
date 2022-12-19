import { useState } from "react";
import { Button } from "semantic-ui-react";

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

export function DetailBar({ tag }) {
	const [ setting, setSetting ] = useState({
		Required: false,
		Nullable: true,
	});

	function updateSetting(key, next, current) {
		setSetting({
			...setting,
			[ key ]: next,
		});
	}

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);
	magnitude += 100;

	return (
		<div className={ `mt-2 p-2 flex flex-col border-2 border-solid rounded border-${ color }-${ 100 } shadow-sm` }>
			{
				Object.entries(setting).map(([ key, value ]) => {
					return (
						<div key={ `${ key }:${ tag.id }` } className={ `flex flex-row mt-2` }>
							<code className={ `basis-1/2` }>{ key }</code>
							<div className="basis-1/2">
								<Button
									basic
									color={ value ? `green` : `red` }
									className={ `w-full` }
									onClick={ e => updateSetting(key, !value, value) }
								>{ value ? `Yes` : `No` }</Button>
							</div>
						</div>
					);
				})
			}
		</div>
	);
};

export default DetailBar;