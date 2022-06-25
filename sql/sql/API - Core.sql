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
-- ================================================
-- Author:		Matt Nawrocki
-- Create date: 2022-06-24
-- Description:	A generic JSON-to-CRUD facilitation
--		routine.
-- ================================================
ALTER PROCEDURE Core.spCRUD
	@Operation VARCHAR(255),
	@Table VARCHAR(255),
	@JSON VARCHAR(4000),
	@Clause VARCHAR(4000) = ''
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @Schema VARCHAR(255) = 'Core';
	DECLARE @SQL NVARCHAR(MAX) = '';
	DECLARE @Where NVARCHAR(MAX) = @Clause;

    IF @Operation = 'read'
		BEGIN
			IF @JSON = '["*"]'
				BEGIN
					SET @SQL = CONCAT('SELECT * FROM ', @Schema, '.', @Table);
				END
			ELSE
				BEGIN
					SET @SQL = 'SELECT';
														
					SELECT
						@SQL = CONCAT(@SQL, '[', c.COLUMN_NAME, '],')
					FROM
						INFORMATION_SCHEMA.COLUMNS c
						INNER JOIN OPENJSON(@JSON) j
							ON c.COLUMN_NAME = j.[value]
					WHERE
						c.TABLE_NAME = @Table;

					SET @SQL = CONCAT(SUBSTRING(@SQL, 0, LEN(@SQL)), ' FROM ', @Schema, '.', @Table);
				END
		END
	ELSE IF @Operation = 'insert'
		BEGIN
			SET @SQL = CONCAT('INSERT INTO ', @Schema, '.', @Table, '(');
														
			SELECT
				@SQL = CONCAT(@SQL, '[', c.COLUMN_NAME, '],')
			FROM
				INFORMATION_SCHEMA.COLUMNS c
				INNER JOIN OPENJSON(@JSON) j
					ON c.COLUMN_NAME = j.[key] COLLATE SQL_Latin1_General_CP1_CI_AS
			WHERE
				c.TABLE_NAME = @Table;

			SET @SQL = CONCAT(SUBSTRING(@SQL, 0, LEN(@SQL)), ') VALUES (');

			SELECT
				@SQL = CONCAT(@SQL,
					CASE j.[type]
						WHEN 1 THEN CONCAT('''', j.[value], '''')
						ELSE j.[value]
					END,
					', ')
			FROM
				OPENJSON(@JSON) j;

			SET @SQL = CONCAT(SUBSTRING(@SQL, 0, LEN(@SQL)), ')');
		END
	ELSE IF @Operation = 'update'
		BEGIN
			SET @SQL = CONCAT('UPDATE ', @Schema, '.', @Table, ' SET ');
														
			SELECT
				@SQL = CONCAT(@SQL, '[', j.[key], '] = ',
					CASE j.[type]
						WHEN 1 THEN CONCAT('''', j.[value], '''')
						ELSE j.[value]
					END,
					', ')
			FROM
				INFORMATION_SCHEMA.COLUMNS c
				INNER JOIN OPENJSON(@JSON) j
					ON c.COLUMN_NAME = j.[key] COLLATE SQL_Latin1_General_CP1_CI_AS
			WHERE
				c.TABLE_NAME = @Table;
				
			SET @SQL = SUBSTRING(@SQL, 0, LEN(@SQL));
		END
	ELSE IF @Operation = 'upsert'
		BEGIN
			SET @SQL = CONCAT('SELECT COUNT(*) FROM ', @Schema, '.', @Table);
			
			DECLARE @ResultCount INT = 0;
			IF LEN(@Where) > 0
				BEGIN
					SET @SQL = REPLACE(CONCAT(@SQL, ' WHERE ', @Where), '"', '''');

					DECLARE @test AS TABLE([total] int);

					INSERT INTO @test
					EXECUTE sp_executesql @SQL;

					SELECT
						@ResultCount = [total]
					FROM
						@test
				END

			IF @ResultCount > 0
				BEGIN
					EXEC Core.spCRUD
						'update',
						@Table,
						@JSON,
						@Where;

					RETURN;
				END
			ELSE
				BEGIN
					EXEC Core.spCRUD
						'insert',
						@Table,
						@JSON,
						@Where;

					RETURN;
				END
		END
	ELSE IF @Operation = 'delete'
		BEGIN
			IF LEN(@Where) > 0
				BEGIN
					SET @SQL = CONCAT('DELETE FROM ', @Schema, '.', @Table);
				END
			ELSE
				BEGIN
					RETURN;
				END
		END
		

	IF LEN(@Where) > 0
		BEGIN
			SET @SQL = REPLACE(CONCAT(@SQL, ' WHERE ', @Where), '"', '''');
		END
		
	--SELECT @SQL;
	EXEC (@SQL);

	RETURN;
END
GO