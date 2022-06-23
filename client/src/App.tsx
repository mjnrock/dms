import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Navbar, ButtonGroup } from "@blueprintjs/core";

/**
 * Contains the @imports for Blueprint CSS
 */
import "./assets/css/main.css";

const sideBarLinks = [
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
	{
		type: "button",
		url: "/method",
		text: "Methods",
		icon: "code",
	},

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

//NOTE: App (via ReactRouter6) acts as the wrapper (via Outlet) here, and as such, only logic that should span the entire app should be placed here.
export function App() {
	const [ isSidebarCollapsed, setIsSideCollapsed ] = useState(false);
	const navigate = useNavigate();

	return (
		<div className="h-screen w-full">
			<Navbar className="bg-gray-300">
				<Navbar.Group align="left">
					<Navbar.Heading className="font-bold mono">DMS</Navbar.Heading>
					<Navbar.Divider />

					<Button icon="home" onClick={ e => navigate(`/main`) }>Main</Button>
				</Navbar.Group>
			</Navbar>

			<div className="flex flex-1 h-full overflow-y-auto">
				<div className={ `flex-none h-full ${ isSidebarCollapsed ? "w-[55px]" : "w-[165px]" }` }>
					<ButtonGroup alignText="left" className="flex flex-col flex-nowrap h-full justify-between p-2 overflow-auto gap-2 bg-gray-200">
						{
							isSidebarCollapsed
								? sideBarLinks.reduce((a: any, obj: any) => {
									if(obj.type === "divider") {
										return a;
									}

									return [
										...a,
										<Button className="h-[35px]" icon={ obj.icon } title={ obj.text } onClick={ e => navigate(obj.url) } />
									];
								}, [])
								: sideBarLinks.map((obj: any) => {
									if(obj.type === "divider") {
										return (
											<div className="text-xs">{ obj.text }</div>
										);
									} else {
										return (
											<Button icon={ obj.icon } title={ obj.text } onClick={ e => navigate(obj.url) }>{ obj.text }</Button>
										);
									}
								})
						}
						<div className="flex-1" />

						<Button icon={ `double-chevron-${ isSidebarCollapsed ? "right" : "left" }` } onClick={ e => setIsSideCollapsed(!isSidebarCollapsed) } />
					</ButtonGroup>

				</div>
				<div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto relative p-2 bg-gray-100">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default App;