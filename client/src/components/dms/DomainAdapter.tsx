import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";

import { useWebsocketContext } from "../../lib/@react/useWebsocket";
import { useCRUDAdapter } from "../../lib/@react/useCRUDAdapter";

import { WebSocketContext } from "../../App";

import Domain from "./Domain";
import Loading from "../Loading";

export function DomainAdapter() {
	const webSocketBroker = useWebsocketContext(WebSocketContext);
	const [ data, setData ] = useState();
	const columns = [
		{ field: "DomainID", header: "ID" },
		{ field: "ParentDomainID", header: "Parent" },
		{ field: "Level", header: "Depth" },
		{ field: "Name", header: "Name" },
		{ field: "Path", header: "Path" },
		{ field: "UUID", header: "UUID" }
	];
	const { toast, onMessage, crud } = useCRUDAdapter({ webSocketBroker, setter: setData });

	useEffect(() => {
		webSocketBroker.onMessage = onMessage;

		crud({
			op: "read",
			table: "vwDomain",
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

			<Domain
				data={ data }
				columns={ columns }
				onEdit={ (rowData: any) => {
					console.log(rowData);
					//TODO Open an edit Modal or redirect to a edit page
				} }
				onDelete={ (rowData: any) => {
					crud({
						op: "delete",
						table: "Domain",
						json: "*",
						where: `DomainID=${ rowData.DomainID }`,
					});
				} }
			/>
		</>
	);
};

export default DomainAdapter;