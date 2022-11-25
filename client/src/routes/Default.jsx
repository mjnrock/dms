import { Tag } from "./../lib/dms/tags/Tag";
import { TagString } from "./../lib/dms/tags/TagString";
import { TagArray } from "./../lib/dms/tags/TagArray";
import { TagInt8 } from "./../lib/dms/tags/TagInt8";
import { TagUint8 } from "./../lib/dms/tags/TagUint8";
import { TagCharacter } from "../lib/dms/tags/TagCharacter";

import { ChildFinder } from "../lib/dms/tags/controller/ChildFinder";
import { Builder } from "../lib/dms/tags/controller/Builder";

const tagStr = new TagString("meow", {
	alias: "strang",
	tags: [ "cat", "dog" ],
});
const tagInt8 = new TagInt8(69, {
	alias: "nambs",
	tags: [ "$$$", "cat" ],
});
const tagArr = new TagArray([ tagStr, tagInt8 ], {
	alias: "ARrAy"
});

let tag = Builder.ArraySchema([
	[ "string", "meow", { alias: "CaTz" } ],
	[ "int8", 69, { alias: "InT8s" } ],
	[ "array", [
		[ "string", "meow.cat1", { alias: "MeOw1" } ],
		[ "string", "meow.cat2", { alias: "MeOw2" } ],
	], { alias: "ArRaYz" } ],
]);

console.log(tag);
console.log(tag.toObject());

export function Default() {
	return (
		<>
			<div>{ tag.meta.alias }</div>
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
			{/* <button onClick={ e => console.log(formControl.state[ 0 ].value) }>Log</button>
			<FormControlInput tag={ formControl } /> */}
		</>
	);
};

export default Default;