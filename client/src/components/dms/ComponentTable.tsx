import { useState } from "react";

import CrudTable from "../CrudTable";
import ComponentEdit from "./ComponentEdit";

export function ComponentTable({ data, columns, onEdit, onDelete }: { data: any, columns: any, onEdit: Function, onDelete: Function }) {
	const [ editRow, setEditRow ] = useState(false);

	return (
		<>
			{
				editRow ? (
					<ComponentEdit
						visible={ !!editRow }
						onHide={ () => setEditRow(false) }
						data={ editRow }
						onEdit={ (pk: any, data: any) => {
							onEdit(pk, data);
						} }
					/>
				) : null
			}

			<CrudTable
				name={ "Component" }
				data={ data }
				columns={ columns }
				onEdit={ (rowData: any) => {
					if(!!rowData) {
						setEditRow(rowData);
					}
				}}
				onDelete={ onDelete }
			/>
		</>
	);
};

export default ComponentTable;