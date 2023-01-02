import { useState } from "react";
import { useDrop } from "react-dnd";
import { useTagEvent } from "./../lib/react/useTagEvent";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import { EnumTagType } from "./../lib/tags/Tag";
import Builder from "./../lib/controllers/Builder";

import { DropdownDType } from "./DropdownDType";
import { InfoBar } from "./InfoBar";

import { TypeColor } from "./EnumTypeColor";

export const EnumDragType = {
	TAG: "tag",
};

export function Meta({ tag, parent }) {
	const { prop, current, previous } = useTagEvent("update", tag);

	const [ isDragging, setIsDragging ] = useState(false);
	const [ , drop ] = useDrop(
		() => ({
			accept: EnumDragType.TAG,
			hover({ tag: draggedTag }) {
				if(parent) {
					parent.swapChildren(draggedTag, tag);
				}
			},
		}), [ tag ]);

	let [ color, magnitude ] = TypeColor(tag.type);

	if(isDragging) {
		return (
			<div className={ `h-[60px] m-2 p-2 border border-l-4 border-${ color }-200 hover:border-${ color }-400 border-solid rounded flex flex-col shadow-md bg-${ color }-100` } />
		);
	}

	return (
		<div
			ref={ (node) => drop(node) }
			className={ `m-2 p-2 border border-l-4 border-${ color }-200 hover:border-${ color }-400 border-solid rounded flex flex-col shadow-md` }
		>
			<InfoBar tag={ tag } parent={ parent } ondrag={ v => setIsDragging(v) } />
			<>
				{
					/**
					 * FIXME: There is a 0-index initialization bug here
					 * If you try to move in/out of index=0, it will not work until
					 * the React component has been re-rendered at least once.
					 */
					[ EnumTagType.COMPOUND, EnumTagType.GROUP ].includes(tag.type)
						? tag.value.map((child, index) => {
							if(isDragging) {
								return null;
							}

							return (
								<Meta key={ `meta:${ child.id }` } tag={ child } parent={ tag } />
							);
						}) : null
				}
			</>
			<>
				{

					[ EnumTagType.COMPOUND, EnumTagType.GROUP ].includes(tag.type)
						? (
							<DropdownDType
								tag={ tag }
								callback={ type => {
									tag.addChild(Builder.Factory(type, null, {
										// opts
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