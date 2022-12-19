import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

import { EnumTagType } from "./../../../lib/dms/tags/Tag";
import { TypeToClass } from "./../../../lib/dms/tags/controller/Builder";

import { Schema } from "./Schema";

export const EnumTypeColor = new Map([
	[ EnumTagType.ANY, `gray-200` ],
	[ EnumTagType.ARRAY, `gray-200` ],
	[ EnumTagType.BOOLEAN, `purple-200` ],
	[ EnumTagType.CHARACTER, `orange-200` ],
	[ EnumTagType.GROUP, `gray-400` ],
	[ EnumTagType.NAMESPACE, `neutral-600` ],
	[ EnumTagType.INT8, `blue-200` ],
	[ EnumTagType.STRING, `red-200` ],
	[ EnumTagType.UINT8, `teal-200` ],
]);

/**
 * This adds a "Add Child Tag" button that will add a new tag to the parent tag
 */
export function AddChild({ tag }) {
	function addChildByType(dtype, alias) {
		let clazz = TypeToClass.get(EnumTagType[ dtype ]);

		console.log(!!clazz, tag, dtype, alias);

		if(clazz) {
			let newTag = new clazz(null, {
				alias,
			});

			tag.addChild(newTag);
		}
	};

	return (
		<>
			<div className="flex flex-row">
				<PlusIcon className="text-gray-600 w-[32px] h-[32px] mt-auto mb-auto text-center" />
				<select onChange={ e => addChildByType(e.target.value, Math.random()) } value="">
					<option value="" disabled hidden>Add Child Tag</option>
					{
						Object.keys(EnumTagType).sort()
							//STUB: Only here until these are implemented
							.filter(v => ![
								`ANY`,
								`NAMESPACE`,
								`SCHEMA`,
							].includes(v))
							.map(key => {
								return (
									<option key={ key } value={ key }>{ key }</option>
								);
							})
					}
				</select>
			</div>
		</>
	);
}

export function Factory({ tag, ...props }) {
	const [ value, setValue ] = useState({});

	useEffect(() => {
		let fn = ({ prop, current, previous } = {}) => {
			// console.log("DO SOMETHING HERE", prop, current, previous);
			setValue({
				...value,
				[ prop ]: current,
			});
		};
		tag.events.on("modify", fn);

		return () => tag.events.off("modify", fn);
	}, []);

	let jsx = null,
		isGroupingTag = [ EnumTagType.ARRAY, EnumTagType.GROUP, EnumTagType.NAMESPACE ].includes(tag.dtype);

	if(isGroupingTag) {
		jsx = (
			<div className={ `flex flex-col border-2 border-gray-400 border-solid rounded` }>
				<Schema tag={ tag } color={ EnumTypeColor.get(tag.dtype) } />

				<div className="flex flex-col ml-4">
					{
						tag.state.map(child => <Factory key={ child.id } tag={ child } isEditing={ props.isEditing } />)
					}
					<AddChild tag={ tag } />
				</div>
			</div>
		);
	} else {
		jsx = (
			<Schema tag={ tag } color={ EnumTypeColor.get(tag.dtype) } />
		);
	}

	return (
		<div key={ `schema:${ tag.id }` }>
			{
				jsx
			}
		</div>
	);
};

export default {
	Schema,

	Factory,
};