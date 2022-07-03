import CrudAdapter from "../../../components/crud/CrudAdapter";
import EntityTable from "./EntityTable";

export function EntityTableAdapter() {
	return (
		<CrudAdapter
			comp={ EntityTable }
			columns={ [
				{ field: "EntityID", header: "ID" },
				{ field: "DomainID", header: "Domain" },
				{ field: "Name", header: "Name" },
				{ field: "Type", header: "Type" },
				{ field: "UUID", header: "UUID" }
			] }
			readTable="Entity"
			crudTable="Entity"
			pk="EntityID"
		/>
	)
};

export default EntityTableAdapter;