import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import AppRoutes from "./routes/package";
// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={ <App /> }>
					<Route path="main" element={ <AppRoutes.Main /> } />
					<Route path="domains" element={ <AppRoutes.Domain /> } />
					<Route path="components" element={ <AppRoutes.Component /> } />
					<Route path="reducers" element={ <AppRoutes.Reducer /> } />
					<Route path="entities" element={ <AppRoutes.Entity /> } />
					<Route
						path="*"
						element={
							<main>
								<p>404</p>
								<p>Link not found</p>
							</main>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();