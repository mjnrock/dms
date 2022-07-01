import { useEffect, useState } from "react";

import { useWebsocketContext } from "../../lib/@react/useWebsocket";
import Message from "../../lib/@relay/Message";

import Component from "./Component";

import { WebSocketContext } from "../../App";
import Loading from "../Loading";

export function ComponentAdapter() {
	const [ data, setData ] = useState();
	const columns = [
		{ field: "ComponentID", header: "ID" },
		{ field: "DomainID", header: "Domain" },
		{ field: "Name", header: "Name" },
		{ field: "Data", header: "Data" },
		{ field: "UUID", header: "UUID" }
	];

	const webSocketBroker = useWebsocketContext(WebSocketContext);
	useEffect(() => {
		webSocketBroker.onMessage = (message: Message) => {
			if(message.type === "CRUD") {
				setData(message.data);
			}
		};

		webSocketBroker.send(Message.From({
			type: "Component.GetAll",
			data: [
				"read",
				"Component",
				'["*"]',
			],
		}));
	}, []);

	if(!data) {
		return (
			<Loading />
		);
	}

	return (
		<Component
			data={ data }
			columns={ columns }
		/>
	);
};

export default ComponentAdapter;