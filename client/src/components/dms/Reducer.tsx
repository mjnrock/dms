import CrudTable from "../CrudTable";

export function Reducer({ data, columns }: { data: any, columns: any }) {
	return (
		<>
			<CrudTable
				name={ "Reducer" }
				data={ data }
				columns={ columns }
			/>
		</>
	);
};

export default Reducer;