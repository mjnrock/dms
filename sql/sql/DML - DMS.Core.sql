USE DMS
GO


--	==============================================
--		SEED
--	==============================================
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
	[Name],
	[Data]
)
VALUES
	(3, 'Position', '{"x":"uint8", "y":"uint8"}'),
	(3, 'Position3', '{"x":"uint8", "y":"uint8", "z":"uint8"}'),
	(3, 'Velocity', '{"vx":"int8", "vy":"int8", "vz":"int8"}');


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

	
DECLARE @Ref VARCHAR(255) = (SELECT UUID FROM Core.Component WHERE [Name] = 'Position');
DECLARE @Ref2 VARCHAR(255) = (SELECT UUID FROM Core.Component WHERE [Name] = 'Position3');
INSERT INTO Core.Metadata (
	Ref,
	RefType,
	Tags
)
VALUES
	(@Ref, 'Component', '["physics", "2d"]'),
	(@Ref2, 'Component', '["physics", "3d"]');