USE DMS
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('[Node].GetEnumTagType') IS NOT NULL DROP FUNCTION [Node].GetEnumTagType;
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