import { useState, useEffect } from "react";

import CrudTable from "../CrudTable";
import DomainEdit from "./DomainEdit";

export function DomainTable({ data, columns, onEdit, onDelete }: { data: any, columns: any, onEdit: Function, onDelete: Function }) {
	const [ editRow, setEditRow ] = useState(false);
	const [ parentOptions, setParentOptions ] = useState<any>([]);

	useEffect(() => {
		let parents: any = Object.values(data).reduce((acc: Set<number>, curr: any) => {
			acc.add(+curr.DomainID);
	
			return acc;
		}, new Set<number>());

		parents = Array.from<any>(parents).sort((a, b) => a - b);

		setParentOptions(parents);
	}, [ data ]);

	return (
		<>
			{
				editRow ? (
					<DomainEdit
						visible={ !!editRow }
						onHide={ () => setEditRow(false) }
						data={ editRow }
						onEdit={ (pk: any, data: any) => {
							onEdit(pk, data);
						} }
						parentOptions={ parentOptions }
					/>
				) : null
			}

			<CrudTable
				name={ "Domain" }
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

export default DomainTable;