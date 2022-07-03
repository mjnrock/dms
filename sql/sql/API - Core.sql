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
CREATE OR ALTER PROCEDURE Core.spCRUD
	@Operation VARCHAR(255),
	@Table VARCHAR(255),
	@JSON VARCHAR(4000),
	@Where NVARCHAR(MAX) = ''
AS
BEGIN
	SET NOCOUNT OFF;
	DECLARE @Schema VARCHAR(255) = 'Core';
	DECLARE @SQL NVARCHAR(MAX) = '';
	DECLARE @FQN VARCHAR(255) = CONCAT('[', @Schema, '].[', @Table, ']');	-- Expect entries to NOT be quoted (make more robust later)

    IF @Operation = 'READ' OR @Operation = 'read'
		BEGIN
			IF (@JSON = '["*"]' OR @JSON = '[ "*" ]' OR @JSON = '"*"' OR @JSON = '*')
				BEGIN
					SET @SQL = CONCAT('SELECT * FROM ', @FQN);
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

					SET @SQL = CONCAT(SUBSTRING(@SQL, 0, LEN(@SQL)), ' FROM ', @FQN);
				END
		END
	ELSE IF @Operation = 'INSERT' OR @Operation = 'insert'
		BEGIN
			SET @SQL = CONCAT('INSERT INTO ', @FQN, '(');
														
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
						WHEN 1 THEN
							CASE
								WHEN j.[value] = 'NULL' OR j.[value] = 'null' THEN 'NULL'
								ELSE CONCAT('''', j.[value], '''')
							END
						ELSE j.[value]
					END,
					', ')
			FROM
				OPENJSON(@JSON) j;

			SET @SQL = CONCAT(SUBSTRING(@SQL, 0, LEN(@SQL)), ')');
		END
	ELSE IF @Operation = 'UPDATE' OR @Operation = 'update'
		BEGIN
			SET @SQL = CONCAT('UPDATE ', @FQN, ' SET ');

			IF @JSON = 'ON' OR @JSON = 'on'
				BEGIN
					SET @SQL = CONCAT(@SQL, 'DeactivatedDateTimeUTC = NULL');
				END
			ELSE IF @JSON = 'OFF' OR @JSON = 'off'
				BEGIN
					SET @SQL = CONCAT(@SQL, 'DeactivatedDateTimeUTC = ''', SYSUTCDATETIME(), '''');
				END
			ELSE
				BEGIN														
					SELECT
						@SQL = CONCAT(@SQL, '[', j.[key], '] = ',
							CASE j.[type]
								WHEN 1 THEN
									CASE
										WHEN j.[value] = 'NULL' OR j.[value] = 'null' THEN 'NULL'
										ELSE CONCAT('''', j.[value], '''')
									END
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
		END
	ELSE IF @Operation = 'UPSERT' OR @Operation = 'upsert'
		BEGIN
			SET @SQL = CONCAT('SELECT COUNT(*) FROM ', @FQN);
			
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
	ELSE IF @Operation = 'DELETE' OR @Operation = 'delete'
		BEGIN
			IF LEN(@Where) > 0
				BEGIN
					SET @SQL = CONCAT('DELETE FROM ', @FQN);
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
		
	EXEC sp_executesql @SQL;	

	IF @Operation != 'READ' AND @Operation != 'read'
		BEGIN
			/* Store the number of rows affected for use, if needed */
			DECLARE @RowsAffected INT = 0;
			SELECT @RowsAffected = @@ROWCOUNT;
			
			SELECT @RowsAffected AS RowsAffected;
		END

	RETURN;
END
GO
