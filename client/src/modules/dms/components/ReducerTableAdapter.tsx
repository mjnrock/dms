import CrudAdapter from "../../../components/crud/CrudAdapter";
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
			crudTable="Reducer"
			pk="ReducerID"
		/>
	)
};

export default ReducerTableAdapter;