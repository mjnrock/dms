export function Edit({ schema, onChange, namespace }) {
	if(namespace) {
		namespace = `${ namespace }.`;
	} else {
		namespace = "";
	}

	return (
		<div className="flex flex-col w-full h-full">
			{
				Object.entries(schema).map(([ alias, type ]) => {
					let localNamespace = `${ namespace }${ alias }`;

					if (typeof type === "object") {
						return (
							<Edit key={ localNamespace } schema={ type } onChange={ onChange } namespace={ `${ localNamespace }` } />
						);
					} else {
						return (
							<div key={ localNamespace } className="flex flex-row w-full h-full">
								<div className="flex flex-col w-1/2 h-full">
									<input className="w-full h-full" type="text" placeholder="Alias" value={ alias } onChange={ e => onChange(`${ localNamespace }`, "alias", e.target.value) } />
								</div>
								<div className="flex flex-col w-1/2 h-full">
									<input className="w-full h-full" type="text" placeholder="Type" value={ type } onChange={ e => onChange(`${ localNamespace }`, "type", e.target.value) } />
								</div>
							</div>
						);
					}
				})
			}
		</div>		
	);
};

export default Edit;