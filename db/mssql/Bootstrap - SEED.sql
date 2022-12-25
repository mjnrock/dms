USE DMS
GO

INSERT INTO [Node].EnumTagType ([Key], [Value], IsHyperTag)
VALUES
	('SCHEMA', 'schema', 1),
	('NAMESPACE', 'namespace', 1),
	('RECORD', 'record', 1),

	('ANY', 'any', 0),
	('GROUP', 'group', 0),
	('BOOLEAN', 'bool', 0),
	('UINT8', 'uint8', 0),
	('INT8', 'int8', 0),
	('STRING', 'string', 0),
	('CHARACTER', 'char', 0),
	('ARRAY', 'array', 0);

INSERT INTO [Node].EnumTagSQLType (EnumTagTypeID, [Value], Data1)
VALUES
	([Node].GetEnumTagType('STRING', 1, 0), 'VARCHAR', '255'),
	([Node].GetEnumTagType('CHARACTER', 1, 0), 'VARCHAR', '1'),
	([Node].GetEnumTagType('INT8', 1, 0), 'TINYINT', NULL),
	([Node].GetEnumTagType('UINT8', 1, 0), 'SMALLINT', NULL),
	([Node].GetEnumTagType('BOOLEAN', 1, 0), 'BIT', NULL),
	([Node].GetEnumTagType('GROUP', 1, 0), 'VARCHAR', 'MAX'),
	([Node].GetEnumTagType('SCHEMA', 1, 0), 'VARCHAR', 'MAX'),
	([Node].GetEnumTagType('ARRAY', 1, 0), 'VARCHAR', 'MAX');