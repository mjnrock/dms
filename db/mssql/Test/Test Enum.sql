USE DMS
GO

SELECT
	*
FROM
	[Node].EnumTagType

SELECT [Node].GetEnumTagType('int8', 2, 1)

SELECT
	*
FROM
	[Node].EnumTagSQLType

SELECT [Node].GetEnumTagSQLType('int8', 4, 2)