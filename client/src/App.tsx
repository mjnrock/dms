import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Navbar, ButtonGroup } from "@blueprintjs/core";

/**
 * Contains the @imports for Blueprint CSS
 */
import "./assets/css/main.css";

import "primereact/resources/themes/tailwind-light/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import Message from "./lib/@relay/Message";


const sideBarLinks = [
	//*	Core
	{
		type: "divider",
		text: "Core",
	},
	{
		type: "button",
		url: "/domain",
		text: "Domains",
		icon: "applications",
	},
	{
		type: "button",
		url: "/component",
		text: "Components",
		icon: "cube-add",
	},
	{
		type: "button",
		url: "/reducer",
		text: "Reducers",
		icon: "function",
	},
	// {
	// 	type: "button",
	// 	url: "/method",
	// 	text: "Methods",
	// 	icon: "code",
	// },

	//* Groups
	{
		type: "divider",
		text: "Groups",
	},
	{
		type: "button",
		url: "/entity",
		text: "Entities",
		icon: "new-grid-item",
	},
	{
		type: "button",
		url: "/module",
		text: "Modules",
		icon: "search-around",
	},
	{
		type: "button",
		url: "/collection",
		text: "Collections",
		icon: "layout-hierarchy",
	},

	//* Instances
	{
		type: "divider",
		text: "Instances",
	},
	{
		type: "button",
		url: "/record",
		text: "Records",
		icon: "new-layer",
	},
	{
		type: "button",
		url: "/pool",
		text: "Pools",
		icon: "new-layers",
	},

	//* Other
	{
		type: "divider",
		text: "Other",
	},
	{
		type: "button",
		url: "/metadata",
		text: "Metadata",
		icon: "id-number",
	},
	{
		type: "button",
		url: "/documentation",
		text: "Documentation",
		icon: "document",
	},
];

export class API {
	public static Host = `buddha.com`;
	public static Port = `3001`;
	public static WebSocket = new WebSocket(`wss://${ API.Host }:${ API.Port }/`);

	public static Send(data: any) {
		if(data instanceof Message) {
			API.WebSocket.send(data.toJson());
		} else {
			API.WebSocket.send(Message.From(data).toJson());
		}
	}
};
API.WebSocket.addEventListener("message", e => {
	console.log(e.data);
});

const json = Message.From({ data: 1234, tags: ["cat"] }).toJson();
console.log(json);
const message = Message.FromJson(json);
console.log(message);

setTimeout(() => {
	// API.WebSocket.send(JSON.stringify([
	// 	"insert",
	// 	"Domain",
	// 	{
	// 		Name: "ReactTest",
	// 		ParentDomainID: 4,
	// 	},
	// ]));

	// API.WebSocket.send(JSON.stringify([
	// 	"update",
	// 	"Domain",
	// 	{
	// 		Name: "ReactTestzzz",
	// 	},
	// 	"ParentDomainID=4"
	// ]));

	API.WebSocket.send(JSON.stringify([
		"read",
		"Domain",
		["*"],
		// "ParentDomainID=4",
	]));
}, 1000)

//NOTE: App (via ReactRouter6) acts as the wrapper (via Outlet) here, and as such, only logic that should span the entire app should be placed here.
export function App() {
	const [ isSidebarCollapsed, setIsSideCollapsed ] = useState(false);
	const navigate = useNavigate();

	return (
		<div className="w-full h-screen">
			<Navbar className="bg-gray-300">
				<Navbar.Group align="left">
					<Navbar.Heading className="font-bold mono">DMS</Navbar.Heading>
					<Navbar.Divider />

					<Button icon="home" onClick={ e => navigate(`/main`) }>Main</Button>
				</Navbar.Group>
			</Navbar>

			<div className="flex flex-1 h-full overflow-y-auto">
				<div className={ `flex-none h-full ${ isSidebarCollapsed ? "w-[50px]" : "w-[165px]" }` }>
					<ButtonGroup alignText="left" className="flex flex-col justify-between h-full gap-2 p-2 overflow-auto bg-gray-200 flex-nowrap">
						{
							isSidebarCollapsed
								? sideBarLinks.reduce((a: any, obj: any, i) => {
									if(obj.type === "divider") {
										return a;
									}

									return [
										...a,
										<Button key={ i } className="h-[35px]" icon={ obj.icon } title={ obj.text } onClick={ e => navigate(obj.url) } />
									];
								}, [])
								: sideBarLinks.map((obj: any, i) => {
									if(obj.type === "divider") {
										return (
											<div key={ i } className="text-xs">{ obj.text }</div>
										);
									} else {
										return (
											<Button key={ i } icon={ obj.icon } title={ obj.text } onClick={ e => navigate(obj.url) }>{ obj.text }</Button>
										);
									}
								})
						}
						<div className="flex-1" />

						<Button icon={ `double-chevron-${ isSidebarCollapsed ? "right" : "left" }` } onClick={ e => setIsSideCollapsed(!isSidebarCollapsed) } />
					</ButtonGroup>

				</div>
				<div className="relative flex flex-col flex-1 p-2 overflow-x-hidden overflow-y-auto bg-gray-100">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default App;