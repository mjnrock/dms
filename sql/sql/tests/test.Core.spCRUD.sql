USE DMS
GO

EXEC Core.spCRUD
	'delete',
	'Domain',
	'',
	'DomainID IN (17)'

EXEC Core.spCRUD
	'upsert',
	'Domain',
	'{"Name":"API", "ParentDomainID":2}'

EXEC Core.spCRUD
	'insert',
	'Domain',
	'{"Name":"API", "ParentDomainID":2}'

EXEC Core.spCRUD
	'update',
	'Domain',
	'{"Name":"API2", "ParentDomainID":6}',
	'Name="API" AND DomainID=9'

EXEC Core.spCRUD
	'read',
	'Domain',	
	'["DomainID", "ParentDomainID", "Name", "UUID"]'
	--'DomainID=1'

EXEC Core.spCRUD
	'read',
	'vwDomain',
	'["DomainID", "ParentDomainID", "Name", "UUID", "Level", "Path"]'