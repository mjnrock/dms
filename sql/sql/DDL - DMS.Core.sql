USE DMS
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--CREATE SCHEMA Core
--GO

--	==============================================
--		SMART DROP
--	==============================================
DECLARE @Schema VARCHAR(255) = 'Core';
DECLARE @SQL NVARCHAR(MAX) = '';

SELECT
	@SQL = @SQL + 'ALTER TABLE ['+s.name+'].['+t.name+'] DROP CONSTRAINT ['+o.name+'];'
FROM
	sys.foreign_key_columns fkc
	INNER JOIN sys.objects o
		ON fkc.constraint_object_id = o.object_id
	INNER JOIN sys.tables t
		ON fkc.parent_object_id = t.object_id
	INNER JOIN sys.schemas s
		ON t.schema_id = s.schema_id
WHERE
	s.name = @Schema
EXEC(@SQL);


SET @SQL = '';
SELECT
	@SQL = @SQL + 'IF OBJECT_ID('''+s.name+'.['+t.name+']'') IS NOT NULL DROP TABLE '+s.name+'.['+t.name+'];'
FROM
	sys.tables t
	INNER JOIN sys.schemas s
		ON t.schema_id = s.schema_id
WHERE
	s.name = @Schema
EXEC(@SQL);


SET @SQL = '';
SELECT
	@SQL = @SQL + 'IF OBJECT_ID('''+s.name+'.['+t.name+']'') IS NOT NULL DROP VIEW '+s.name+'.['+t.name+'];'
FROM
	sys.views t
	INNER JOIN sys.schemas s
		ON t.schema_id = s.schema_id
WHERE
	s.name = @Schema
EXEC(@SQL);


SET @SQL = '';
SELECT
	@SQL = @SQL + 'DROP PROCEDURE [' + routine_schema + '].[' + routine_name + ']'
FROM 
    information_schema.routines
WHERE
	routine_schema = @Schema
	AND routine_type = 'PROCEDURE'
EXEC(@SQL);


SET @SQL = '';
SELECT
	@SQL = @SQL + 'DROP FUNCTION [' + routine_schema + '].[' + routine_name + ']'
FROM 
    information_schema.routines
WHERE
	routine_schema = @Schema
	AND routine_type = 'FUNCTION'
EXEC(@SQL);


GO

--	==============================================
--		Enumerators
--	==============================================
CREATE TABLE Core.EnumComponentDataType (
	EnumComponentDataTypeID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	[Value] VARCHAR(255) NOT NULL,

	UUID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CreatedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	DeactivatedDateTimeUTC DATETIME2(3) NULL
);
GO
CREATE OR ALTER TRIGGER UpperCaseValues
	ON Core.EnumComponentDataType
	AFTER INSERT, UPDATE
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE t
	SET
		[Value] = UPPER(Utility.RegexReplace(t.[Value], '^a-z0-9\._'))
	FROM
		Core.EnumComponentDataType t
		INNER JOIN INSERTED i
			ON t.EnumComponentDataTypeID = i.EnumComponentDataTypeID
END
GO


--	==============================================
--		TABLES
--	==============================================
CREATE TABLE Core.Domain (
	DomainID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	ParentDomainID INT NULL FOREIGN KEY REFERENCES Core.Domain (DomainID),
	[Name] VARCHAR(255) NOT NULL,			-- nstring

	UUID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CreatedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	DeactivatedDateTimeUTC DATETIME2(3) NULL
);

CREATE TABLE Core.Component (
	ComponentID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	DomainID INT NOT NULL FOREIGN KEY REFERENCES Core.Domain (DomainID),
	[Name] VARCHAR(255) NOT NULL,			-- string

	UUID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CreatedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	DeactivatedDateTimeUTC DATETIME2(3) NULL
);

CREATE TABLE Core.ComponentData (
	ComponentDataID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	ComponentID INT NOT NULL FOREIGN KEY REFERENCES Core.Component (ComponentID),
	EnumComponentDataTypeID INT NOT NULL FOREIGN KEY REFERENCES Core.EnumComponentDataType (EnumComponentDataTypeID),
	
	[Key] VARCHAR(255) NOT NULL,
	[Value] NVARCHAR(MAX) NULL,	-- This would be popuplated only under situations where the type alone is not sufficient to describe the data (e.g. nested Components -- FK ref here)
	Getter NVARCHAR(MAX) NULL,	-- An optional accessor function
	Setter NVARCHAR(MAX) NULL,	-- An optional reducer function

	UUID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CreatedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	DeactivatedDateTimeUTC DATETIME2(3) NULL
);

