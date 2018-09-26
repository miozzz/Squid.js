# Bind.js

## Databinding extension for Squid.js. 
* Binds to Context Controls together
* Supports one way to two way databinding
* Requires Squid.js and Orc.js

## Sample Control 

* Sample implementation can be loaded using the samples namespace

```html

```

## sq-bind
* Document Elements with Squid Context Controllers attached to them can be bound to other Context Conntrollers using the sq-bind attribute
* sq-bind attribute accepts a unique id that will be matched with other bound contexts

 ``` html
 <!-- This div binds with other divs with the same sq-context and sq-bind -->
 <div sq-context="details" sq-bind="id1" > 
    <input name="nm" value="${name}"/>
    <input name="lstnm" value="${lastname}"/>
 </div>
 <!-- First div bounds to this. -->
<div sq-context="details" sq-bind="id1" >
    <input name="nm" value="${name}"/>
    <input name="lstnm" value="${lastname}"/>
</div>
<!-- First div does not bind to this-->
<div sq-context="details" sq-bind="id2" >
    <input name="nm" value="${name}"/>
    <input name="lstnm" value="${lastname}"/>
</div>
```

## Sets and Gets
* By default all bound Contexts are two way bound.
* sq-bind-sets and sq-bind-gets controls the flow of data of the bound Context

### sq-bind-gets
* sq-bind-gets context from others is false
* Other contexts **CANNOT** set it.
* It **CAN** set other contexts.

### sq-bind-sets
* sq-bind-sets others context is false
* Other context **CAN** set it.
* It **CANNOT** set other contexts

``` html
<!-- This div flows data outward only. -->
<div sq-context="details" sq-bind="id1" sq-bind-gets="false" >
    <input name="nm" value="${name}"/>
    <input name="lstnm" value="${lastname}"/>
</div>
<!-- This div flows data inward only-->
<div sq-context="details" sq-bind="id1" sq-bind-sets="false" >
    <input name="nm" value="${name}"/>
    <input name="lstnm" value="${lastname}"/>
</div>
```

## Worker
* Bind.js uses Orc.js to create a web worker bind-worker.js
* Contexts mirror each other through communication with the worker
* Setting data to a context that is bound only posts a message to the worker after the sq.setData method finishes

