USE DMS
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
	DomainID INT NULL FOREIGN KEY REFERENCES Core.Domain (DomainID),
	[Name] VARCHAR(255) NOT NULL,			-- string
	[Data] NVARCHAR(MAX) NOT NULL,			-- json

	UUID UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
	CreatedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	ModifiedDateTimeUTC DATETIME2(3) NOT NULL DEFAULT SYSUTCDATETIME(),
	DeactivatedDateTimeUTC DATETIME2(3) NULL
);
ALTER TABLE Core.Component
	ADD CONSTRAINT [Data as JSON] CHECK (ISJSON([Data])=1);

CREATE TABLE Core.Reducer (
	ReducerID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	DomainID INT NULL FOREIGN KEY REFERENCES Core.Domain (DomainID),
	Fn NVARCHAR(MAX) NOT NULL,				-- fn
	Scope VARCHAR(4000) NULL,				-- string[]

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
		CAST(CONCAT([Path], '.', Utility.RegexReplace(d.[Name], '^a-z0-9\._')) AS VARCHAR(255)),
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