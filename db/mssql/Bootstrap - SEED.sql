USE DMS
GO

INSERT INTO [Node].EnumTagType ([Key], [Value], IsHyperTag)
VALUES
	('NAMESPACE', 'namespace', 1),
	('GROUP', 'group', 1),
	('SCHEMA', 'schema', 1),

	('ANY', 'any', 0),
	('COMPOUND', 'comp', 0),
	('BOOLEAN', 'bool', 0),
	('UINT8', 'uint8', 0),
	('UINT16', 'uint16', 0),
	('UINT32', 'uint32', 0),
	('INT8', 'int8', 0),
	('INT16', 'int16', 0),
	('INT32', 'int32', 0),
	('FLOAT32', 'float32', 0),
	('STRING', 'string', 0),
	('CHARACTER', 'char', 0),
	('ARRAY', 'array', 0),
	('OBJECT', 'object', 0),
	('FUNCTION', 'fn', 0);

INSERT INTO [Node].EnumTagSQLType (EnumTagTypeID, [Value], Data1)
VALUES
	([Node].GetEnumTagType('STRING', 1, 0), 'VARCHAR', '255'),
	([Node].GetEnumTagType('CHARACTER', 1, 0), 'VARCHAR', '1'),
	([Node].GetEnumTagType('INT8', 1, 0), 'TINYINT', NULL),
	([Node].GetEnumTagType('INT16', 1, 0), 'SMALLINT', NULL),
	([Node].GetEnumTagType('INT32', 1, 0), 'INT', NULL),
	([Node].GetEnumTagType('UINT8', 1, 0), 'SMALLINT', NULL),
	([Node].GetEnumTagType('UINT16', 1, 0), 'INT', NULL),
	([Node].GetEnumTagType('UINT32', 1, 0), 'BIGINT', NULL),
	([Node].GetEnumTagType('FLOAT32', 1, 0), 'REAL', NULL),
	([Node].GetEnumTagType('BOOLEAN', 1, 0), 'BIT', NULL),
	([Node].GetEnumTagType('GROUP', 1, 0), 'VARCHAR', 'MAX'),
	([Node].GetEnumTagType('COMPOUND', 1, 0), 'VARCHAR', 'MAX'),
	([Node].GetEnumTagType('ARRAY', 1, 0), 'VARCHAR', 'MAX'),
	([Node].GetEnumTagType('OBJECT', 1, 0), 'VARCHAR', 'MAX'),
	([Node].GetEnumTagType('FUNCTION', 1, 0), 'VARCHAR', 'MAX');