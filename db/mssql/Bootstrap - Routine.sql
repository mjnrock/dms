USE DMS
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('[Node].GetEnumTagType') IS NOT NULL DROP FUNCTION [Node].GetEnumTagType;
IF OBJECT_ID('[Node].GetEnumTagSQLType') IS NOT NULL DROP FUNCTION [Node].GetEnumTagSQLType;
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