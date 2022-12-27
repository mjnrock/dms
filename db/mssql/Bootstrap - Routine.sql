USE DMS
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('[Node].GetEnumTagType') IS NOT NULL DROP FUNCTION [Node].GetEnumTagType;
IF OBJECT_ID('[Node].GetEnumTagSQLType') IS NOT NULL DROP FUNCTION [Node].GetEnumTagSQLType;
IF OBJECT_ID('[Node].CreateSchemaTable') IS NOT NULL DROP PROCEDURE [Node].CreateSchemaTable;
GO


CREATE FUNCTION [Node].GetEnumTagType
(
	@Input VARCHAR(MAX),
	@FlagInput INT = 0,
	@FlagOutput INT = 0
)
RETURNS VARCHAR(MAX)
AS
BEGIN
	DECLARE @Return VARCHAR(MAX)

	SELECT
		@Return = CASE
			WHEN @FlagOutput = 0 THEN CAST(EnumTagTypeID AS VARCHAR(MAX))
			WHEN @FlagOutput = 1 THEN [Key]
			WHEN @FlagOutput = 2 THEN [Value]
		END
	FROM
		[Node].EnumTagType
	WHERE
		(
			@FlagInput = 0
			AND CAST(EnumTagTypeID AS VARCHAR(MAX)) = @Input
		)
		OR
		(
			@FlagInput = 1
			AND [Key] = @Input
		)
		OR
		(
			@FlagInput = 2
			AND [Value] = @Input
		)

	RETURN @Return

END
GO


CREATE FUNCTION [Node].GetEnumTagSQLType
(
	@Input VARCHAR(MAX),
	@FlagInput INT = 0,
	@FlagOutput INT = 0
)
RETURNS VARCHAR(MAX)
AS
BEGIN
	DECLARE @Return VARCHAR(MAX)

	SELECT
		@Return = CASE
			WHEN @FlagOutput = 0 THEN CAST(a.EnumTagSQLTypeID AS VARCHAR(MAX))
			WHEN @FlagOutput = 1 THEN CAST(a.EnumTagTypeID AS VARCHAR(MAX))
			WHEN @FlagOutput = 2 THEN a.[Value]
			WHEN @FlagOutput = 3 THEN b.[Key]
			WHEN @FlagOutput = 4 THEN b.[Value]
		END
	FROM
		[Node].EnumTagSQLType a
		INNER JOIN [Node].EnumTagType b
			ON a.EnumTagTypeID = b.EnumTagTypeID
	WHERE
		(
			@FlagInput = 0
			AND CAST(a.EnumTagSQLTypeID AS VARCHAR(MAX)) = @Input
		)
		OR
		(
			@FlagInput = 1
			AND CAST(a.EnumTagTypeID AS VARCHAR(MAX)) = @Input
		)
		OR
		(
			@FlagInput = 2
			AND a.[Value] = @Input
		)
		OR
		(
			@FlagInput = 3
			AND b.[Key] = @Input
		)
		OR
		(
			@FlagInput = 4
			AND b.[Value] = @Input
		)

	RETURN @Return

END
GO

CREATE PROCEDURE [Node].CreateSchemaTable
	@UUID VARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @SQL VARCHAR(MAX) = 'CREATE TABLE [Node].[' + @UUID + '] (
		$RecordID INT IDENTITY(1,1) PRIMARY KEY,' + CHAR(13) + CHAR(10);

	DECLARE @Table TABLE (ID INT IDENTITY, Alias VARCHAR(255), SQLType VARCHAR(255));

	INSERT INTO @Table (Alias, SQLType)
	SELECT
		COALESCE(t.Alias, CAST(t.UUID AS VARCHAR(255))) AS Alias,
		t.SQLType
	FROM
		[Node].Field f
		INNER JOIN [Node].[Schema] s
			ON f.SchemaID = s.SchemaID
		INNER JOIN [Node].vwTagHierarchy t
			ON f.TagUUID = t.UUID
	WHERE
		s.TagUUID = @UUID
		AND t.EnumTagTypeID != [Node].GetEnumTagType('SCHEMA', 1, 0)

	SELECT CONCAT(Alias, ' ', SQLType, ' NULL') FROM @Table
		
	DECLARE @i INT = 0;
	DECLARE @size INT = (SELECT COUNT(*) FROM @Table);

	IF @size < 1 RETURN 0;

	WHILE @i < @size
		BEGIN
			SELECT @SQL = @SQL + CONCAT(CHAR(9), CHAR(9), '[', Alias, '] ', SQLType, ' NULL', ',', CHAR(13), CHAR(10)) FROM @Table WHERE ID = @i;

			SET @i = @i + 1;
		END

	SET @SQL = @SQL + '		$CreatedDT DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
		$ModifiedDT DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
		$DeactivatedDT DATETIME2 NULL
	);';
	
    EXEC (@SQL);

	SET @SQL = 'SELECT * FROM [Node].[' + @UUID + ']';
	
    EXEC (@SQL);
END
GO
