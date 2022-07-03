import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useWebsocketContext, WebsocketBroker } from "../../lib/@relay/react/useWebsocket";

import Loading from "../../components/Loading";

/**
 * Contains the @imports for Blueprint CSS
 */
import "./../../assets/css/main.css";

import "primereact/resources/themes/tailwind-light/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";

export const WebSocketContext = React.createContext(new WebsocketBroker());

//NOTE: App (via ReactRouter6) acts as the wrapper (via Outlet) here, and as such, only logic that should span the entire app should be placed here.
export function App() {
	const webSocketBroker = useWebsocketContext(WebSocketContext);
	const [ isWebSocketConnected, setIsWebSocketConnected ] = useState(false);

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
			<Outlet />
		</div>
	);
}

export default App;