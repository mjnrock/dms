import { Outlet, useNavigate } from "react-router-dom";
import { Button, Navbar, Alignment, ButtonGroup } from "@blueprintjs/core";

/**
 * Contains the @imports for Blueprint CSS
 */
import "./assets/css/main.css";

//NOTE: App (via ReactRouter6) acts as the wrapper (via Outlet) here, and as such, only logic that should span the entire app should be placed here.
export function App() {
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
				<div className="flex-none h-full">
					<ButtonGroup alignText="left" className="flex flex-col flex-nowrap h-full justify-between p-2 overflow-auto gap-2 bg-gray-200">
						<div className="text-xs font-bold">Core</div>
						<Button icon="applications" onClick={ e => navigate(`/domain`) }>Domains</Button>
						<Button icon="cube-add" onClick={ e => navigate(`/component`) }>Components</Button>
						<Button icon="function" onClick={ e => navigate(`/reducer`) }>Reducers</Button>
						<Button icon="code" onClick={ e => navigate(`/method`) }>Methods</Button>

						<div className="text-xs">Groups</div>
						<Button icon="new-grid-item" onClick={ e => navigate(`/entity`) }>Entities</Button>
						<Button icon="search-around" onClick={ e => navigate(`/module`) }>Modules</Button>
						<Button icon="layout-hierarchy" onClick={ e => navigate(`/collection`) }>Collections</Button>

						<div className="text-xs">Instances</div>
						<Button icon="new-layer" onClick={ e => navigate(`/record`) }>Records</Button>
						<Button icon="new-layers" onClick={ e => navigate(`/pool`) }>Pools</Button>

						<div className="text-xs">Other</div>
						<Button icon="id-number" onClick={ e => navigate(`/metadata`) }>Metadata</Button>
						<Button icon="document" onClick={ e => navigate(`/documentation`) }>Documentation</Button>
						<div className="flex-1" />
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