CREATE TABLE Core.Reducer (
	ReducerID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	DomainID INT NOT NULL FOREIGN KEY REFERENCES Core.Domain (DomainID),
	Fn NVARCHAR(MAX) NOT NULL,				-- fn
	Scope VARCHAR(4000) NULL,				-- string[]

	UUID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CreatedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	DeactivatedDateTimeUTC DATETIME2(3) NULL
);

CREATE TABLE Core.Entity (
	EntityID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	DomainID INT NOT NULL FOREIGN KEY REFERENCES Core.Domain (DomainID),
	[Name] VARCHAR(255) NOT NULL,			-- string
	[Type] VARCHAR(4000) NULL,				-- string[]

	UUID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CreatedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	DeactivatedDateTimeUTC DATETIME2(3) NULL
);

CREATE TABLE Core.EntityComponent (
	EntityComponentID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	EntityID INT NOT NULL FOREIGN KEY REFERENCES Core.Entity (EntityID),
	ComponentID INT NOT NULL FOREIGN KEY REFERENCES Core.Component (ComponentID),
	[Order] INT NULL,

	UUID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CreatedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	DeactivatedDateTimeUTC DATETIME2(3) NULL
);

CREATE TABLE Core.Metadata (
	MetadataID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	Ref UNIQUEIDENTIFIER NOT NULL,			-- @uuid
	RefType VARCHAR(255) NOT NULL,			-- enum<table_names>
	[Namespace] VARCHAR(255) NULL,			-- string
	Tags VARCHAR(4000) NULL,				-- string[]
	[Description] NVARCHAR(MAX) NULL,		-- markdown

	UUID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CreatedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	DeactivatedDateTimeUTC DATETIME2(3) NULL
);
ALTER TABLE Core.Metadata
	ADD CONSTRAINT [Tags as JSON] CHECK (ISJSON(Tags)=1);



GO
--	==============================================
--		VIEWS
--	==============================================
CREATE VIEW Core.vwDomain AS
WITH CTE (UUID, [Name], DomainID, ParentDomainID, [Level], [Path], CreatedDateTimeUTC, ModifiedDateTimeUTC, DeactivatedDateTimeUTC) AS (
	SELECT
		UUID,
		[Name],
		DomainID,
		NULL,
		0 AS [Level],
		CAST(Utility.RegexReplace([Name], '^a-z0-9\._') AS VARCHAR(255)) AS [Path],
		CreatedDateTimeUTC,
		ModifiedDateTimeUTC,
		DeactivatedDateTimeUTC
	FROM
		Core.Domain
	WHERE
		ParentDomainID IS NULL

	UNION ALL
	
	SELECT
		d.UUID,
		d.[Name],
		d.DomainID,
		d.ParentDomainID,
		[Level] + 1,
		CAST(CONCAT([Path], ' / ', Utility.RegexReplace(d.[Name], '^a-z0-9\._')) AS VARCHAR(255)),
		d.CreatedDateTimeUTC,
		d.ModifiedDateTimeUTC,
		d.DeactivatedDateTimeUTC
	FROM
		Core.Domain d
		INNER JOIN CTE d0
			ON d.ParentDomainID = d0.DomainID
)
SELECT
	DomainID,
	ParentDomainID,
	[Name],
	UUID,
	[Level],
	[Path],
	CreatedDateTimeUTC,
	ModifiedDateTimeUTC,
	DeactivatedDateTimeUTC
FROM
	CTE;
GO

CREATE VIEW Core.vwComponentTags AS
SELECT
	c.ComponentID,
	c.UUID AS ComponentUUID,
	c.[Name] AS Component,
	m.MetadataID,
	m.UUID AS MetadataUUID,
	j.[key] AS [Index],
	j.[value] AS Tag
FROM
	Core.Metadata m
	INNER JOIN Core.Component c
		ON m.RefType = 'Component'
		AND m.Ref = c.UUID
	CROSS APPLY OPENJSON(m.Tags, '$') j
GO

