import { useState, useEffect } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { CreateSampleTag, CreateSampleSchema } from "../routines/testing/SampleTags";
import { Meta as MiniViewMeta } from "./../components/MiniViewMeta";
import { Meta as EditMeta } from "./../components/EditMeta";
import { Meta as ViewMeta } from "./../components/ViewMeta";
import { useTagEvent } from "../lib/react/useTagEvent";

import Builder from "./../lib/controllers/Builder";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

//IDEA: As a general paradigm, TagSchema feels more appropriate than TagGroup for the root tag for DMS
// TagGroup should instead be returned to the idea of dynamic/programmatic/rule-based grouping of tags, whereas TagCompound is a static grouping of tags
/**
 * TagCompound - statically or dynamically defined grouping of tags (e.g. predefined List, functionally defined List, typed list, etc.)
 * 
 * These should be considered hyper tags:
 * TagNamespace - the main "hyper" meta-group tag, which is a purely definitional structure to represent namespaces
 * TagGroup - the main "hyper" group tag, allowing arbitrary grouping of tags
 * * Namespaces should be used more for general namespace-related groupings (e.g. domains and organizational structures), while Groups should be more implementation-specific (e.g. components within an Entity)
 * TagSchema - root tag for DMS, indicating that the tag contents represent a data model
 * TagRecord - a data record, indicating that the tag contents represent a data related to a schema
 */

function sendTagToServer(tag) {
	// console.log(Builder.ToAliasSchema(tag))
	fetch(`http://localhost:3001`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(Builder.ToAliasSchema(tag)),
	})
		.then(res => res.json())
		.then(res => console.log(res))
		.catch(err => console.error(err));
};

let baseTag = CreateSampleSchema();
console.log(Builder.ToAliasSchema(baseTag));
// let baseTag = CreateSampleTag();

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

						<div className={ `` }>
							<PaperAirplaneIcon className="text-gray-600 w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer" onClick={ e => sendTagToServer(tag) } />
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