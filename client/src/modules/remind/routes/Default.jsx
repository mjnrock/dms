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
import { Viewport as SysViewport } from "../systems/Viewport";
import { Container as SysContainer } from "./../systems/dms/Container";

import { Create as ComponentItem } from "../components/Markdown";
import { Create as ComponentStatus } from "./../components/Status";
import { Create as ComponentChecklist } from "./../components/Checklist";
import { Create as ComponentContainer } from "./../components/dms/Container";

import { Item as ItemJSX } from "./../react/components/Item";
import { Viewport as ViewportJSX } from "../react/components/Viewport";
import { Container as ContainerJSX } from "./../react/components/Container";
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
		Container: SysContainer,
	},
	components: {
		Item: ComponentItem,
		Status: ComponentStatus,
		Container: ComponentContainer,
	},
	jsx: {
		Item: ItemJSX,
		Viewport: ViewportJSX,
		Container: ContainerJSX,
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
	shared: {
		container: ComponentContainer({
			type: "grid",
			schema: [
				2,
				1,
				{
					"0,0": ViewportJSX,
					"1,0": ViewportJSX,
				}
			],
			// type: "flex",
			// schema: [
			// 	[ { rw: 1, jsx: ViewportJSX }, { rw: 2, jsx: ViewportJSX } ],
			// 	[ { rw: 1, jsx: ViewportJSX } ],
			// ],
		}),
	},
});

//STUB -- This would normally be populated when the child is added (but need this for testing)
baseItem.state.parent = baseItemGroup;
baseItem2.state.parent = baseItemGroup;
baseItem3.state.parent = baseItemGroup;

SysItemCollection.register(baseItemCollection, baseItem);
SysItemCollection.register(baseItemCollection, baseItem2);
SysItemCollection.register(baseItemCollection, baseItem3);
SysItemCollection.register(baseItemCollection, baseItemGroup);

export const RemindContext = React.createContext();

export function Default() {
	let registry = [ ...baseItemCollection.state.registry.values() ],
		item = registry[ 3 ];

	//FIXME: This is old and needs to be removed -- ItemJSX still takes `x & y` as props, also
	//IDEA: See if you can merge the RenderComponent and Container components
	SysViewport.update(item, {
		x: 650,
		y: 350,
	});

	return (
		<RemindContext.Provider value={ { stub: true } }>
			<div className={ `m-4 p-2 rounded border-4 border-solid border-purple-400 bg-purple-100` }>
				<p className="p-2 font-mono font-bold text-purple-300 font-sm">CONTAINER Test</p>

				{/* TODO: Create FLEX and GRID specific VIEW & EDIT components */ }

				<ContainerJSX type={ item.shared.container.type } schema={ item.shared.container.schema } data={ item } />
			</div>

			<div className={ `m-4 p-2 rounded border-4 border-solid border-blue-400 bg-blue-100` }>
				<p className="p-2 font-mono font-bold text-blue-300 font-sm">VIEWPORT Test</p>
				<ViewportJSX item={ item } />
			</div>
		</RemindContext.Provider>
	);
};

export default Default;