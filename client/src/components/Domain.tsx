import CrudTable from "./CrudTable";

export function Domain({ data, columns }: { data: any, columns: any }) {
	return (
		<>
			<CrudTable
				name={ "Domain" }
				data={ data }
				columns={ columns }
			/>
		</>
	);
};

export default Domain;