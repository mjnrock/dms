USE DMS
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('[Node].GetEnumTagType') IS NOT NULL DROP FUNCTION [Node].GetEnumTagType;
IF OBJECT_ID('[Node].GetEnumTagSQLType') IS NOT NULL DROP FUNCTION [Node].GetEnumTagSQLType;
IF OBJECT_ID('[Node].CreateSchemaTable') IS NOT NULL DROP PROCEDURE [Node].CreateSchemaTable;
IF OBJECT_ID('[Node].InsertTag') IS NOT NULL DROP PROCEDURE [Node].InsertTag;
IF OBJECT_ID('[Node].InsertSchema') IS NOT NULL DROP PROCEDURE [Node].InsertSchema;
IF OBJECT_ID('[Node].CreateFields') IS NOT NULL DROP PROCEDURE [Node].CreateFields;
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

CREATE PROCEDURE [Node].InsertTag
	@UUID VARCHAR(255),
	@ParentUUID VARCHAR(255),
	@DType VARCHAR(255),
	@Alias VARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Table TABLE (UUID VARCHAR(255));

    INSERT INTO [Node].Tag (UUID, ParentUUID, EnumTagTypeID, Alias, [Value], Opts)
	OUTPUT Inserted.UUID INTO @Table (UUID)
	VALUES (
		@UUID,
		@ParentUUID,
		[Node].GetEnumTagType(@DType, 2, 0),
		@Alias,
		NULL,
		NULL
	);

	SELECT
		*
	FROM
		[Node].Tag
	WHERE
		UUID = @UUID;
END
GO

CREATE PROCEDURE [Node].InsertSchema
	@UUID VARCHAR(255),
	@NamespaceID INT NULL
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Table TABLE (UUID VARCHAR(255));

    INSERT INTO [Node].[Schema] (TagUUID, NamespaceID)
	OUTPUT Inserted.TagUUID INTO @Table (UUID)
	VALUES (
		@UUID,
		@NamespaceID
	);

	SELECT
		*
	FROM
		[Node].[Schema]
	WHERE
		TagUUID = @UUID;
END
GO

CREATE PROCEDURE [Node].CreateFields
	@TagUUID VARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Table TABLE (UUID VARCHAR(255));
	
    INSERT INTO [Node].Field (SchemaID, EnumTagSQLTypeID, TagUUID)
	OUTPUT Inserted.TagUUID INTO @Table (UUID)
	SELECT
		s.SchemaID,
		t.EnumTagSQLTypeID,
		t.UUID
	FROM
		[Node].vwTagHierarchy t
		INNER JOIN [Node].[Schema] s
			ON t.RootUUID = @TagUUID

	SELECT
		*
	FROM
		[Node].Field f
		INNER JOIN [Node].[Schema] s
			ON f.SchemaID = s.SchemaID
END
GO


CREATE PROCEDURE [Node].CreateSchemaTable
	@TagUUID VARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	SET @TagUUID = UPPER(@TagUUID);

	EXEC [Node].CreateFields @TagUUID;

	DECLARE @SQL VARCHAR(MAX) = 'CREATE TABLE [Node].[' + @TagUUID + '] (
		RecordID INT IDENTITY(1,1) PRIMARY KEY,' + CHAR(13) + CHAR(10);
		
	SELECT
		@SQL = COALESCE(@SQL, N'') + CONCAT(CHAR(9), CHAR(9), '[', Alias, '] ', SQLType, ' NULL', ',', CHAR(13), CHAR(10))
	FROM
		[Node].Field f
		INNER JOIN [Node].[Schema] s
			ON f.SchemaID = s.SchemaID
		INNER JOIN [Node].vwTagHierarchy t
			ON f.TagUUID = t.UUID
	WHERE
		s.TagUUID = @TagUUID
		AND t.EnumTagTypeID != [Node].GetEnumTagType('SCHEMA', 1, 0)

	SET @SQL = @SQL + '		CreatedDateTime DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
		ModifiedDateTime DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
		DeactivatedDateTime DATETIME2 NULL
	);';

	PRINT @SQL;
	
    EXEC (@SQL);

	SET @SQL = 'SELECT * FROM [Node].[' + @TagUUID + ']';
	
    EXEC (@SQL);
END
GO