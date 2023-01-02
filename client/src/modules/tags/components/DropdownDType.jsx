import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import { EnumTagType } from "./../lib/tags/Tag";

import { EnumTypeColor, TypeColor } from "./EnumTypeColor";

export function DropdownDType({ tag, callback, text }) {
	let [ color, magnitude ] = TypeColor(tag.type);
	magnitude += 100;

	return (
		<Dropdown text={ text || tag.type } className={ `basis-1/2 p-2 ml-2 font-mono font-bold text-${ color }-${ magnitude } border border-solid border-transparent hover:border-${ color }-${ 200 } hover:rounded` } icon={ false }>
			<Dropdown.Menu className={ `w-full` }>
				{
					Array.from(Object.values(EnumTagType))
						// .filter(o => [ EnumTagType.ANY, EnumTagType.NAMESPACE, EnumTagType.SCHEMA ].includes(o) === false)
						.sort()
						.map((option, index) => {
							let [ color, magnitude ] = EnumTypeColor.get(option) || [ `gray`, 100 ];
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