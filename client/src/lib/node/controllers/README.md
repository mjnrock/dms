# Controllers
A **Controller** is a conceptual term that describes a class or function -- or plurality of such -- that simply performs some task or set of tasks.  It is meant to be the highest-level conceptual term that would describe such abstract work *when it is within the scope of the Node module*.

> A controller can be anything that does work, so API facilitation, filesystem work, or anything else will utlimately derive from (and do work as) a controller.
> 
## Example:	De/Serialization
Data de/serialization from/to a source system (e.g. flat file, db, etc.) into the wrapper Node objects.  The `DataToNode` set of functions performs this kind of work.