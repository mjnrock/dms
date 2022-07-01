import CrudTable from "../CrudTable";

export function Entity({ data, columns }: { data: any, columns: any }) {
	return (
		<>
			<CrudTable
				name={ "Entity" }
				data={ data }
				columns={ columns }
			/>
		</>
	);
};

export default Entity;