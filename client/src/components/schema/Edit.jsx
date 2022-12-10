export function Edit({ schema, onChange, namespace }) {
	if(namespace) {
		namespace = `${ namespace }.`;
	} else {
		namespace = "";
	}

	//FIXME: This currently does not have a place to change the @alias or @type for "group" objects, nor does it display their existence, hierarchically.

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
									<input className="w-full h-full" type="text" placeholder="Alias" value={ alias } onChange={ e => onChange("alias", namespace, alias, e.target.value) } />
								</div>
								<div className="flex flex-col w-1/2 h-full">
									<input className="w-full h-full" type="text" placeholder="Type" value={ type } onChange={ e => onChange("type", namespace, alias, e.target.value) } />
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