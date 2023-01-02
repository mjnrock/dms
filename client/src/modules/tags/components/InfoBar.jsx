import { useState, useEffect } from "react";
import { Bars3Icon, PlusIcon, MinusIcon, TrashIcon, ArrowUturnUpIcon } from "@heroicons/react/24/outline";
import { useDrag } from "react-dnd";

import Builder from "./../lib/controllers/Builder";
import { EnumTagType } from "./../lib/tags/Tag";

import { DropdownDType } from "./DropdownDType";
import { DetailBar } from "./DetailBar";

import { TypeColor } from "./EnumTypeColor";
export const EnumDragType = {
	TAG: "tag",
};


export function InfoBar({ tag, parent, ondrag }) {
	const [ mode, setMode ] = useState("simple");	// String version of "isExpanded", allowing for more nuanced states
	const [ { isDragging }, drag ] = useDrag(
		() => ({
			type: EnumDragType.TAG,
			item: { tag },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
			end: () => ondrag(false),
		}), [ tag ]);

	useEffect(() => {
		ondrag(isDragging);
	}, [ isDragging ]);

	let [ color, magnitude ] = TypeColor(tag.type);
	magnitude += 100;

	function editAlias(alias) {
		tag.alias = alias;
	}
	function editType(type) {
		parent.replaceChild(tag, Builder.Factory(type, null, {
			alias: tag.alias,
		}));
	}
	function removeTag(mergeUp = false) {
		if(mergeUp) {
			if(tag.type === EnumTagType.COMPOUND) {
				parent.replaceChildAt(tag, ...tag.value);
			}
		} else {
			parent.removeChild(tag);
		}
	}

	//NOTE: The `tag.type === EnumTagType.GROUP` enforce "no change" rules for the root group tag
	//FIXME: When you replace a tag, the React is not connecting the new Component correctly, causing missed updates and errors
	const opacity = isDragging ? 0 : 1;
	return (
		<div className="flex flex-col" style={ { opacity } }>
			<div className="flex flex-row">
				{/* Reorder handle icon */ }
				{
					tag.type !== EnumTagType.GROUP
						? (
							<div className="mt-auto mb-auto" ref={ (node) => drag(node) }>
								<Bars3Icon className={ `w-6 h-6 text-${ color }-400 cursor-grab` } />
							</div>
						) : null
				}

				{/* Alias */ }
				<input className={ `basis-1/2 ml-2 p-2 border rounded border-transparent hover:rounded hover:border hover:border-${ color }-${ 200 } hover:rounded` } value={ tag.alias } onChange={ e => editAlias(e.target.value) } />


				{/* Type */ }
				{
					tag.type === EnumTagType.GROUP
						? <div className={ `basis-1/2 p-2 ml-2 font-mono font-bold text-${ color }-${ magnitude } border border-solid border-transparent` }>{ tag.type }</div>
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
					tag.type === EnumTagType.COMPOUND
						? (
							<div className="mt-auto mb-auto">
								<ArrowUturnUpIcon className={ `w-6 h-6 ml-2 text-gray-300 hover:text-gray-500 cursor-pointer` } onClick={ e => removeTag(true) } />
							</div>
						)
						: null
				}
				{
					tag.type === EnumTagType.GROUP
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