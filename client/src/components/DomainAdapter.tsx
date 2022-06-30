import { useEffect, useState } from "react";
import { ProgressSpinner } from 'primereact/progressspinner';

import { useWebsocketContext } from "../lib/@react/useWebsocket";
import Message from "../lib/@relay/Message";

import Domain from "./Domain";

import { WebSocketContext } from "../App";
import Loading from "./Loading";

export function DomainAdapter() {
	const [ data, setData ] = useState();
	const columns = [
		{ field: "DomainID", header: "ID" },
		{ field: "ParentDomainID", header: "Parent" },
		{ field: "Level", header: "Depth" },
		{ field: "Name", header: "Name" },
		{ field: "Path", header: "Path" },
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
			type: "Domain.GetAll",
			data: [
				"read",
				"vwDomain",
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
		<Domain
			data={ data }
			columns={ columns }
		/>
	);
};

export default DomainAdapter;