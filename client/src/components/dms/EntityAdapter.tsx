import CrudAdapter from "../CrudAdapter";
import Entity from "./Entity";

export function EntityAdapter() {
	return (
		<CrudAdapter
			comp={ Entity }
			columns={ [
				{ field: "EntityID", header: "ID" },
				{ field: "DomainID", header: "Domain" },
				{ field: "Name", header: "Name" },
				{ field: "Type", header: "Type" },
				{ field: "UUID", header: "UUID" }
			] }
			readTable="Entity"
			deleteTable="Entity"
			pk="EntityID"
		/>
	)
};

export default EntityAdapter;