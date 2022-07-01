import { Tag } from "primereact/tag";

import CrudTable from "../CrudTable";

export function Entity({ data, columns, onEdit, onDelete }: { data: any, columns: any, onEdit: Function, onDelete: Function }) {
	const cellTemplate = (colData: any) => (rowData: any) => {
		if(colData.field === "Type") {
			const tags = JSON.parse(rowData[ colData.field ]) || [];

			return (
				<div className="max-w-[200px] text-center">
					{
						tags.map((tag: any) => (
							<Tag key={ tag } value={ tag.toLowerCase() } severity="info" className="mr-1" />
						))
					}
				</div>
			);
		} else if(colData.field === "Name") {
			return (
				<span className="font-bold">
					{ rowData[ colData.field ] }
				</span>
			);
		}

		return rowData[ colData.field ];
	};

	return (
		<>
			<CrudTable
				name={ "Entity" }
				data={ data }
				columns={ columns }
				cellTemplate={ cellTemplate }
				onEdit={ onEdit }
				onDelete={ onDelete }
			/>
		</>
	);
};

export default Entity;