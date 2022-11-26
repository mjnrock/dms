import { Tag } from "./../lib/dms/tags/Tag";
import { TagString } from "./../lib/dms/tags/TagString";
import { TagArray } from "./../lib/dms/tags/TagArray";
import { TagInt8 } from "./../lib/dms/tags/TagInt8";
import { TagUint8 } from "./../lib/dms/tags/TagUint8";
import { TagCharacter } from "../lib/dms/tags/TagCharacter";

import { ChildFinder } from "../lib/dms/tags/controller/ChildFinder";
import { Builder } from "../lib/dms/tags/controller/Builder";

import TagStringJSX from "./../components/tag/TagString";
import TagInt8JSX from "./../components/tag/TagInt8";
import TagUint8JSX from "./../components/tag/TagUint8";

const tagStr = new TagString("meow", {
	alias: "strang",
	tags: [ "cat", "dog" ],
});
const tagInt8 = new TagInt8(69, {
	alias: "nambs",
	tags: [ "$$$", "cat" ],
});
const tagUint8 = new TagUint8(230, {
	alias: "nambs22",
	tags: [ "$$$", "cat" ],
});
const tagArr = new TagArray([ tagStr, tagInt8 ], {
	alias: "ARrAy"
});

// let tag = Builder.FromArraySchema([
// 	[ "string", "meow", { alias: "CaTz" } ],
// 	[ "int8", 69, { alias: "InT8s" } ],
// 	[ "array", [
// 		[ "string", "meow.cat1", { alias: "MeOw1" } ],
// 		[ "string", "meow.cat2", { alias: "MeOw2" } ],
// 		[ "array", [
// 			[ "string", "meow.cat1.catzz1", { alias: "MeOw1.catzz1" } ],
// 			[ "uint8", 230, { alias: "MeOw2.catzz2" } ],
// 		], { alias: "ArRaYzzzz2z2z" } ],
// 	], { alias: "ArRaYz" } ],
// ]);
// let tag = Builder.FromAliasObject({
// 	CaTz: [ "string", "meow" ],
// 	InT8s: [ "int8", 69 ],
// 	ArRaYz: [ "array", {
// 		MeOw1: [ "string", "meow.cat1" ],
// 		MeOw2: [ "string", "meow.cat2" ],
// 	}],
// });
let tag = Builder.FromAliasSchema({
	terrain: {
		type: "string",
		weight: "int8",
		edgeMask: "uint8",
	},
});

export function Default() {
	return (
		<>
			<TagStringJSX tag={ tagStr } />
			<hr />
			<TagStringJSX tag={ tagStr } isEditing={ true } />
			<button onClick={ e => console.log(tagStr.value)} >Log</button>

			<TagInt8JSX tag={ tagInt8 } />
			<hr />
			<TagInt8JSX tag={ tagInt8 } isEditing={ true } />
			<button onClick={ e => console.log(tagInt8.value)} >Log</button>

			<TagUint8JSX tag={ tagUint8 } />
			<hr />
			<TagUint8JSX tag={ tagUint8 } isEditing={ true } />
			<button onClick={ e => console.log(tagUint8.value)} >Log</button>

			<hr />

			<pre>
				{ JSON.stringify(tag.toObject(false), null, 2) }
				{/* { JSON.stringify(tag.toObject(true), null, 2) } */ }
			</pre>

			<div>{ tag.meta.alias }</div>
			<div>
				{
					tag.value.map((tag, i) => {
						//FIXME: Need a recursive component to properly render this
						return (
							<div key={ i }>
								{ tag.meta.alias }: { tag.toString() }
							</div>
						);
					})
				}
			</div>

			{/* <button onClick={ e => console.log(formControl.state[ 0 ].value) }>Log</button>
			<FormControlInput tag={ formControl } /> */}
		</>
	);
};

export default Default;