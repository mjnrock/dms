import CrudAdapter from "../CrudAdapter";
import Domain from "./Domain";

export function DomainAdapter() {
	return (
		<CrudAdapter
			comp={ Domain }
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

export default DomainAdapter;