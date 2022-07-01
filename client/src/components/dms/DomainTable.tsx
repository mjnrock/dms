import { useState } from "react";

import CrudTable from "../CrudTable";
import DomainEdit from "./DomainEdit";

export function DomainTable({ data, columns, onEdit, onDelete }: { data: any, columns: any, onEdit?: Function, onDelete: Function }) {
	const [ editRow, setEditRow ] = useState(false);

	return (
		<>
			{
				editRow ? (
					<DomainEdit
						visible={ !!editRow }
						onHide={ () => setEditRow(false) }
						data={ editRow }
					/>
				) : null
			}

			<CrudTable
				name={ "Domain" }
				data={ data }
				columns={ columns }
				onEdit={ (rowData: any) => {
					if(onEdit) {
						onEdit(rowData);
					}

					if(!!rowData) {
						setEditRow(rowData);
					}
				}}
				onDelete={ onDelete }
			/>
		</>
	);
};

export default DomainTable;