CREATE VIEW Core.vwEntity AS
SELECT
	e.EntityID,
	e.DomainID,
	e.[Name],
	e.[Type],
	e.UUID,
	e.CreatedDateTimeUTC,
	e.ModifiedDateTimeUTC,
	e.DeactivatedDateTimeUTC,
	ec.EntityComponentID,
	ec.UUID AS EntityComponentUUID,
	c.ComponentID,
	c.UUID AS ComponentUUID,
	ec.[Order] AS ComponentOrder,
	c.[Name] AS Component,
	cd.[Key] AS ComponentDataKey,
	ecdt.[Value] AS ComponentDataType,
	cd.[Value] AS ComponentDataValue,
	cd.[Getter] AS ComponentDataGetter,
	cd.[Setter] AS ComponentDataSetter
FROM
	Core.Entity e
	LEFT JOIN Core.EntityComponent ec
		ON e.EntityID = ec.EntityID
	LEFT JOIN Core.Component c
		ON ec.ComponentID = c.ComponentID
	LEFT JOIN Core.ComponentData cd
		ON c.ComponentID = cd.ComponentID
	LEFT JOIN Core.EnumComponentDataType ecdt
		ON cd.EnumComponentDataTypeID = ecdt.EnumComponentDataTypeID
GO



--	==============================================
--		TVF
--	==============================================
CREATE FUNCTION Core.tvfGetComponentTags
(	
	@InputFlag VARCHAR(255) = 'name',
	@Input VARCHAR(255)
)
RETURNS TABLE 
AS
RETURN 
(
	SELECT
		c.ComponentID,
		c.UUID AS ComponentUUID,
		c.[Name] AS Component,
		m.MetadataID,
		m.UUID AS MetadataUUID,
		j.[key] AS [Index],
		j.[value] AS Tag
	FROM
		Core.Metadata m
		INNER JOIN Core.Component c
			ON m.RefType = 'Component'
			AND m.Ref = c.UUID
		CROSS APPLY OPENJSON(m.Tags, '$') j
	WHERE
		(
			@InputFlag = 'name'
			AND c.[Name] = @Input
		) OR (
			@InputFlag = 'id'
			AND c.ComponentID = CAST(@Input AS INT)
		) OR (
			@InputFlag = 'uuid'
			AND c.UUID = @Input
		)
)
GO



CREATE FUNCTION Core.tvfGetEntity
(	
	@InputFlag VARCHAR(255) = 'name',
	@Input VARCHAR(255)
)
RETURNS TABLE 
AS
RETURN 
(
	SELECT
		e.EntityID,
		e.DomainID,
		e.[Name],
		e.[Type],
		e.UUID,
		e.CreatedDateTimeUTC,
		e.ModifiedDateTimeUTC,
		e.DeactivatedDateTimeUTC,
		ec.EntityComponentID,
		ec.UUID AS EntityComponentUUID,
		c.ComponentID,
		c.UUID AS ComponentUUID,
		ec.[Order] AS ComponentOrder,
		c.[Name] AS Component,
		cd.[Key] AS ComponentDataKey,
		ecdt.[Value] AS ComponentDataType,
		cd.[Value] AS ComponentDataValue,
		cd.[Getter] AS ComponentDataGetter,
		cd.[Setter] AS ComponentDataSetter
	FROM
		Core.Entity e
		LEFT JOIN Core.EntityComponent ec
			ON e.EntityID = ec.EntityID
		LEFT JOIN Core.Component c
			ON ec.ComponentID = c.ComponentID
		LEFT JOIN Core.ComponentData cd
			ON c.ComponentID = cd.ComponentID
		LEFT JOIN Core.EnumComponentDataType ecdt
			ON cd.EnumComponentDataTypeID = ecdt.EnumComponentDataTypeID
	WHERE
		(
			@InputFlag = 'name'
			AND e.[Name] = @Input
		) OR (
			@InputFlag = 'id'
			AND e.EntityID = CAST(@Input AS INT)
		) OR (
			@InputFlag = 'uuid'
			AND e.UUID = @Input
		)
)
GO



--	==============================================
--		Meta
--	==============================================
CREATE VIEW Core.vwInformationSchema AS
SELECT
	c.TABLE_NAME AS [Table],
	c.COLUMN_NAME AS [Column],
	c.DATA_TYPE AS DataType,
	c.ORDINAL_POSITION AS [Order],
	COALESCE(
		c.CHARACTER_MAXIMUM_LENGTH,
		c.NUMERIC_PRECISION,
		c.DATETIME_PRECISION
	) AS [Precision],
	c.COLUMN_DEFAULT AS [Default],
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
	c.TABLE_SCHEMA = 'Core'
	AND t.TABLE_TYPE = 'BASE TABLE'