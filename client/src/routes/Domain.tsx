// @ts-nocheck
// import { Menubar } from "primereact/menubar";
import { useEffect, useState } from "react";
import Message from "../lib/@relay/Message";

import CrudTable from "../components/CrudTable";

//TODO Make this more robust, move to a more centralized context with hooks, and add an onopen handler to kick things off
export class API {
	public static Host = `buddha.com`;
	public static Port = `3001`;
	public static WebSocket = new WebSocket(`wss://${ API.Host }:${ API.Port }/`);

	public static Send(data: any) {
		if(data instanceof Message) {
			API.WebSocket.send(data.toJson());
		} else {
			API.WebSocket.send(Message.From(data).toJson());
		}
	}
};

export function Domain() {
	const [ json, setJson ] = useState();
	const columns = [
		{ field: "DomainID", header: "ID" },
		{ field: "ParentDomainID", header: "Parent" },
		{ field: "Level", header: "Depth" },
		{ field: "Name", header: "Name" },
		{ field: "Path", header: "Path" },
		{ field: "UUID", header: "UUID" }
	];

	useEffect(() => {
		API.WebSocket.addEventListener("message", e => {
			const msg = Message.FromJson(e.data);

			setJson(msg.data);
		});

		setTimeout(() => {
			API.WebSocket.send(JSON.stringify([
				"read",
				"vwDomain",
				[ "*" ],
				// "ParentDomainID=4",
			]))
		}, 1000);
	}, []);

	if(!json) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<CrudTable
				name={ "Domain" }
				data={ json }
				columns={ columns }
			/>
		</div>
	);
};

export default Domain;