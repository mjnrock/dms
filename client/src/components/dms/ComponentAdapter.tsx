import CrudAdapter from "../CrudAdapter";
import Component from "./Component";

export function ComponentAdapter() {
	return (
		<CrudAdapter
			comp={ Component }
			columns={ [
				{ field: "ComponentID", header: "ID" },
				{ field: "ComponentID", header: "Component" },
				{ field: "Name", header: "Name" },
				{ field: "Data", header: "Data" },
				{ field: "UUID", header: "UUID" }
			] }
			readTable="Component"
			deleteTable="Component"
			pk="ComponentID"
		/>
	)
};

export default ComponentAdapter;