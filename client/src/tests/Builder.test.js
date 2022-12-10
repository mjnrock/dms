

/**
 * IDEA: Stop going back and forth on ideations -- the *poinnt* is to have minimal data structures persisted, and Nodes are the mutators/in-memory wrappers.
 */
// let tag = Builder.FromArrayObject([
// 	[ "string", "meow", { alias: "CaTz" } ],
// 	[ "int8", 69, { alias: "InT8s" } ],
// 	[ "bool", true, { alias: "BoOlZ" } ],
// 	[ "array", [
// 		[ "string", "meow.cat1", { alias: "MeOw1" } ],
// 		[ "string", "meow.cat2", { alias: "MeOw2" } ],
// 		[ "array", [
// 			[ "char", "meow.cat1.catzz1", { alias: "MeOw1.catzz1" } ],
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
// let tag = Builder.FromAliasSchema({
// 	terrain: {
// 		type: "string",
// 		weight: "int8",
// 		edgeMask: "uint8",
// 	},
// }, false);

// let tag = tagArr;