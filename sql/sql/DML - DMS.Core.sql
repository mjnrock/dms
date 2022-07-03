USE DMS
GO


--	==============================================
--		SEED
--	==============================================
INSERT INTO Core.EnumRefType (
	[Value]
)
SELECT DISTINCT
	[Table]
FROM
	Core.vwInformationSchema
ORDER BY
	[Table];

INSERT INTO Core.EnumDataType (
	[Value]
)
VALUES
	('boolean'),
	('character'),
	('string'),
	('uuid'),
	('markdown'),
	('number'),
	('uint8'),
	('uint16'),
	('uint32'),
	('uint64'),
	('int8'),
	('int16'),
	('int32'),
	('int64'),
	('float32'),
	('float64'),
	('date'),
	('time'),
	('datetime'),
	
	('component'),
	('entity'),
	('reducer'),
	
	('any'),
	('class'),
	('function'),
	('enum'),
	('set'),
	('map'),
	('object'),
	('array');

INSERT INTO Core.Domain (
	ParentDomainID,
	[Name]
)
VALUES
	(NULL, 'DMS'),
	(1, 'Sandbox'),
	(NULL, 'Fuzzy Knuts'),
	(3, 'Sandbox'),
	(3, 'Development'),
	(3, 'Production'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST'),
	(NULL, 'TEST');


INSERT INTO Core.Component (
	DomainID,
	[Name]
)
VALUES
	(3, 'Position'),
	(3, 'Position3'),
	(3, 'Velocity');

	
DECLARE @EnumInt8 INT = (SELECT EnumDataTypeID FROM Core.EnumDataType WHERE [Value] = 'int8');
DECLARE @EnumUint8 INT = (SELECT EnumDataTypeID FROM Core.EnumDataType WHERE [Value] = 'uint8');
INSERT INTO Core.ComponentData (
	ComponentID,
	[Key],
	EnumDataTypeID,
	[Value],
	[Order]
)
VALUES
	(1, 'x', @EnumUint8, NULL, 1),
	(1, 'y', @EnumUint8, NULL, 2),
	(2, 'x', @EnumUint8, NULL, 1),
	(2, 'y', @EnumUint8, NULL, 2),
	(2, 'y', @EnumUint8, NULL, 3),
	(3, 'vx', @EnumInt8, NULL, 1),
	(3, 'vy', @EnumInt8, NULL, 2);


INSERT INTO Core.Entity (
	DomainID,
	[Name],
	[Type]
)
VALUES
	(3, 'Skwrl', '["living","animal","character"]');


INSERT INTO Core.EntityComponent (
	EntityID,
	ComponentID
)
VALUES
	(1, 1),
	(1, 3);


DECLARE @EnumRefTypeID INT = (SELECT EnumRefTypeID FROM Core.EnumRefType WHERE [Value] = 'Component');
DECLARE @Ref VARCHAR(255) = (SELECT UUID FROM Core.Component WHERE [Name] = 'Position');
DECLARE @Ref2 VARCHAR(255) = (SELECT UUID FROM Core.Component WHERE [Name] = 'Position3');
INSERT INTO Core.Metadata (
	Ref,
	EnumRefTypeID,
	Tags
)
VALUES
	(@Ref, 'Component', '["physics", "2d"]'),
	(@Ref2, 'Component', '["physics", "3d"]');