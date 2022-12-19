import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import { EnumTagType } from "./../../../lib/dms/tags/Tag";


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

export function DropdownDType({ tag, callback, text }) {
	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);
	magnitude += 100;

	return (
		<Dropdown text={ text || tag.dtype } className={ `basis-1/2 p-2 ml-2 font-mono font-bold text-${ color }-${ magnitude } border border-solid border-transparent hover:border-${ color }-${ 200 } hover:rounded` } icon={ false }>
			<Dropdown.Menu className={ `w-full` }>
				{
					Array.from(Object.values(EnumTagType))
						.filter(o => [ EnumTagType.ANY, EnumTagType.NAMESPACE, EnumTagType.SCHEMA ].includes(o) === false)
						.map((option, index) => {
							let [ color, magnitude ] = EnumTypeColor.get(option);
							magnitude += 100;

							return (
								<div key={ index } onClick={ () => callback(option) } className={ `p-2 pl-4 font-mono font-bold cursor-pointer bg-${ color }-${ 100 } text-${ color }-${ magnitude } hover:bg-${ color }-${ magnitude + 200 }` }>{ option }</div>
							);
						})
				}
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default DropdownDType;