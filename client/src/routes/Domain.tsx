// @ts-nocheck
import { Menubar } from "primereact/menubar";
import { useEffect, useState } from "react";
import Message from "../lib/@relay/Message";

//TODO Make this more robust, move to a more centralized context with hooks, and add an onopen handler to kick things off
export class API {
	public static Host = `buddha.com`;
	public static Port = `3001`;
	public static WebSocket = new WebSocket(`wss://${ API.Host }:${ API.Port }/`);

	public static Send(data: any) {
		if(data instanceof Message) {
			API.WebSocket.send(data.toJson());
		} else {
			API.WebSocket.send(Message.From(data).toJson());
		}
	}
};

export function Domain() {
	const [ json, setJson ] = useState();

	useEffect(() => {
		API.WebSocket.addEventListener("message", e => {
			const msg = Message.FromJson(e.data);
			
			setJson(msg.data);
		});

		setTimeout(() => {
			API.WebSocket.send(JSON.stringify([
				"read",
				"Domain",
				["*"],
				// "ParentDomainID=4",
			]))
		}, 1000);
	}, []);

	if(!json) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<Menubar />

			{
				Object.values(json).map((record, i) => {
					return (
						<div key={ i }>
							<br />
							{
								Object.entries(record).map(([ key, value ], j) => (
									<div className="flex" key={ j }>
										<div className="flex-1 font-bold text-left">{ key }</div>
										<div className="flex-1 text-left font-italic">{ value }</div>
									</div>
								))
							}
							<br />

							<hr />
						</div>
					);
				})
			}
		</div>
	);
};

export default Domain;



//? Prime React Menubar Example (https://www.primefaces.org/primereact/menubar/)
// import React from 'react';
// import { Menubar } from 'primereact/menubar';
// import { InputText } from 'primereact/inputtext';

// const MenubarDemo = () => {
//     const items = [
//         {
//             label: 'File',
//             icon: 'pi pi-fw pi-file',
//             items: [
//                 {
//                     label: 'New',
//                     icon: 'pi pi-fw pi-plus',
//                     items: [
//                         {
//                             label: 'Bookmark',
//                             icon: 'pi pi-fw pi-bookmark'
//                         },
//                         {
//                             label: 'Video',
//                             icon: 'pi pi-fw pi-video'
//                         },

//                     ]
//                 },
//                 {
//                     label: 'Delete',
//                     icon: 'pi pi-fw pi-trash'
//                 },
//                 {
//                     separator: true
//                 },
//                 {
//                     label: 'Export',
//                     icon: 'pi pi-fw pi-external-link'
//                 }
//             ]
//         },
//         {
//             label: 'Edit',
//             icon: 'pi pi-fw pi-pencil',
//             items: [
//                 {
//                     label: 'Left',
//                     icon: 'pi pi-fw pi-align-left'
//                 },
//                 {
//                     label: 'Right',
//                     icon: 'pi pi-fw pi-align-right'
//                 },
//                 {
//                     label: 'Center',
//                     icon: 'pi pi-fw pi-align-center'
//                 },
//                 {
//                     label: 'Justify',
//                     icon: 'pi pi-fw pi-align-justify'
//                 },

//             ]
//         },
//         {
//             label: 'Users',
//             icon: 'pi pi-fw pi-user',
//             items: [
//                 {
//                     label: 'New',
//                     icon: 'pi pi-fw pi-user-plus',

//                 },
//                 {
//                     label: 'Delete',
//                     icon: 'pi pi-fw pi-user-minus',

//                 },
//                 {
//                     label: 'Search',
//                     icon: 'pi pi-fw pi-users',
//                     items: [
//                         {
//                             label: 'Filter',
//                             icon: 'pi pi-fw pi-filter',
//                             items: [
//                                 {
//                                     label: 'Print',
//                                     icon: 'pi pi-fw pi-print'
//                                 }
//                             ]
//                         },
//                         {
//                             icon: 'pi pi-fw pi-bars',
//                             label: 'List'
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             label: 'Events',
//             icon: 'pi pi-fw pi-calendar',
//             items: [
//                 {
//                     label: 'Edit',
//                     icon: 'pi pi-fw pi-pencil',
//                     items: [
//                         {
//                             label: 'Save',
//                             icon: 'pi pi-fw pi-calendar-plus'
//                         },
//                         {
//                             label: 'Delete',
//                             icon: 'pi pi-fw pi-calendar-minus'
//                         }
//                     ]
//                 },
//                 {
//                     label: 'Archieve',
//                     icon: 'pi pi-fw pi-calendar-times',
//                     items: [
//                         {
//                             label: 'Remove',
//                             icon: 'pi pi-fw pi-calendar-minus'
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             label: 'Quit',
//             icon: 'pi pi-fw pi-power-off'
//         }
//     ];

//     const start = <img alt="logo" src="showcase/images/logo.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} height="40" className="mr-2"></img>;
//     const end = <InputText placeholder="Search" type="text" />;

//     return (
//         <div>
//             <div className="card">
//                 <Menubar model={items} start={start} end={end} />
//             </div>
//         </div>
//     );
// }