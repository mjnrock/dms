# Domains
* Namespace
  * View (w/ toggled Editing)
* Meta
  * View
  * Edit
* Data
  * View
  * Edit


## Namespace
The `namespace` is a meta-structure that defines hierarchical associations between nodes.

> These can be useful for creating abstract concepts, such as "Projects", "Dictionaries", "Templates", etc.

This domain is a *application level* construct, intended to manage multiple and different data ecosystems.

## Meta
The `meta` structures schematize data, either statically (i.e. typing) or dynamically (i.e. programmatically).  Conceptually, you can think of this as the *schema* of a data frame.

Example:
**JSON**:
```
{
    Dossier: {
        id: "uuid",
        name: "string",
        bio: "markdown",
        DOB: "date",
        friends: [
            "uuid",
        ],
    },
}
```

**Tabular**:
|parent|alias|type|opts|
|-|-|-|-|
||Dossier|`namespace`||
||id|`uuid`||
||name|`string`||
||bio|`markdown`||
||DOB|`date`||
||friends|`[ "uuid" ]`||

## Data
The `data` structures are those actual **Records** that contain populated data relating to a `meta` structure.  Conceptually, you can think of this as the *row level data* of a data frame.

Examples:
**JSON**:
```
{
    Dossiers: [
        {
            id: "meow-lekiszka",
            name: "Lekiszka",
            bio: "I just want to *chill*.",
            DOB: "1937-02-02",
            friends: [
                "meow-buddha",
            ],
        },
        {
            id: "meow-buddha",
            name: "Buddha",
            bio: "Das **mine**.",
            DOB: "1987-02-02",
            friends: [
                "meow-lekiszka",
            ],
        },
    ],
}
```

**Tabular**:
|id|name|bio|DOB|friends|
|-|-|-|-|-|
|meow-lekiszka|Lekiszka|I just want to *chill*.|1937-02-02|`[ "meow-buddha" ]`|
|meow-buddha|Buddha|Das **mine**.|1987-02-02|`[ "meow-lekiszka" ]`|

---

# Workers
* Mutators
* Events

## Mutators
The `mutator` structures manipulate and transform data.  The are the proxmiate cause of data mutation, and can invoke secondary consequences as a result of this work (e.g. "update", "change" events)

## Events
The `event` structure handles a collection of events and listeners, to be invoked on-demand.