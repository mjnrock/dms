import React from "react";
import { Routes, Route } from "react-router-dom";

import Router from "./routes/package";
import { Default as TagDefault } from "./modules/tags/routes/Default";
import { Default as RemindDefault } from "./modules/remind/routes/Default";

import "semantic-ui-css/semantic.min.css"
import "./assets/css/reset.css";
import "./assets/css/main.css";

export function App() {
	return (
		<Routes>
			<Route path="*" element={ <Router.Default /> } />
			
			<Route path="/tags" element={ <TagDefault /> } />
			<Route path="/remind" element={ <RemindDefault /> } />
		</Routes>
	);
}

export default App;