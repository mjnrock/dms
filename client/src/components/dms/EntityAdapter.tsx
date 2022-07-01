import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";

import { useWebsocketContext } from "../../lib/@react/useWebsocket";
import { useCRUDAdapter } from "../../lib/@react/useCRUDAdapter";

import { WebSocketContext } from "../../App";

import Entity from "./Entity";
import Loading from "../Loading";

export function EntityAdapter() {
	const webSocketBroker = useWebsocketContext(WebSocketContext);
	const [ data, setData ] = useState();
	const columns = [
		{ field: "EntityID", header: "ID" },
		{ field: "DomainID", header: "Domain" },
		{ field: "Name", header: "Name" },
		{ field: "Type", header: "Type" },
		{ field: "UUID", header: "UUID" }
	];
	const { toast, onMessage, crud } = useCRUDAdapter({ webSocketBroker, setter: setData });

	useEffect(() => {
		webSocketBroker.onMessage = onMessage;

		crud({
			op: "read",
			table: "Entity",
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

			<Entity
				data={ data }
				columns={ columns }
				onEdit={ (rowData: any) => {
					console.log(rowData);
					//TODO Open an edit Modal or redirect to a edit page
				} }
				onDelete={ (rowData: any) => {
					crud({
						op: "delete",
						table: "Entity",
						json: "*",
						where: `EntityID=${ rowData.EntityID }`,
					});
				} }
			/>
		</>
	);
};

export default EntityAdapter;