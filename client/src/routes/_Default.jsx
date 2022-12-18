import { useState, useEffect } from "react";
import { LockOpenIcon, LockClosedIcon } from "@heroicons/react/24/outline";

import { Tag } from "../lib/dms/tags/Tag";
import { TagString } from "../lib/dms/tags/TagString";
import { TagBoolean } from "../lib/dms/tags/TagBoolean";
import { TagCharacter } from "../lib/dms/tags/TagCharacter";
import { TagArray } from "../lib/dms/tags/TagArray";
import { TagInt8 } from "../lib/dms/tags/TagInt8";
import { TagUint8 } from "../lib/dms/tags/TagUint8";

import { ChildFinder } from "../lib/dms/tags/controller/ChildFinder";
import { Builder } from "../lib/dms/tags/controller/Builder";

import IOTags from "../components/io/tag/package";
import { Schema } from "./../components/io/tag/Schema";

import { Edit } from "../components/schema/Edit";
import {
	objectToNestedEntries,
	nestedEntriesToObject,
	objectToNamespaceObject,
	namespaceObjectToObject,
	objectToNamespaceEntries,
	namespaceEntriesToObject,
} from "../util/helper";

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

let baseTag = Builder.FromAliasSchema(baseSchema, false);

console.log(objectToNamespaceObject(baseSchema));
console.log(namespaceObjectToObject(objectToNamespaceObject(baseSchema)));
console.log(objectToNestedEntries(baseSchema));
console.log(nestedEntriesToObject(objectToNestedEntries(baseSchema)));
console.log(objectToNamespaceEntries(baseSchema));
console.log(namespaceEntriesToObject(objectToNamespaceEntries(baseSchema)));

//FIXME: While these helper functions are great, the JSX state really needs to be a managed Tag, rather than an array or object; for many reasons -- don't overthink it, just use Tags and *display* the relevant parts

export function Default() {
	const [ tag, setTag ] = useState(baseTag);
	const [ schema, setSchema ] = useState(baseSchema);
	const [ isEditingData, setIsEditingData ] = useState(false);
	const [ isEditingMeta, setIsEditingMeta ] = useState(false);

	function onEditSchema(changeType, namespace, alias, newValue) {
		let base = objectToNamespaceObject(schema);

		if(changeType === "type") {
			if(newValue === "group") {
				base[ `${ namespace }${ alias }` ] = {
					[ `` ]: ``,
				};
			} else {
				base[ `${ namespace }${ alias }` ] = newValue;
			}
		} else if(changeType === "alias") {
			if(newValue === "group") {
				base[ `${ namespace }${ newValue }` ] = {
					[ `` ]: ``,
				};
			} else {
				base[ `${ namespace }${ newValue }` ] = base[ `${ namespace }${ alias }` ];
			}
			delete base[ `${ namespace }${ alias }` ];
		}


		setSchema(namespaceObjectToObject(base));
	};

	useEffect(() => {
		setTag(Builder.FromAliasSchema(schema, false));
	}, [ schema ]);

	//IDEA: The IOFactory generates the Tag Components correctly, but test if the components are getting recreated each refresh (not great) or if they persist (ideal)

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