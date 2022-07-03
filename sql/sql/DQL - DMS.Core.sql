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
	*
FROM
	Core.vwDomain;

SELECT
	*
FROM
	Core.EnumComponentDataType;

SELECT
	*
FROM
	Core.Component;

SELECT
	*
FROM
	Core.ComponentData;

SELECT
	*
FROM
	Core.Entity;

SELECT
	*
FROM
	Core.vwEntity;

SELECT
	*
FROM
	Core.tvfGetEntity('name', 'Skwrl');
	--Core.tvfGetEntity('id', 1);
	
SELECT
	*
FROM
	Core.EntityComponent;

SELECT
	*
FROM
	Core.Reducer;

SELECT
	*
FROM
	Core.Metadata;

SELECT
	*
FROM
	Core.vwComponentTags;

SELECT
	*
FROM
	Core.tvfGetComponentTags('name', 'Position');
	--Core.tvfGetComponentTags('uuid', 'EB72D281-C82F-4C1E-B406-34E01D69AC23');
	--Core.tvfGetComponentTags('id', 1);


--	==============================================
--		INFORMATION SCHEMA
--	==============================================
SELECT
	*
FROM
	Core.vwInformationSchema

--SELECT
--	*
--FROM
--	INFORMATION_SCHEMA.TABLES;

--SELECT
--	*
--FROM
--	INFORMATION_SCHEMA.COLUMNS;