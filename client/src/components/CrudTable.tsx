import { useRef, useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";


function saveAsExcelFile(buffer: any, fileName: any) {
	import("file-saver").then(module => {
		if(module && module.default) {
			const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
			const EXCEL_EXTENSION = ".xlsx";
			const data = new Blob([ buffer ], {
				type: EXCEL_TYPE
			});

			module.default.saveAs(data, fileName + EXCEL_EXTENSION);
		}
	});
};

function onFilter(e: any, setter: Function) {
	if(e.target.value.length) {
		setter(e.target.value);
	} else {
		setter(null);
	}
};

function ActionButton({ icon, onClick, color }: { icon: string, onClick: Function, color?: string }) {
	return (
		<Button icon={ `pi pi-${ icon }` } className={ `mb-2 mr-2 p-button p-component p-button-rounded p-button-${ color } p-button-text p-button-icon-only` } onClick={ () => onClick() } />
	);
}

export function CrudTable({ name, data, columns }: { name: string, data: any, columns: any }) {
	const [ globalFilter, setGlobalFilter ] = useState(null);
	const [ selectedProducts, setSelectedProducts ] = useState([]);
	const dt: any = useRef(null);


	const exportXLSX = () => {
		import("xlsx").then(xlsx => {
			const worksheet = xlsx.utils.json_to_sheet(data);
			const workbook = { Sheets: { "data": worksheet }, SheetNames: [ "data" ] };
			const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "array" });

			saveAsExcelFile(excelBuffer, name);
		});
	};

	const leftToolbarTemplate = () => {
		return (
			<>
				{/* <Button label="New" icon="pi pi-plus" className="mr-2 p-button-success" onClick={ openNew } /> */ }
				{/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={ confirmDeleteSelected } disabled={ !selectedProducts || !selectedProducts.length } /> */ }
			</>
		)
	}

	const rightToolbarTemplate = () => {
		return (
			<>
				<ActionButton icon="upload" onClick={ exportXLSX } color="help" />
			</>
		)
	}

	/**
	 * This populates the header and the global filter
	 */
	const tableHeader = (
		<div className="flex table-header">
			<span className="flex-1 mt-2 text-2xl">{ name }</span>
			
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText type="search" onInput={ e => onFilter(e, setGlobalFilter) } placeholder="Search..." />
			</span>
		</div>
	);

	/**
	 * Use this to create the actual data that will be displayed in the table cell.
	 *? See (https://www.primefaces.org/primereact/datatable/crud/) for examples.
	 */
	const cellTemplate = (colData: any) => (rowData: any) => {
		//* Perform any custom logic here, such as filtering, element wrapping, etc.
		return rowData[ colData.field ];
	};

	/**
	 * The template for the the row-level action buttons
	 */
	const actionTemplate = (rowData: any) => {
		return (
			<>
				<ActionButton icon="pencil" onClick={ () => { } } color="success" />
				<ActionButton icon="trash" onClick={ () => { } } color="danger" />
			</>
		);
	};

	return (
		<div className="card">
			<Toolbar className="mb-4" left={ leftToolbarTemplate } right={ rightToolbarTemplate } />

			<DataTable
				ref={ dt }
				dataKey="id"
				value={ data }
				removableSort
				selection={ selectedProducts }
				onSelectionChange={ (e) => setSelectedProducts(e.value) }
				paginator
				rows={ 25 }
				rowsPerPageOptions={ [ 5, 10, 25, 50, 100 ] }
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
				globalFilter={ globalFilter }
				header={ tableHeader }
				responsiveLayout="scroll"
			>
				{
					columns.map((col: any, i: number) => {
						return (
							<Column key={ i } field={ col.field } header={ col.header } sortable body={ cellTemplate(col) } />
						);
					})
				}
				<Column body={ actionTemplate } exportable={ false } style={ { minWidth: "8rem" } } header={ `Actions` } />
			</DataTable>
		</div>
	);
};

export default CrudTable;