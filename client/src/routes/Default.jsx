import { useState, useEffect } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { CreateSampleTag } from "../routines/testing/CreateSampleTag";
import { Meta as MiniViewMeta } from "./../components/MiniViewMeta";
import { Meta as EditMeta } from "./../components/EditMeta";
import { Meta as ViewMeta } from "./../components/ViewMeta";
import { useTagEvent } from "../lib/react/useTagEvent";

let baseTag = CreateSampleTag();

export function Default() {
	const tag = baseTag;
	const { prop, current, previous } = useTagEvent(`update`, tag);

	return (
		<DndProvider backend={ HTML5Backend }>
			<div className={ `p-2` }>
				<div className="flex flex-row">
					<div className="flex flex-col basis-full">
						<div className={ `` }>
							<MiniViewMeta tag={ tag } size={ 35 } displayGroup={ true } />
						</div>

						<div className={ `border border-solid border-neutral-100 mt-2 mb-1` } />

						<div className="flex flex-row">
							<div className="basis-1/4">
								<ViewMeta tag={ tag } solid={ false } />
							</div>
							<div className="basis-3/4">
								<EditMeta tag={ tag } />
							</div>
						</div>
					</div>
				</div>

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