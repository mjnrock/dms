import { Outlet, useNavigate } from "react-router-dom";
import { Button, Navbar, Alignment } from "@blueprintjs/core";

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
				<Navbar.Group align={ Alignment.LEFT }>
					<Navbar.Heading className="font-bold mono">DMS</Navbar.Heading>
					<Navbar.Divider />

					<Button icon="home" onClick={ e => navigate(`/main`) }>Main</Button>
				</Navbar.Group>
			</Navbar>

			<div className="flex flex-1 h-full overflow-y-auto">
				<div className="flex-none h-full">
					<div className="flex flex-col flex-nowrap h-full justify-between p-2 overflow-auto gap-2 bg-gray-200">
						<Button icon="home" onClick={ e => navigate(`/domain`) }>Domain</Button>
						<Button icon="home" onClick={ e => navigate(`/domain`) }>Domain</Button>
						<Button icon="home" onClick={ e => navigate(`/domain`) }>Domain</Button>
						<Button icon="home" onClick={ e => navigate(`/domain`) }>Domain</Button>
						<Button icon="home" onClick={ e => navigate(`/domain`) }>Domain</Button>
						<div className="flex-1" />
					</div>
				</div>
				<div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto relative p-2 bg-gray-100">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default App;