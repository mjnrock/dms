import { useState, useEffect } from "react";
import { LockOpenIcon, LockClosedIcon, CommandLineIcon, CodeBracketIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Tag } from "../lib/dms/tags/Tag";
import { TagString } from "../lib/dms/tags/TagString";
import { TagBoolean } from "../lib/dms/tags/TagBoolean";
import { TagCharacter } from "../lib/dms/tags/TagCharacter";
import { TagArray } from "../lib/dms/tags/TagArray";
import { TagInt8 } from "../lib/dms/tags/TagInt8";
import { TagUint8 } from "../lib/dms/tags/TagUint8";
import { TagGroup } from "../lib/dms/tags/TagGroup";
import { TagNamespace } from "../lib/dms/tags/TagNamespace";
import { TagSchema } from "../lib/dms/tags/TagSchema";

import { Meta as EditMeta } from "../components/meta/edit/EditMeta";
import { Meta as ViewMeta } from "../components/meta/view/ViewMeta";
import { Meta as MiniViewMeta } from "../components/meta/view/MiniViewMeta";

import { Serializer } from "./../lib/dms/tags/controller/Serializer";
import Builder from "../lib/dms/tags/controller/Builder";

const tagStr = new TagString("meow", {
	alias: "strang",
	tags: [ "cat", "dog" ],
});
const tagChar = new TagCharacter("A", {
	alias: "chor",
	tags: [ "cat" ],
});
const tagBool = new TagBoolean(false, {
	alias: "boolz",
	tags: [ "wut" ],
});
const tagInt8 = new TagInt8(69, {
	alias: "nambs",
	tags: [ "$$$", "cat" ],
});
const tagUint8 = new TagUint8(230, {
	alias: "nambs22",
	tags: [ "$$$", "cat" ],
});
// const tagGroup = new TagGroup([ tagInt8, tagUint8 ], {
const tagGroup = new TagGroup([ tagStr, tagBool, tagInt8, tagUint8 ], {
	alias: "GrOuP"
});
// const tagArr = new TagArray([ tagStr, tagBool, tagGroup ], {
// 	alias: "ARrAy"
// });

let baseTag = new TagSchema([
	tagChar,
	// tagArr,
	tagGroup,
]);

/**
 * This currently sends the tag to the server, but is also is not very robust.
 */
function sendTagToServer(tag) {
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

export function Default() {
	const [ tag, setTag ] = useState(baseTag);
	const [ isEditingData, setIsEditingData ] = useState(false);
	const [ isEditingMeta, setIsEditingMeta ] = useState(false);

	return (
		<DndProvider backend={ HTML5Backend }>
			<h1 className="text-2xl font-bold text-center">Meta</h1>
			<div className="flex">
				<div onClick={ e => setIsEditingMeta(!isEditingMeta) } className="w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer">
					{
						isEditingMeta
							? <LockOpenIcon className="text-red-500" />
							: <LockClosedIcon className="text-green-500" />
					}
				</div>
				<CommandLineIcon className="text-gray-800 w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer" onClick={ e => console.log(tag) } />
				<CodeBracketIcon className="text-gray-600 w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer" onClick={ e => console.table(Serializer.ToHierarchy(tag)) } />
				<PaperAirplaneIcon className="text-gray-600 w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer" onClick={ e => sendTagToServer(tag) } />
			</div>

			{/* TODO: Overall this is good, but it doesn't yet resolve name collisions (i.e. no uniqueness check on aliases) */ }
			<br />
			<hr />
			<br />
			<h3 className="text-lg font-bold text-center">Edit the Tag Meta</h3>
			<EditMeta tag={ tag } />

			<br />
			<hr />
			<br />
			<h3 className="text-lg font-bold text-center">View the Tag Meta</h3>
			<ViewMeta tag={ tag } />

			<br />
			<hr />
			<br />
			<h3 className="text-lg font-bold text-center">View the Mini Tag Meta</h3>
			<div className="">
				<MiniViewMeta tag={ tag } size={ 24 } className={ `m-2 p-1 border border-b-2 border-solid border-neutral-200 rounded shadow` } />
				<MiniViewMeta isVertical={ false } tag={ tag } size={ 24 } className={ `m-2 p-1 border border-b-2 border-solid border-neutral-200 rounded shadow` } />
			</div>

			{/* TODO: Rebuild the Data edit/view components */ }
			{/* TODO: Build a repository system and a "record" concept so that data entries can be persisted/retrieved */ }
			{/* TODO: Establish a standard list of meta options/config for a given Tag (e.g. Required, Nullable, etc.) */ }
		</DndProvider>
	);
};

export default Default;