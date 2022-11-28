import { useState } from "react";

import { Tag } from "./../lib/dms/tags/Tag";
import { TagString } from "./../lib/dms/tags/TagString";
import { TagBoolean } from "./../lib/dms/tags/TagBoolean";
import { TagCharacter } from "../lib/dms/tags/TagCharacter";
import { TagArray } from "./../lib/dms/tags/TagArray";
import { TagInt8 } from "./../lib/dms/tags/TagInt8";
import { TagUint8 } from "./../lib/dms/tags/TagUint8";

import { ChildFinder } from "../lib/dms/tags/controller/ChildFinder";
import { Builder } from "../lib/dms/tags/controller/Builder";

import MetaTagJSX from "../components/io/tag/MetaTag";
import TagStringJSX from "../components/io/tag/TagString";
import TagInt8JSX from "../components/io/tag/TagInt8";
import TagUint8JSX from "../components/io/tag/TagUint8";
import TagBooleanJSX from "../components/io/tag/TagBoolean";
import IOTags from "../components/io/tag/package";

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

let tag = Builder.FromArrayObject([
	[ "string", "meow", { alias: "CaTz" } ],
	[ "int8", 69, { alias: "InT8s" } ],
	[ "array", [
		[ "string", "meow.cat1", { alias: "MeOw1" } ],
		[ "string", "meow.cat2", { alias: "MeOw2" } ],
		[ "array", [
			[ "string", "meow.cat1.catzz1", { alias: "MeOw1.catzz1" } ],
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
	const [ isEditing, setIsEditing ] = useState(false);

	return (
		<>
			{/* <TagStringJSX tag={ tagStr } />
			<hr />
			<TagStringJSX tag={ tagStr } isEditing={ true } />
			<button onClick={ e => console.log(tagStr.value) } >Log</button>

			<TagInt8JSX tag={ tagInt8 } />
			<hr />
			<TagInt8JSX tag={ tagInt8 } isEditing={ true } />
			<button onClick={ e => console.log(tagInt8.value) } >Log</button>

			<TagUint8JSX tag={ tagUint8 } />
			<hr />
			<TagUint8JSX tag={ tagUint8 } isEditing={ true } />
			<button onClick={ e => console.log(tagUint8.value) } >Log</button>

			<TagBooleanJSX tag={ tagBool } />
			<hr />
			<TagBooleanJSX tag={ tagBool } isEditing={ true } />
			<button onClick={ e => console.log(tagBool.value) } >Log</button>

			<hr /> */}

			{
				Array.isArray(tag)
					? tag.map(t => IOTags.Factory(t, { verbose: true, isEditing }))
					: IOTags.Factory(tag, { verbose: true, isEditing })
			}
			{/* <MetaTagJSX tag={ tag } verbose={ false } /> */ }
		</>
	);
};

export default Default;