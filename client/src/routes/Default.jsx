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
import { Schema, SchemaVariant } from "./../components/io/tag/Schema";

import { Edit } from "../components/schema/Edit";
import { objectToNestedEntries, objectToNamespaceObject, objectToNamespaceEntries } from "./../util/helper";

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

let baseSchema = {
	CaTz: "string",
	InT8s: "int8",
	GrOuP: {
		MeOw1: "string",
		MeOw2: "string",
		gROUp2: {
			CaTz2: "string",
			InT8s2: "int8",
			GrOuP22: {
				MeOw122: "string",
				MeOw222: "string",
			},
		}
	},
};

console.log(objectToNamespaceObject(baseSchema));
console.log(objectToNestedEntries(baseSchema));
console.log(objectToNamespaceEntries(baseSchema));

export function Default() {
	const [ schema, setSchema ] = useState(baseSchema);
	const [ isEditingData, setIsEditingData ] = useState(false);
	const [ isEditingMeta, setIsEditingMeta ] = useState(false);

	/**
	 * TODO:
	 * ->First map to entries, and link edits to an index number (this avoids potential runtime-level issues with aliasing, e.g. Phone, Phone2 -- if you delete the 2, it'll delete Phone and replace with changes)
	 * ->When "Enter" is pressed for @alias, update the alias at that namespace/alias
	 * -> When "onChange" for @type, update the type at that namespace/alias
	 * --> If the new type is an "array" or "object", then add a section below to add children
	 * ---> If remove a child, remove it from the schema; if remove a parent, remove all children from the schema
	 */
	let base = objectToNestedEntries(schema);
	function onEditSchema(changeType, namespace, newValue, parent = {}) {
		for(let [ key, value ] of base) {
			if(key === namespace) {
				if(changeType === "type") {
					value[1] = newValue;
				} else if(changeType === "alias") {
					value[0] = newValue;
				}
			}
		}

		// setSchema(schema);
	}

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

			<Edit schema={ schema } onChange={ onEditSchema } />

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