import { useEffect, useState } from "react";

import { useWebsocketContext } from "../../lib/@react/useWebsocket";
import Message from "../../lib/@relay/Message";

import Domain from "./Domain";

import { WebSocketContext } from "../../App";
import Loading from "../Loading";

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
			console.log(111111)
			if(message.type === "CRUD") {
				console.log(222222)
				console.log(message.data)
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
			onEdit={ (rowData: any) => {
				console.log(rowData);
			} }
			onDelete={ (rowData: any) => {
				webSocketBroker.send(Message.From({
					type: "Domain.GetAll",
					data: [
						"delete",
						"Domain",
						'["*"]',
						`DomainID=${ rowData.DomainID }`
					],
				}));

				//TODO: Have C-UD operations return a success/failure message and await that before updating the table
				setTimeout(() => {
					webSocketBroker.send(Message.From({
						type: "Domain.GetAll",
						data: [
							"read",
							"vwDomain",
							'["*"]',
						],
					}));
				}, 250);
			} }
		/>
	);
};

export default DomainAdapter;