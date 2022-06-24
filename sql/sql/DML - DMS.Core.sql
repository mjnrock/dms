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
	(3, 'Position', '{"x":"int", "y":"int"}');