-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE Core.spCRUD
	@Operation VARCHAR(255),
	@Table VARCHAR(255),
	@JSON VARCHAR(4000)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @Schema VARCHAR(255) = 'Core';
	DECLARE @SQL NVARCHAR(MAX) = '';

    IF @Operation = 'read'
		BEGIN
			IF @JSON = '["*"]'
				BEGIN
					SET @SQL = CONCAT('SELECT * FROM ', @Schema, '.', @Table)

					EXEC (@SQL);

					RETURN;
				END
			ELSE
				BEGIN
					SET @SQL = 'SELECT';
														
					SELECT
						@SQL = CONCAT(@SQL, ' [', c.COLUMN_NAME, '], ')
					FROM
						INFORMATION_SCHEMA.COLUMNS c
						INNER JOIN OPENJSON(@JSON) j
							ON c.COLUMN_NAME = j.[value]
					WHERE
						c.TABLE_NAME = @Table

					SET @SQL = CONCAT(SUBSTRING(@SQL, 0, LEN(@SQL)), ' FROM ', @Schema, '.', @Table);

					EXEC (@SQL)
				END
		END
	ELSE IF @Operation = 'insert'
		BEGIN
			SELECT 2;
		END
	ELSE IF @Operation = 'update'
		BEGIN
			SELECT 2;
		END
	ELSE IF @Operation = 'upsert'
		BEGIN
			SELECT 2;
		END
	ELSE IF @Operation = 'delete'
		BEGIN
			SELECT 2;
		END

	RETURN;
END
GO
