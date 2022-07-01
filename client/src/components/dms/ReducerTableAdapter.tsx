import CrudAdapter from "../CrudAdapter";
import ReducerTable from "./ReducerTable";

export function ReducerTableAdapter() {
	return (
		<CrudAdapter
			comp={ ReducerTable }
			columns={ [
				{ field: "ReducerID", header: "ID" },
				{ field: "DomainID", header: "Domain" },
				{ field: "Fn", header: "Fn" },
				{ field: "Scope", header: "Scope" },
				{ field: "UUID", header: "UUID" }
			] }
			readTable="Reducer"
			deleteTable="Reducer"
			pk="ReducerID"
		/>
	)
};

export default ReducerTableAdapter;