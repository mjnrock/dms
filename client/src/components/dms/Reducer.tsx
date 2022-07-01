import CrudTable from "../CrudTable";

export function Reducer({ data, columns, onEdit, onDelete }: { data: any, columns: any, onEdit: Function, onDelete: Function }) {
	return (
		<CrudTable
			name={ "Reducer" }
			data={ data }
			columns={ columns }
			onEdit={ onEdit }
			onDelete={ onDelete }
		/>
	);
};

export default Reducer;