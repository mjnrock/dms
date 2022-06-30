import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Navbar, ButtonGroup } from "@blueprintjs/core";

import { useWebsocketContext, WebsocketBroker } from "./lib/@react/useWebsocket";

/**
 * Contains the @imports for Blueprint CSS
 */
import "./assets/css/main.css";

import "primereact/resources/themes/tailwind-light/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import Loading from "./components/Loading";


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

export const WebSocketContext = React.createContext(new WebsocketBroker());

//NOTE: App (via ReactRouter6) acts as the wrapper (via Outlet) here, and as such, only logic that should span the entire app should be placed here.
export function App() {
	const webSocketBroker = useWebsocketContext(WebSocketContext);
	const [ isWebSocketConnected, setIsWebSocketConnected ] = useState(false);
	const [ isSidebarCollapsed, setIsSideCollapsed ] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const current = webSocketBroker;

		current.onOpen = () => {
			setIsWebSocketConnected(true);
		};

		current.connect();
		
		return () => {
			current.close();
		};
	}, [ webSocketBroker ]);

	if(!isWebSocketConnected) {
		return (
			<Loading />
		)
	}

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