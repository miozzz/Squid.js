# Selectable.js

## Extension for Squid.js making elements selectable.
* Add to a parent DOM to make direct children selectable
* 'selectable' class is added to an element when clicked

``` html
<script id="sq-selectable" src="/Squid.js/modules/selectable/selectable.js?"></script>
```

## Usage

* sq-selectable attribute accepts true, false, or multiple.

``` html
<!-- Makes children selectable -->
<div name="selection" sq-selectable="true">
    <label>A</label>
    <label>B</label>
    <label>C</label>
</div>
<!-- Turns off selectable functionality but DOM still has selectable controller -->
<div name="selection" sq-selectable="false">
    <label>A</label>
    <label>B</label>
    <label>C</label>
</div>
<!-- Allows for multiple selection similar to radiobutton. -->
<div name="selection" sq-selectable="multiple">
    <label>A</label>
    <label>B</label>
    <label>C</label>
</div>
```


## Methods

### select(child)
* deselects all selected DOM
* selects the child DOM 
* return the child DOM

### selectPrevious()
* selects previous DOM sibling of currently selected child
* deselects current selected child
* returns newly selected child or null

### selectNext()
* selects next DOM sibling of currently selected child
* deselects current selected child
* returns newly selected child or null

### value(value)
* enumeration: true, false, multiple
* sets sq-selectable attribute or returns current value

### selected(child)
* returns selected children
* selects child 

## 'change' Event
* every time a child is selected the event change is triggered
* the event object contains the child element selected and array of previousSelection
* callback functions can be added using the 'on' method

``` javascript
on('change',callback)
```
