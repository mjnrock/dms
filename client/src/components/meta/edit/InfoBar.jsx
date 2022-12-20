import { useState } from "react";
import { Bars3Icon, PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";

import Builder from "./../../../lib/dms/tags/controller/Builder";
import { EnumTagType } from "./../../../lib/dms/tags/Tag";

import { DropdownDType } from "./DropdownDType";
import { DetailBar } from "./DetailBar";


export const EnumTypeColor = new Map([
	[ EnumTagType.ANY, [ "gray", 200 ] ],
	[ EnumTagType.ARRAY, [ "gray", 200 ] ],
	[ EnumTagType.BOOLEAN, [ "purple", 200 ] ],
	[ EnumTagType.CHARACTER, [ "orange", 200 ] ],
	[ EnumTagType.GROUP, [ "gray", 400 ] ],
	[ EnumTagType.NAMESPACE, [ "neutral", 300 ] ],
	[ EnumTagType.INT8, [ "blue", 200 ] ],
	[ EnumTagType.STRING, [ "red", 200 ] ],
	[ EnumTagType.UINT8, [ "teal", 200 ] ],
	[ EnumTagType.SCHEMA, [ "neutral", 600 ] ],
]);

export function InfoBar({ tag, parent }) {
	const [ mode, setMode ] = useState("simple");	// String version of "isExpanded", allowing for more nuanced states

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);
	magnitude += 100;

	function editAlias(alias) {
		tag.alias = alias;
	}
	function editType(type) {
		parent.replaceChild(tag, Builder.Factory(type, null, {
			alias: tag.alias,
		}));
	}
	function removeTag() {
		parent.removeChild(tag);
	}

	//NOTE: The `tag.dtype === EnumTagType.SCHEMA` enforce "no change" rules for the root schema tag
	return (
		<div className="flex flex-col">
			<div className="flex flex-row">
				{/* Reorder handle icon */ }
				<div className="mt-auto mb-auto">
					<Bars3Icon className={ `w-6 h-6 text-${ color }-400 cursor-grab` } />
				</div>

				{/* Alias */ }
				{
					tag.dtype === EnumTagType.SCHEMA
						? <div className={ `basis-1/2 ml-2 p-2 border rounded border-transparent font-mono font-bold` }>{ tag.alias }</div>
						: <input className={ `basis-1/2 ml-2 p-2 border rounded border-transparent hover:rounded hover:border hover:border-${ color }-${ 200 } hover:rounded` } value={ tag.alias } onChange={ e => editAlias(e.target.value) } />
				}
				

				{/* Type */ }
				{
					tag.dtype === EnumTagType.SCHEMA
						? <div className={ `basis-1/2 p-2 ml-2 font-mono font-bold text-${ color }-${ magnitude } border border-solid border-transparent` }>{ tag.dtype }</div>
						: <DropdownDType tag={ tag } callback={ editType } />
				}

				{/* Expand/collapse icon */ }
				<div className="mt-auto mb-auto ml-2">
					{
						mode === "simple"
							? (
								<PlusIcon className={ `w-6 h-6 text-${ color }-300 hover:text-${ color }-500 cursor-pointer` } onClick={ e => setMode("advanced") } />
							) : (
								<MinusIcon className={ `w-6 h-6 text-${ color }-300 hover:text-${ color }-500 cursor-pointer` } onClick={ e => setMode("simple") } />
							)
					}
				</div>
				{
					tag.dtype === EnumTagType.SCHEMA
						? null
						: (
							<div className="mt-auto mb-auto">
								<TrashIcon className={ `w-6 h-6 ml-2 text-gray-300 hover:text-gray-500 cursor-pointer` } onClick={ e => removeTag() } />
							</div>
						)
				}
			</div>
			{
				mode === "advanced"
					? <DetailBar tag={ tag } />
					: null
			}
		</div >
	);
};

export default InfoBar;