import CrudTable from "../CrudTable";

export function DomainTable({ data, columns, onEdit, onDelete }: { data: any, columns: any, onEdit: Function, onDelete: Function }) {
	return (
		<CrudTable
			name={ "Domain" }
			data={ data }
			columns={ columns }
			onEdit={ onEdit }
			onDelete={ onDelete }
		/>
	);
};

export default DomainTable;