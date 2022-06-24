USE DMS
GO


--	==============================================
--		SELECT
--	==============================================
SELECT
	*
FROM
	Core.Domain;

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
	Core.vwDomain;

SELECT
	*
FROM
	Core.Component;

SELECT
	*
FROM
	Core.Reducer;

SELECT
	*
FROM
	Core.Metadata;


--	==============================================
--		INFORMATION SCHEMA
--	==============================================
--SELECT
--	*
--FROM
--	INFORMATION_SCHEMA.TABLES;

--SELECT
--	*
--FROM
--	INFORMATION_SCHEMA.COLUMNS;