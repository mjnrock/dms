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

import Serializer from "../lib/dms/tags/controller/Serializer";

import { Meta } from "../components/Meta";
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

// console.table(Serializer.ToHierarchy(baseTag), [ "id", "pid", "alias", "dtype", "value", "path" ]);
// console.log(Serializer.ToHierarchyObject(baseTag));
// console.table(Serializer.ToHierarchyRecord(baseTag));
// console.log(Serializer.ToHierarchyRecordObject(baseTag));

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
				<CommandLineIcon className="text-gray-800 w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer" onClick={ e => console.log(tag) } />
				<CodeBracketIcon className="text-gray-600 w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer" onClick={ e => console.log(tag.toObject()) } />
			</div>
			{/* <IOSchema.Factory tag={ tag } isEditing={ isEditingMeta } />

			<br />
			<hr />
			<br /> */}

			<Meta tag={ tag } />

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
				<CommandLineIcon className="text-gray-800 w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer" onClick={ e => console.log(tag) } />
				<CodeBracketIcon className="text-gray-600 w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer" onClick={ e => console.log(tag.toObject()) } />
			</div>
			<IOTags.Factory tag={ tag } isEditing={ isEditingData } />
		</>
	);
};

export default Default;