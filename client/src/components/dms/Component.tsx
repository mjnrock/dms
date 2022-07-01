import CrudTable from "../CrudTable";

export function Component({ data, columns, onEdit, onDelete }: { data: any, columns: any, onEdit: Function, onDelete: Function }) {
	return (
		<CrudTable
			name={ "Component" }
			data={ data }
			columns={ columns }
			onEdit={ onEdit }
			onDelete={ onDelete }
		/>
	);
};

export default Component;