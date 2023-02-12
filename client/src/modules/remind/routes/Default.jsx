import React from "react";

import { Test } from "../react/components/$Test";

import { Node } from "./../lib/Node";
import { Item } from "./../lib/Item";
import { ItemGroup } from "./../lib/ItemGroup";
import { ItemCollection } from "../lib/ItemCollection";
import { Registry } from "../lib/Registry";

import SysASystem from "../systems/ASystem";
import { Item as SysItem } from "../systems/class/Item";
import { ItemGroup as SysItemGroup } from "./../systems/class/ItemGroup";
import { ItemCollection as SysItemCollection } from "./../systems/class/ItemCollection";
import { Registry as SysRegistry } from "./../systems/class/Registry";
import { Status as SysStatus } from "./../systems/Status";
import { Ref as SysRef } from "./../systems/Ref";
import { Checklist as SysChecklist } from "./../systems/Checklist";
import { Viewport as SysViewport } from "../systems/Viewport";
import { Container as SysContainer } from "./../systems/dms/Container";
import { Manifest as SysManifest } from "./../systems/dms/Manifest";

import { Create as ComponentItem } from "../components/Markdown";
import { Create as ComponentStatus } from "./../components/Status";
import { Create as ComponentChecklist } from "./../components/Checklist";
import { Create as ComponentContainer } from "./../components/dms/Container";
import ComponentManifest from "./../components/dms/Manifest";

import { Item as ItemJSX } from "./../react/components/Item";
import { Viewport as ViewportJSX } from "../react/components/Viewport";
import { Container as ContainerJSX } from "./../react/components/Container";
import { StatusDropdown as StatusDropdownJSX } from "./../react/components/ecs/StatusDropdown";

//TODO: Manifest should replace the need for this, refactor accordingly
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
		Manifest: SysManifest,
	},
	components: {
		Item: ComponentItem,
		Status: ComponentStatus,
		Container: ComponentContainer,
		Manifest: ComponentManifest,
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
		...ComponentManifest.AsEntry(),
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

// console.log(baseItemGroup.shared[ ComponentManifest.Name ]);

SysManifest.register(baseItemGroup, baseItem);
SysManifest.compRegister(baseItemGroup, { [ ComponentManifest.Name ]: ComponentManifest });
SysManifest.sysRegister(baseItemGroup, { [ ComponentManifest.Name ]: SysManifest });

// console.log(baseItemGroup.shared[ ComponentManifest.Name ]);

// Function to download data to a file
function download(input, filename) {
	//TODO: You need to invoke recursive .toObject() on the input properties
	let data = { ...input };
	delete data.data;
	data = JSON.stringify(data, null, 2);

	let file = new Blob([ data ], { type: "application/json" });
	if(window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(file, filename);
	} else {
		let a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();

		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
};

//FIXME: This is old and needs to be removed -- ItemJSX still takes `x & y` as props, also
//IDEA: See if you can merge the RenderComponent and Container components
SysViewport.update(baseItemGroup, {
	x: 650,
	y: 350,
});

export const RemindContext = React.createContext();

export function Default() {
	let registry = [ ...baseItemCollection.state.registry.values() ],
		item = registry[ 3 ];

	//FIXME: This serialization does not work
	const systems = new Map([
		[ `#remind:registry`, SysRegistry ],
		[ `#remind:item-group`, SysItemGroup ],
		[ `#remind:item`, SysItem ],
	]);
	console.log(SysASystem.toObject(item, { systems }));
	console.log(SysASystem.toObject(item, { systems, forManifest: true }));

	//IDEA: Container component already stores: mode, type, schema -- so consider how that should play into this
	// Maybe create a wrapper entity that eventually merges itself into a Manifest?
	const [ manifest, setManifest ] = React.useState(ComponentManifest.Create());
	const [ containerType, setContainerType ] = React.useState("grid");	//grid, flex

	return (
		<RemindContext.Provider value={ { stub: true } }>
			<div className={ `m-4 p-2 rounded border-4 border-solid border-purple-400 bg-purple-100` }>
				<p className="p-2 font-mono font-bold text-purple-300 font-sm">CONTAINER Test</p>

				<div className="flex flex-row">
					<div className="flex mr-4 font-mono">{ manifest.meta.id }</div>
					<div className="flex italic">{ manifest.meta.timestamp }</div>
				</div>

				<input type="file" onChange={ (e) => {
					let file = e.target.files[ 0 ],
						reader = new FileReader();

					reader.onload = (e) => {
						let manifest = JSON.parse(e.target.result),
							component = ComponentManifest.Create(manifest);

						setManifest(component);
					};

					reader.readAsText(file);
				} } />
				<div className={ `p-4 cursor-pointer rounded border border-solid border-gray-400 bg-gray-200 hover:bg-gray-300` } onClick={ () => download(manifest, "test") }>Save</div>
				<div className={ `flex flex-row` }>
					<div className={ `p-4 cursor-pointer rounded border border-solid border-gray-400 ${ containerType === "flex" ? "bg-sky-400" : "bg-gray-200 hover:bg-gray-300" }` } onClick={ () => { alert("implement this"); setContainerType("flex"); } }>Flex</div>
					<div className={ `p-4 cursor-pointer rounded border border-solid border-gray-400 ${ containerType === "grid" ? "bg-sky-400" : "bg-gray-200 hover:bg-gray-300 " }` } onClick={ () => { alert("implement this"); setContainerType("grid"); } }>Grid</div>
				</div>

				{/* TODO: Create FLEX and GRID specific VIEW & EDIT components */ }
				{/* IDEA: Review ItemCollection and use paradigm as a "Lookup Repository" -- allow hot-swapping collections.  Search functionality will ONLY show w/e is in currently-mounted ItemCollection */ }

				<ContainerJSX type={ item.shared.container.type } schema={ item.shared.container.schema } data={ item } />
			</div>



			<div className={ `m-4 p-2 rounded border-4 border-solid border-blue-400 bg-blue-100` }>
				<p className="p-2 font-mono font-bold text-blue-300 font-sm">VIEWPORT Test</p>
				<ViewportJSX item={ item } />
			</div>
		</RemindContext.Provider >
	);
};

export default Default;