import CrudAdapter from "../CrudAdapter";
import Reducer from "./Reducer";

export function ReducerAdapter() {
	return (
		<CrudAdapter
			comp={ Reducer }
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

export default ReducerAdapter;