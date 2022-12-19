import { useState, useEffect } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import { EnumTagType } from "../../../lib/dms/tags/Tag";
import Builder from "../../../lib/dms/tags/controller/Builder";

import { DropdownDType } from "./DropdownDType";
import { InfoBar } from "./InfoBar";


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
		<div className={ `m-2 p-2 border-2 border-${ color }-200 hover:border-${ color }-400 border-solid rounded flex flex-col shadow-md` }>
			<InfoBar tag={ tag } parent={ parent } />
			<>
				{
					[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype)
						? tag.state.map((child, index) => {
							return (
								<Meta key={ `meta:${ child.id }` } tag={ child } parent={ tag } />
							);
						}) : null
				}
			</>
			<>
				{

					[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype)
						? (
							<DropdownDType
								tag={ tag }
								callback={ dtype => {
									tag.addChild(Builder.Factory(dtype, null, {
										alias: `${ Date.now() }${ ~~(Math.random() * 1000000) }`,
									}));
								} }
								text={ (
									<PlusCircleIcon className={ `w-6 h-6 text-${ color }-300 cursor-pointer` } />
								) }
							/>
						) : null
				}
			</>
		</div>
	);
};

export default Meta;