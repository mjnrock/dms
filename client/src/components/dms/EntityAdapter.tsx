import { useEffect, useState } from "react";

import { useWebsocketContext } from "../../lib/@react/useWebsocket";
import Message from "../../lib/@relay/Message";

import Entity from "./Entity";

import { WebSocketContext } from "../../App";
import Loading from "../Loading";

export function EntityAdapter() {
	const [ data, setData ] = useState();
	const columns = [
		{ field: "EntityID", header: "ID" },
		{ field: "DomainID", header: "Domain" },
		{ field: "Name", header: "Name" },
		{ field: "Type", header: "Type" },
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
			type: "Entity.GetAll",
			data: [
				"read",
				"Entity",
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
		<Entity
			data={ data }
			columns={ columns }
			onEdit={ () => {} }
			onDelete={ () => {} }
		/>
	);
};

export default EntityAdapter;