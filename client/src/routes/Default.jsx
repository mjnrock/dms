import { Node } from "./../lib/dms/Node";
// import { FormControlInput } from "./../components/form/FormControlInput";
// import { FormControl } from "./../lib/dms/form/FormControl";
import { TagString } from "./../lib/dms/tags/TagString";
// import { TagInt8 } from "./../lib/dms/tags/TagInt8";

// const formControl = new FormControl(
// 	FormControl.EnumFormControlType.INPUT,
// 	new TagString("meow"),
// 	{
// 		config: {
// 			inputType: "text",
// 		},
// 	},
// );

const tagStr = new TagString("meow");

tagStr.events.on("update", ({ module, current, previous }) => {
	console.log(`@UPDATE(${ module }):`, current, "->", previous);
});

console.log(tagStr.value)
tagStr.value = "woof";
tagStr.update("fash");
console.log(tagStr.value)

// const node = new Node({
// 	state: 12354,
// 	reducers: [
// 		({ node, current, next }, a1, ...rest) => {
// 			console.log("REDUCED", next, current, a1);
// 			return next + a1;
// 		},
// 		({ node, current, next }, a1, ...rest) => {
// 			console.log("REDUCED", next, current, a1);
// 			return next + a1;
// 		},
// 	],
// 	sharedReducers: {
// 		// //* Alternative way to add state reducers
// 		// state: [
// 		// 	({ node, current, next }, a1, ...rest) => {
// 		// 		console.log("REDUCED", next, current, a1);
// 		// 		return next + a1;
// 		// 	},
// 		// 	({ node, current, next }, a1, ...rest) => {
// 		// 		console.log("REDUCED", next, current, a1);
// 		// 		return next + a1;
// 		// 	},
// 		// ],
// 		meow: [
// 			({ node, current, next }, a1, ...rest) => {
// 				console.log("MEOWED", next, current, a1);
// 				return next * a1;
// 			},
// 			({ node, current, next }, a1, ...rest) => {
// 				console.log("MEOWED", next, current, a1);
// 				return next * a1;
// 			},
// 		],
// 	}
// });

// console.log(node);

// console.log(node.state);
// node.update(123);
// console.log(node.state);
// node.emit("@state", 567);	// Verify that command events are handled correctly
// console.log(node.state);

// node.current("meow", 5);
// console.log(node.current("meow"));
// node.sharedUpdate("meow", 987);
// console.log(node.current("meow"));

export function Default() {
	return (
		<>
			Meow
			{/* <button onClick={ e => console.log(formControl.state[ 0 ].value) }>Log</button>
			<FormControlInput tag={ formControl } /> */}
		</>
	);
};

export default Default;