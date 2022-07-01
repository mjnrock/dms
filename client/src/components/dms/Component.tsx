import CrudTable from "../CrudTable";

export function Component({ data, columns }: { data: any, columns: any }) {
	return (
		<>
			<CrudTable
				name={ "Component" }
				data={ data }
				columns={ columns }
			/>
		</>
	);
};

export default Component;