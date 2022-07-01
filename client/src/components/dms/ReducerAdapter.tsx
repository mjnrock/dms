import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";

import { useWebsocketContext } from "../../lib/@react/useWebsocket";
import { useCRUDAdapter } from "../../lib/@react/useCRUDAdapter";

import { WebSocketContext } from "../../App";

import Reducer from "./Reducer";
import Loading from "../Loading";

export function ReducerAdapter() {
	const webSocketBroker = useWebsocketContext(WebSocketContext);
	const [ data, setData ] = useState();
	const columns = [
		{ field: "ReducerID", header: "ID" },
		{ field: "DomainID", header: "Domain" },
		{ field: "Fn", header: "Fn" },
		{ field: "Scope", header: "Scope" },
		{ field: "UUID", header: "UUID" }
	];
	const { toast, onMessage, crud } = useCRUDAdapter({ webSocketBroker, setter: setData });

	useEffect(() => {
		webSocketBroker.onMessage = onMessage;

		crud({
			op: "read",
			table: "Reducer",
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

			<Reducer
				data={ data }
				columns={ columns }
				onEdit={ (rowData: any) => {
					console.log(rowData);
					//TODO Open an edit Modal or redirect to a edit page
				} }
				onDelete={ (rowData: any) => {
					crud({
						op: "delete",
						table: "Reducer",
						json: "*",
						where: `ReducerID=${ rowData.ReducerID }`,
					});
				} }
			/>
		</>
	);
};

export default ReducerAdapter;