import { useState, useEffect } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { CreateSampleTag } from "../routines/testing/CreateSampleTag";
import { Meta as MiniViewMeta } from "./../components/MiniViewMeta";
import { Meta as EditMeta } from "./../components/EditMeta";
import useTagEvent from "../lib/react/useTagEvent";

let baseTag = CreateSampleTag();

export function Default() {
	const tag = baseTag;
	const { prop, current, previous } = useTagEvent(`update`, tag);

	return (
		<DndProvider backend={ HTML5Backend }>
			<div className={ `w-full` }>
				<MiniViewMeta tag={ tag } size={ 35 } />
			</div>

			<div className={ `` }>
				<EditMeta tag={ tag } />

				<pre>
					{
						//TODO: Create a KVP filter selector to dynamically display selected keys (also show children always, not just when `value` is added)
						JSON.stringify(tag.toKVP(`id`, `alias`, `type`, `value`), null, 2)
						// JSON.stringify(tag.toKVP(`alias`, `type`, `value`), null, 2)
					}
				</pre>
			</div>
		</DndProvider>
	);
};

export default Default;