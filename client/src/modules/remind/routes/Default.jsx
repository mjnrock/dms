import React from "react";

import { Node } from "./../lib/Node";
import { Item } from "./../lib/Item";
import { ItemGroup } from "./../lib/ItemGroup";
import { ItemCollection } from "../lib/ItemCollection";

import { Item as SysItem } from "../systems/Item";
import { ItemGroup as SysItemGroup } from "./../systems/class/ItemGroup";
import { ItemCollection as SysItemCollection } from "./../systems/class/ItemCollection";
import { Status as SysStatus } from "./../systems/Status";
import { Ref as SysRef } from "./../systems/Ref";

import { Create as ComponentItem } from "./../components/Item";
import { Create as ComponentStatus } from "./../components/Status";

import { Item as ItemJSX } from "./../react/components/Item";

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

const baseItemCollection = new ItemCollection({
	// register: [],
	factory: {
		Item,
		ItemGroup,
		ItemCollection,
	},
	systems: {
		Item: SysItem,
		ItemGroup: SysItemGroup,
		ItemCollection: SysItemCollection,
	},
	components: {
		Item: ComponentItem,
		Status: ComponentStatus,
	},
	jsx: {
		Item: ItemJSX,
	},
});

const [ baseItem ] = baseItemCollection.state.factory.Item(1, {
	shared: {
		item: {
			title: `Meow`,
			content: `**woof**`,
		},
		status: {
			complete: false,
		},
	},
});
const [ baseItem2 ] = baseItemCollection.state.factory.Item(1, {
	shared: {
		item: {
			content: `# Hello World`,
		},
		status: {
			complete: true,
		},
		ref: {
			id: baseItem.id,
		},
	},
});

const [ baseItemGroup ] = baseItemCollection.state.factory.ItemGroup(1, {
	parent: null,
	children: [
		baseItem,
		baseItem2,
	],
	shared: {
		item: {
			title: `Gr00p`,
		},
	},
});

SysItemCollection.register(baseItemCollection, baseItem);
SysItemCollection.register(baseItemCollection, baseItem2);
SysItemCollection.register(baseItemCollection, baseItemGroup);


// console.log(baseItem.toObject());
// console.log(baseItem);
// console.log(baseItem2);
// let item = baseItem2.toObject();
// console.log(Item.Generate(item));

// console.log(SysRef.fetch(Item.Generate(baseItem.toObject()), baseItemCollection));
// console.log(SysRef.fetch(Item.Generate(baseItem2.toObject()), baseItemCollection));


// console.log(baseItem.toString());
// console.log(baseItemGroup.toObject());
// console.log(baseItemGroup.toString());
// console.log(baseItemCollection.toObject());
// console.log(baseItemCollection.toString());

export const RemindContext = React.createContext();

export function Default() {
	let registry = [ ...baseItemCollection.state.registry.values() ];

	return (
		<RemindContext.Provider value={ { stub: true } }>
			<div className="m-2">
				{/* <ItemJSX item={ baseItemGroup } /> */ }
				<ItemJSX item={ registry[ 2 ] } />
			</div>
		</RemindContext.Provider>
	);
};

export default Default;