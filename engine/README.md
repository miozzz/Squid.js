<p align="center">
    <img width="100" src="https://github.com/miozzz/Squid.js/blob/master/assets/icons/256x256.png" alt="Squid logo">
</p>

<h2 align="center">SQUID.JS</h2>

* This is a living document. 

## Squid Functions

* When Squid.js is loaded developers will have access to its functions via the Squid Object attached to the Window. We kept all our functions and variables inside Window.sq to avoid cluttering the global scope. 
* View full documentation of functions [Squid Functions](https://github.com/miozzz/Squid.js/blob/master/engine/functions.md)

## Namespaces

* Each component is conveniently placed inside it's own namespace.
* A namespace is also a class. Every instance of a namespace can have it's own prototype functions.
* Every namespace has its own extension of the Squid.js base Component which is the ancestor of all components in Squid.js.
* Modifications can be made to the prototype of the base component of each namespace which will affect all the components inside it. 
* A namespace is defined in the loader.js file.
```javascript
    //namespace name is "samples"
    const samples = new sq.Namespace("samples"); 
    samples.loadComponents({ 
        "components": { 
            "repeater": [],
            "treegrid": [],
            "bind":[],
            "codearea":[]
        }
    });

```

## Components

* A Component Trifile is a folder containing the Structure (XML), Script (Javascript),and Style (CSS) of a component.
* Components are meant to be standalone and interoperable. 
* Breaking down an application into individual reusable components makes it easier to maintain.
* Having components that can be easily reused by referencing their namespaces, allows for less coding.
* Components can inherit other components
```html
    <body>
        <!-- using the repeater component from the samples namespace -->
        <samples:repeater></samples:repeater>
    </body>
```
## Controllers

* A Controller is a Class that can be added to any DOM using the "sq-" prefix.
* There are a few controllers built into the Squid framework. 

```html
<div sq-selectable="true"></div>
<!-- The Controller bound to the DIV is the Selectable controller. -->
```

