import CrudAdapter from "../CrudAdapter";
import DomainTable from "./DomainTable";

export function DomainTableAdapter() {
	return (
		<CrudAdapter
			comp={ DomainTable }
			columns={ [
				{ field: "DomainID", header: "ID" },
				{ field: "ParentDomainID", header: "Parent" },
				{ field: "Level", header: "Depth" },
				{ field: "Name", header: "Name" },
				{ field: "Path", header: "Path" },
				{ field: "UUID", header: "UUID" }
			] }
			readTable="vwDomain"
			deleteTable="Domain"
			pk="DomainID"
		/>
	)
};

export default DomainTableAdapter;