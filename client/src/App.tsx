import { Outlet, Link } from "react-router-dom";

/**
 * Contains the @imports for Blueprint CSS
 */
import "./assets/css/main.css";

//NOTE: App (via ReactRouter6) acts as the wrapper (via Outlet) here, and as such, only logic that should span the entire app should be placed here.
export function App() {
	return (
		<div>
			<h1>Data Management Studio</h1>

			<nav style={ { borderBottom: "solid 1px", paddingBottom: "1rem" } }>
				<Link to="/">Home</Link>
				<Link to="/test">Test1</Link>
			</nav>

			<Outlet />
		</div>
	);
}

export default App;