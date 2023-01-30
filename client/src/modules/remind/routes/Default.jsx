import React from "react";

import { Test } from "../react/components/$Test";

import { Node } from "./../lib/Node";
import { Item } from "./../lib/Item";
import { ItemGroup } from "./../lib/ItemGroup";
import { ItemCollection } from "../lib/ItemCollection";
import { Registry } from "../lib/Registry";

import { Item as SysItem } from "../systems/class/Item";
import { ItemGroup as SysItemGroup } from "./../systems/class/ItemGroup";
import { ItemCollection as SysItemCollection } from "./../systems/class/ItemCollection";
import { Status as SysStatus } from "./../systems/Status";
import { Ref as SysRef } from "./../systems/Ref";
import { Checklist as SysChecklist } from "./../systems/Checklist";

import { Create as ComponentItem } from "../components/Markdown";
import { Create as ComponentStatus } from "./../components/Status";
import { Create as ComponentChecklist } from "./../components/Checklist";

import { Item as ItemJSX } from "./../react/components/Item";
import Viewport from "../react/components/Viewport";
import { Viewport as SysViewport } from "../systems/Viewport";

import { Container } from "./../react/components/Container";
import { StatusDropdown as StatusDropdownJSX } from "./../react/components/ecs/StatusDropdown";

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

const [ baseItem ] = baseItemCollection.state.factory.Item();
const [ baseItem2, baseItem3 ] = baseItemCollection.state.factory.Item(2);

const [ baseItemGroup ] = baseItemCollection.state.factory.ItemGroup(1, {
	parent: null,
	children: [
		baseItem,
		baseItem2,
		baseItem3,
	],
	// shared: {
	// 	status: ComponentStatus(),
	// },
});

//STUB -- This would normally be populated when the child is added (but need this for testing)
baseItem.state.parent = baseItemGroup;
baseItem2.state.parent = baseItemGroup;
baseItem3.state.parent = baseItemGroup;

SysItemCollection.register(baseItemCollection, baseItem);
SysItemCollection.register(baseItemCollection, baseItem2);
SysItemCollection.register(baseItemCollection, baseItem3);
SysItemCollection.register(baseItemCollection, baseItemGroup);

//IDEA: For now, just use these SCHEMA VARIANTS and add the other options later
let schemaFlex = [
	[ { rw: 1, jsx: Viewport }, { rw: 2, jsx: Viewport } ],
	[ { rw: 1, jsx: Viewport } ],
];
let schemaGrid = [
	2,
	1,
	{
		"0,0": Viewport,
		"1,0": Viewport,
	}
];

export const RemindContext = React.createContext();

export function Default() {
	let registry = [ ...baseItemCollection.state.registry.values() ],
		item = registry[ 3 ];

	SysViewport.update(item, {
		x: 650,
		y: 350,
	});

	return (
		<RemindContext.Provider value={ { stub: true } }>
			<div>
				<p className="p-2 font-mono font-bold font-sm text-neutral-300">GRID Test</p>
				<Container
					type="grid"
					schema={ schemaGrid }
					item={ item }
				/>
			</div>

			<hr className="my-4" />

			<div>
				<p className="p-2 font-mono font-bold font-sm text-neutral-300">FLEX Test</p>
				<Container
					type="flex"
					schema={ schemaFlex }
					item={ item }
				/>
			</div>

			<hr className="my-4" />

			<Viewport item={ item } />
		</RemindContext.Provider>
	);
};

export default Default;