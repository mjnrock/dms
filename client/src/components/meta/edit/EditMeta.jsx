import { useTagEvent } from "../../../lib/dms/react/useTagEvent";
import { useDrop } from "react-dnd";

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
	[ EnumTagType.NAMESPACE, [ "neutral", 300 ] ],
	[ EnumTagType.INT8, [ "blue", 200 ] ],
	[ EnumTagType.STRING, [ "red", 200 ] ],
	[ EnumTagType.UINT8, [ "teal", 200 ] ],
	[ EnumTagType.SCHEMA, [ "neutral", 600 ] ],
]);

export const EnumDragType = {
	TAG: "tag",
};

export function DragContainer({ tags, children }) {
	const [ , drop ] = useDrop(() => ({ accept: EnumDragType.TAG }));

	return (
		<div ref={ drop }>
			{ children }
		</div>
	);
};

export function Meta({ tag, parent }) {
	const { prop, current, previous } = useTagEvent("modify", tag);

	const [ , drop ] = useDrop(
		() => ({
			accept: EnumDragType.TAG,
			hover({ tag: draggedTag }) {
				if(parent) {
					parent.swapIndex(draggedTag, tag);
				}
			},
		}), [ tag ]);

	let [ color, magnitude ] = EnumTypeColor.get(tag.dtype);

	return (
		<div
			ref={ (node) => drop(node) }
			className={ `m-2 p-2 border border-l-4 border-${ color }-200 hover:border-${ color }-400 border-solid rounded flex flex-col shadow-md` }
		>
			<InfoBar tag={ tag } parent={ parent } />
			<>
				<DragContainer>
					{
						[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE, EnumTagType.SCHEMA ].includes(tag.dtype)
							? tag.state.map((child, index) => {
								return (
									<Meta key={ `meta:${ child.id }` } tag={ child } parent={ tag } />
								);
							}) : null
					}
				</DragContainer>
			</>
			<>
				{

					[ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE, EnumTagType.SCHEMA ].includes(tag.dtype)
						? (
							<DropdownDType
								tag={ tag }
								callback={ dtype => {
									tag.addChild(Builder.Factory(dtype, null, {
										alias: true,
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