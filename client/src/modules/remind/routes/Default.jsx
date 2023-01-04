import { Item as ItemJSX } from "./../react/components/Item";

import { Node } from "./../lib/Node";
import { Item } from "./../lib/Item";
import { ItemGroup } from "./../lib/ItemGroup";


const exampleMarkdown = `
A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
| 123 | 423 |
`;

const baseItem = new Item({
	state: exampleMarkdown,
	shared: {
		complete: false,
	},
});
const baseItem2 = new Item({
	state: exampleMarkdown,
	shared: {
		complete: false,
	},
});

const baseItemGroup = new ItemGroup({
	parent: null,
	children: [
		baseItem,
		baseItem2,
	],
	shared: {
		complete: false,
	},
});

console.log(baseItem);
console.log(baseItemGroup);

export function Default() {
	return (
		<div>
			<ItemJSX item={ baseItemGroup } />
		</div >
	);
};

export default Default;