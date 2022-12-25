/* Recursively reconstitute the tag hierarchy */
WITH RCTE([Level], UUID, ParentUUID, EnumTagTypeID) AS (
	SELECT
		0,
		c.UUID,
		c.ParentUUID,
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