import CrudAdapter from "../CrudAdapter";
import ComponentTable from "./ComponentTable";

export function ComponentTableAdapter() {
	return (
		<CrudAdapter
			comp={ ComponentTable }
			columns={ [
				{ field: "ComponentID", header: "ID" },
				{ field: "ComponentID", header: "Component" },
				{ field: "Name", header: "Name" },
				{ field: "Data", header: "Data" },
				{ field: "UUID", header: "UUID" }
			] }
			readTable="Component"
			crudTable="Component"
			pk="ComponentID"
		/>
	)
};

export default ComponentTableAdapter;