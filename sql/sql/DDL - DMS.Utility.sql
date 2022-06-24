USE DMS
GO

--CREATE SCHEMA Utility
--GO

--	==============================================
--		SMART DROP
--	==============================================
DECLARE @Schema VARCHAR(255) = 'Utility';
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
--		ROUTINES
--	==============================================
CREATE FUNCTION Utility.RegexReplace
(
    @String NVARCHAR(MAX), 
    @MatchExpression VARCHAR(255)
)
RETURNS NVARCHAR(MAX)
AS
BEGIN
    SET @MatchExpression =  '%['+@MatchExpression+']%'
    
    WHILE PatIndex(@MatchExpression, @String) > 0
        SET @String = Stuff(@String, PatIndex(@MatchExpression, @String), 1, '')
    
    RETURN @String
    
END