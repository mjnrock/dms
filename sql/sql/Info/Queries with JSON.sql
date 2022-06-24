SELECT
	--*,
	UUID,
	[Name],
	JSON_VALUE([Data], '$.x') AS x,
	JSON_VALUE([Data], '$.x') AS y
FROM
	Core.Component;


SELECT
	JSON_QUERY([Data]) AS [json]
FROM
	Core.Component
FOR JSON PATH