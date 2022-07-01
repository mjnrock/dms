import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";

import { useWebsocketContext } from "../lib/@relay/react/useWebsocket";
import { useCRUDAdapter } from "../lib/@relay/react/useCRUDAdapter";

import { WebSocketContext } from "../App";

import Loading from "./Loading";

export function CrudAdapter({ comp, columns, readTable, deleteTable, pk }: any) {
	const webSocketBroker = useWebsocketContext(WebSocketContext);
	const [ data, setData ] = useState();
	const { toast, onMessage, crud } = useCRUDAdapter({ webSocketBroker, setter: setData });
	const Comp = comp;

	useEffect(() => {
		webSocketBroker.onMessage = onMessage;

		crud({
			op: "read",
			table: readTable,
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

			<Comp
				data={ data }
				columns={ columns }
				onEdit={ (rowData: any) => {
					console.log(rowData);
					//TODO Open an edit Modal or redirect to a edit page
				} }
				onDelete={ (rowData: any) => {
					crud({
						op: "delete",
						table: deleteTable,
						json: "*",
						where: `${ pk }=${ rowData[ pk ] }`,
					});
				} }
			/>
		</>
	);
};

export default CrudAdapter;