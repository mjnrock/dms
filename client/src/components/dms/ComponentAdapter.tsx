import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";

import { useWebsocketContext } from "../../lib/@react/useWebsocket";
import { useCRUDAdapter } from "../../lib/@react/useCRUDAdapter";

import { WebSocketContext } from "../../App";

import Component from "./Component";
import Loading from "../Loading";

export function ComponentAdapter() {
	const webSocketBroker = useWebsocketContext(WebSocketContext);
	const [ data, setData ] = useState();
	const columns = [
		{ field: "ComponentID", header: "ID" },
		{ field: "ComponentID", header: "Component" },
		{ field: "Name", header: "Name" },
		{ field: "Data", header: "Data" },
		{ field: "UUID", header: "UUID" }
	];
	const { toast, onMessage, crud } = useCRUDAdapter({ webSocketBroker, setter: setData });

	useEffect(() => {
		webSocketBroker.onMessage = onMessage;

		crud({
			op: "read",
			table: "Component",
			json: "*",
			where: false,
		});
	}, []);

	if(!data) {
		return (
			<Loading />
		);
	}

	return (
		<>
			<Toast ref={ toast } />

			<Component
				data={ data }
				columns={ columns }
				onEdit={ (rowData: any) => {
					console.log(rowData);
					//TODO Open an edit Modal or redirect to a edit page
				} }
				onDelete={ (rowData: any) => {
					crud({
						op: "delete",
						table: "Component",
						json: "*",
						where: `ComponentID=${ rowData.ComponentID }`,
					});
				} }
			/>
		</>
	);
};

export default ComponentAdapter;