import { useState } from "react";
import { LockOpenIcon, LockClosedIcon } from "@heroicons/react/24/outline";

import { Tag } from "./../lib/dms/tags/Tag";
import { TagString } from "./../lib/dms/tags/TagString";
import { TagBoolean } from "./../lib/dms/tags/TagBoolean";
import { TagCharacter } from "./../lib/dms/tags/TagCharacter";
import { TagArray } from "./../lib/dms/tags/TagArray";
import { TagInt8 } from "./../lib/dms/tags/TagInt8";
import { TagUint8 } from "./../lib/dms/tags/TagUint8";

import { ChildFinder } from "../lib/dms/tags/controller/ChildFinder";
import { Builder } from "../lib/dms/tags/controller/Builder";

import IOTags from "./../components/io/tag/package";
import { Schema } from "./../components/io/tag/Schema";

const tagStr = new TagString("meow", {
	alias: "strang",
	tags: [ "cat", "dog" ],
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
const tagArr = new TagArray([ tagStr, tagInt8, tagUint8, tagBool ], {
	alias: "ARrAy"
});

/**
 * IDEA: Stop going back and forth on ideations -- the *poinnt* is to have minimal data structures persisted, and Nodes are the mutators/in-memory wrappers.
 */
let tag = Builder.FromArrayObject([
	[ "string", "meow", { alias: "CaTz" } ],
	[ "int8", 69, { alias: "InT8s" } ],
	[ "bool", true, { alias: "BoOlZ" } ],
	[ "array", [
		[ "string", "meow.cat1", { alias: "MeOw1" } ],
		[ "string", "meow.cat2", { alias: "MeOw2" } ],
		[ "array", [
			[ "char", "meow.cat1.catzz1", { alias: "MeOw1.catzz1" } ],
			[ "uint8", 230, { alias: "MeOw2.catzz2" } ],
		], { alias: "ArRaYzzzz2z2z" } ],
	], { alias: "ArRaYz" } ],
]);
// let tag = Builder.FromAliasObject({
// 	CaTz: [ "string", "meow" ],
// 	InT8s: [ "int8", 69 ],
// 	ArRaYz: [ "array", {
// 		MeOw1: [ "string", "meow.cat1" ],
// 		MeOw2: [ "string", "meow.cat2" ],
// 	}],
// });
// let tag = Builder.FromAliasSchema({
// 	terrain: {
// 		type: "string",
// 		weight: "int8",
// 		edgeMask: "uint8",
// 	},
// }, false);

// let tag = tagArr;



export function Default() {
	const [ isEditingData, setIsEditingData ] = useState(false);
	const [ isEditingMeta, setIsEditingMeta ] = useState(false);

	return (
		<>
			<h1 className="text-2xl font-bold text-center">Meta</h1>
			<div onClick={ e => setIsEditingMeta(!isEditingMeta) } className="w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer">
				{
					isEditingMeta
						? <LockOpenIcon className="text-red-500" />
						: <LockClosedIcon className="text-green-500" />
				}
			</div>
			<Schema tag={ tag } />

			<br />
			<hr />
			<br />

			<h1 className="text-2xl font-bold text-center">Data</h1>
			<div onClick={ e => setIsEditingData(!isEditingData) } className="w-[32px] h-[32px] mt-auto mb-auto text-center cursor-pointer">
				{
					isEditingData
						? <LockOpenIcon className="text-red-500" />
						: <LockClosedIcon className="text-green-500" />
				}
			</div>
			{
				Array.isArray(tag)
					? tag.map(t => IOTags.Factory(t, { verbose: true, isEditing: isEditingData }))
					: IOTags.Factory(tag, { verbose: true, isEditing: isEditingData })
			}
		</>
	);
};

export default Default;