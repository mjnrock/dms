import React from "react";

import { Test } from "../react/components/$Test";

import { Node } from "./../lib/Node";
import { Item } from "./../lib/Item";
import { ItemGroup } from "./../lib/ItemGroup";
import { ItemCollection } from "../lib/ItemCollection";
import { Registry } from "../lib/Registry";

import { Item as SysItem } from "../systems/Item";
import { ItemGroup as SysItemGroup } from "./../systems/class/ItemGroup";
import { ItemCollection as SysItemCollection } from "./../systems/class/ItemCollection";
import { Status as SysStatus } from "./../systems/Status";
import { Ref as SysRef } from "./../systems/Ref";
import { Checklist as SysChecklist } from "./../systems/Checklist";

import { Create as ComponentItem } from "./../components/Item";
import { Create as ComponentStatus } from "./../components/Status";
import { Create as ComponentChecklist } from "./../components/Checklist";

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

const [ baseItem ] = baseItemCollection.state.factory.Item({
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
const [ baseItem2, baseItem3 ] = baseItemCollection.state.factory.Item([
	{
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
	},
	{
		shared: {
			item: {
				content: 
`This is *some* nonsense.

# this is a header

this is some **more** ~nonsense~`,
			},
			status: {
				complete: true,
			},
			ref: {
				id: baseItem.id,
			},
		},
	},
]);
// const [ baseItem2, baseItem3 ] = baseItemCollection.state.factory.Item(2, {
// 	shared: {
// 		item: {
// 			content: `# Hello World`,
// 		},
// 		status: {
// 			complete: true,
// 		},
// 		ref: {
// 			id: baseItem.id,
// 		},
// 	},
// });

const [ baseItemGroup ] = baseItemCollection.state.factory.ItemGroup(1, {
	parent: null,
	children: [
		baseItem,
		baseItem2,
		baseItem3,
	],
	shared: {
		item: {
			title: `Gr00p`,
		},
	},
});

SysItemCollection.register(baseItemCollection, baseItem);
SysItemCollection.register(baseItemCollection, baseItem2);
SysItemCollection.register(baseItemCollection, baseItem3);
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

// const registry = new Registry({
// 	state: [
// 		baseItem,
// 		baseItem2,
// 		baseItem3,
// 		baseItemGroup,
// 	],
// });

// registry.addAlias(baseItem, `baseItem`);
// registry.addAlias(baseItem2, `baseItem2`);
// registry.addAlias(baseItem3, `baseItem3`);
// registry.addAlias(baseItemGroup, `baseItemGroup`);

// console.log(registry);

// console.log(registry.findEntry(`baseItem`));
// console.log(registry.findEntry(`baseItem2`));
// console.log(registry.findEntry(`baseItem3`));
// console.log(registry.findEntry(`baseItemGroup`));

// registry.setPool(`itemseses`, baseItem, baseItem2, baseItem3);
// console.log(registry.findEntry(`itemseses`));
// registry.addToPool(`itemseses`, baseItemGroup);
// console.log(registry.findEntry(`itemseses`));
// registry.removeFromPool(`itemseses`, baseItem);
// console.log(registry.findEntry(`itemseses`));

SysChecklist.attachChecklist(baseItem, {
	title: `This *is* a **TITLE**!`,
});

export const RemindContext = React.createContext();

export function Default() {
	let registry = [ ...baseItemCollection.state.registry.values() ],
		item = registry[ 3 ];

	return (
		<RemindContext.Provider value={ { stub: true } }>
			<div className="m-2">
				{/* <ItemJSX item={ baseItemGroup } /> */ }
				<ItemJSX item={ item } />
			</div>
		</RemindContext.Provider>
	);
};

export default Default;