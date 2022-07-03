import { useEffect, useState } from "react";
import { Toast } from "primereact/toast";

import { useWebsocketContext } from "../../lib/@relay/react/useWebsocket";
import { useCRUDAdapter } from "../../lib/@relay/react/useCRUDAdapter";

import { WebSocketContext } from "../../modules/dms/App";

import Loading from "../Loading";

export function CrudAdapter({ comp, columns, readTable, crudTable, pk }: any) {
	const webSocketBroker = useWebsocketContext(WebSocketContext);
	const [ data, setData ] = useState();
	const { toast, onMessage, crud } = useCRUDAdapter({ webSocketBroker, setter: setData });
	const Comp = comp;

	useEffect(() => {
		webSocketBroker.onMessage = onMessage({ table: crudTable });

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
				onEdit={ (pkv: any, newRowData: any) => {
					crud({
						op: "update",
						table: crudTable,
						json: JSON.stringify(newRowData),
						where: `${ pk }=${ pkv }`,
					});
				} }
				onDelete={ (rowData: any) => {
					crud({
						op: "delete",
						table: crudTable,
						json: "*",
						where: `${ pk }=${ rowData[ pk ] }`,
					});
				} }
			/>
		</>
	);
};

export default CrudAdapter;