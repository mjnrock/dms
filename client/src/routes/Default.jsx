import { useState, useEffect } from "react";
import { LockOpenIcon, LockClosedIcon, CommandLineIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

import { Tag } from "../lib/dms/tags/Tag";
import { TagString } from "../lib/dms/tags/TagString";
import { TagBoolean } from "../lib/dms/tags/TagBoolean";
import { TagCharacter } from "../lib/dms/tags/TagCharacter";
import { TagArray } from "../lib/dms/tags/TagArray";
import { TagInt8 } from "../lib/dms/tags/TagInt8";
import { TagUint8 } from "../lib/dms/tags/TagUint8";
import { TagGroup } from "../lib/dms/tags/TagGroup";
import { TagNamespace } from "../lib/dms/tags/TagNamespace";

import { ChildFinder } from "../lib/dms/tags/controller/ChildFinder";
import { Builder } from "../lib/dms/tags/controller/Builder";

import IOTags from "../components/io/tag/package";
import IOSchema from "../components/io/schema/package";

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

// let baseTag = [
// 	tagChar,
// 	// tagArr,
// 	tagGroup,
// ];
// let baseTag = new TagGroup([
let baseTag = new TagNamespace("root", [
	tagChar,
	// tagArr,
	tagGroup,
], {
	alias: "root",
});

export function Default() {
	const [ tag, setTag ] = useState(baseTag);
	const [ isEditingData, setIsEditingData ] = useState(false);
	const [ isEditingMeta, setIsEditingMeta ] = useState(false);

	return (
		<>
			<h1 className="text-2xl font-bold text-center">Meta</h1>
			<div className="flex">
				<div onClick={ e => setIsEditingMeta(!isEditingMeta) } className="w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer">
					{
						isEditingMeta
							? <LockOpenIcon className="text-red-500" />
							: <LockClosedIcon className="text-green-500" />
					}
				</div>
				<div onClick={ e => console.log(tag) } className="w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer">
					<CommandLineIcon className="text-gray-800" />
				</div>
				<div onClick={ e => console.log(tag.toObject()) } className="w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer">
					<CodeBracketIcon className="text-gray-600" />
				</div>
			</div>
			{
				Array.isArray(tag)
					? (
						<div key={ tag.id } className={ `flex flex-col mt-4 m-2 border-2 border-gray-600 border-solid rounded` }>
							{
								tag.map(t => IOSchema.Factory(t, { verbose: true, isEditing: isEditingData }))
							}
						</div>
					)
					: IOSchema.Factory(tag, { verbose: true, isEditing: isEditingData })
			}

			<br />
			<hr />
			<br />

			<h1 className="text-2xl font-bold text-center">Data</h1>
			<div className="flex">
				<div onClick={ e => setIsEditingData(!isEditingData) } className="w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer">
					{
						isEditingData
							? <LockOpenIcon className="text-red-500" />
							: <LockClosedIcon className="text-green-500" />
					}
				</div>
				<div onClick={ e => console.log(tag) } className="w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer">
					<CommandLineIcon className="text-gray-800" />
				</div>
				<div onClick={ e => console.log(tag.toObject()) } className="w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer">
					<CodeBracketIcon className="text-gray-600" />
				</div>
			</div>
			{
				Array.isArray(tag)
					? (
						<div key={ tag.id } className={ `flex flex-col mt-4 m-2 border-2 border-gray-600 border-solid rounded` }>
							{
								tag.map(t => IOTags.Factory(t, { verbose: true, isEditing: isEditingData }))
							}
						</div>
					)
					: IOTags.Factory(tag, { verbose: true, isEditing: isEditingData })
			}
		</>
	);
};

export default Default;