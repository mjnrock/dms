import { useEffect, useState } from "react";

import { useWebsocketContext } from "../../lib/@react/useWebsocket";
import Message from "../../lib/@relay/Message";

import Reducer from "./Reducer";

import { WebSocketContext } from "../../App";
import Loading from "../Loading";

export function ReducerAdapter() {
	const [ data, setData ] = useState();
	const columns = [
		{ field: "ReducerID", header: "ID" },
		{ field: "DomainID", header: "Domain" },
		{ field: "Fn", header: "Fn" },
		{ field: "Scope", header: "Scope" },
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
			type: "Reducer.GetAll",
			data: [
				"read",
				"Reducer",
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
		<Reducer
			data={ data }
			columns={ columns }
		/>
	);
};

export default ReducerAdapter;