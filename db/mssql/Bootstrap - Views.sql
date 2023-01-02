USE DMS
GO

IF OBJECT_ID('[Node].vwInformationSchema') IS NOT NULL DROP VIEW [Node].vwInformationSchema
IF OBJECT_ID('[Node].vwTagHierarchy') IS NOT NULL DROP VIEW [Node].vwTagHierarchy
IF OBJECT_ID('[Node].vwTagSQLType') IS NOT NULL DROP VIEW [Node].vwTagSQLType
GO

CREATE VIEW [Node].[vwInformationSchema] AS
SELECT
	c.TABLE_NAME AS [Table],
	c.COLUMN_NAME AS [Column],
	UPPER(c.DATA_TYPE) AS DataType,
	c.ORDINAL_POSITION AS [Order],
	COALESCE(
		c.CHARACTER_MAXIMUM_LENGTH,
		c.NUMERIC_PRECISION,
		c.DATETIME_PRECISION
	) AS [Precision],
	UPPER(c.COLUMN_DEFAULT) AS [Default],
	CASE 
		WHEN c.COLUMN_DEFAULT IS NOT NULL THEN 1
		ELSE 0
	END AS HasDefault,
	CASE c.IS_NULLABLE 
		WHEN 'YES' THEN 1
		ELSE 0
	END AS IsNullable,
	CASE c.CHARACTER_SET_NAME
		WHEN 'UNICODE' THEN 1
		WHEN 'iso_1' THEN 0
		ELSE NULL
	END AS IsUnicode
FROM
	INFORMATION_SCHEMA.COLUMNS c
	INNER JOIN INFORMATION_SCHEMA.TABLES t
		ON c.TABLE_SCHEMA = t.TABLE_SCHEMA
		AND c.TABLE_NAME = t.TABLE_NAME
WHERE
	c.TABLE_SCHEMA = 'Node'
	AND t.TABLE_TYPE = 'BASE TABLE'
GO

CREATE VIEW [Node].vwTagHierarchy AS
/* Recursively reconstitute the tag hierarchy */
WITH RCTE([Level], UUID, ParentUUID, RootUUID, [Namespace], Alias, EnumTagTypeID) AS (
	SELECT
		0,
		c.UUID,
		c.ParentUUID,
		CAST(NULL AS VARCHAR(255)),
		CAST(NULL AS VARCHAR(255)),
		c.Alias,
		c.EnumTagTypeID
	FROM
		[Node].Tag c
	WHERE
		c.ParentUUID IS NULL

	UNION ALL

	SELECT
		[Level] + 1,
		c.UUID,
		c.ParentUUID,
		CAST(COALESCE(p.RootUUID, p.UUID) AS VARCHAR(255)),
		CAST(CASE
			WHEN p.[Namespace] IS NULL THEN p.Alias
			ELSE CONCAT(p.[Namespace], '.', p.Alias)
		END AS VARCHAR(255)),
		c.Alias,
		c.EnumTagTypeID
	FROM
		[Node].Tag c
		INNER JOIN RCTE p
			ON c.ParentUUID = p.UUID
/* Elaborate upon the tag details, once hierarchy has been reconstructed */
), Hierarchy AS (
	SELECT
		base.[Level],
		base.UUID,
		base.ParentUUID,
		base.RootUUID,
		base.[Namespace],
		base.Alias,
		base.EnumTagTypeID,
		ett.[Key],
		ett.[Value],
		ett.IsHyperTag,
		etst.EnumTagSQLTypeID,
		etst.[Value] AS SQLValue,
		etst.Data1,
		etst.Data2,
		etst.Data3,
		CONCAT(etst.[Value], CASE
			WHEN etst.Data2 IS NOT NULL THEN CONCAT('(', etst.Data1, ',', etst.Data1, ')')
			WHEN etst.Data1 IS NOT NULL THEN CONCAT('(', etst.Data1, ')')
			ELSE NULL
		END) AS SQLType
	FROM
		RCTE base
		INNER JOIN [Node].EnumTagType ett
			ON base.EnumTagTypeID = ett.EnumTagTypeID
		LEFT JOIN [Node].EnumTagSQLType etst
			ON etst.EnumTagTypeID = ett.EnumTagTypeID
)

SELECT
	*
FROM
	Hierarchy
GO


CREATE VIEW [Node].vwTagSQLType AS
SELECT
	s.EnumTagSQLTypeID,
	s.EnumTagTypeID,
	t.[Key] AS TypeKey,
	t.[Value] AS TypeValue,
	s.[Value],
	s.Data1,
	s.Data2,
	s.Data3,
	CASE
		WHEN s.Data2 IS NOT NULL THEN CONCAT(s.[Value], '(', s.Data1, ',', s.Data2, ')')
		WHEN s.Data1 IS NOT NULL THEN CONCAT(s.[Value], '(', s.Data1, ')')
		ELSE s.[Value]
	END AS SQLTypeFull
FROM
	[Node].EnumTagSQLType s
	INNER JOIN [Node].EnumTagType t
		ON s.EnumTagTypeID = t.EnumTagTypeID
WHERE
	s.DeactivatedDT IS NULL
GO