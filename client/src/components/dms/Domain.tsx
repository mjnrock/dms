import CrudTable from "../CrudTable";

export function Domain({ data, columns, onEdit, onDelete }: { data: any, columns: any, onEdit: Function, onDelete: Function }) {
	return (
		<>
			<CrudTable
				name={ "Domain" }
				data={ data }
				columns={ columns }
				onEdit={ onEdit }
				onDelete={ onDelete }
			/>
		</>
	);
};

export default Domain;