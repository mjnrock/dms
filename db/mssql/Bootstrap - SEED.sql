USE DMS
GO

INSERT INTO [Node].EnumTagType ([Key], [Value], IsHyperTag)
VALUES
	('SCHEMA', 'bool', 1),
	('NAMESPACE', 'namespace', 1),
	('RECORD', 'record', 1),

	('ANY', 'any', 0),
	('GROUP', 'group', 0),
	('BOOLEAN', 'bool', 0),
	('UINT8', 'uint8', 0),
	('INT8', 'bool', 0),
	('STRING', 'string', 0),
	('CHARACTER', 'char', 0),
	('ARRAY', 'array', 0);

INSERT INTO [Node].EnumTagSQLType (EnumTagTypeID, [Value], Data1)
VALUES
	([Node].GetEnumTagType('STRING', 1, 0), 'VARCHAR', 'MAX'),
	([Node].GetEnumTagType('INT8', 1, 0), 'TINY', NULL);