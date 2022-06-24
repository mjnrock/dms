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
	(3, 'Production');


INSERT INTO Core.Component(
	DomainID,
	[Name],
	[Data]
)
VALUES
	(3, 'Position', '{"x":"uint8", "y":"uint8"}'),
	(3, 'Position3', '{"x":"uint8", "y":"uint8", "z":"uint8"}');

	
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