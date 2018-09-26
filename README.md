<p align="center">
    <img width="100" src="https://github.com/miozzz/Squid.js/blob/master/assets/icons/256x256.png" alt="Squid logo">

</p>

<p align="center">

</p>

<h2 align="center">Squid.js</h2>

*Squid* is a none invasive component framework built by half human, half undersea monkey programmers.
The key features guiding the development of Squid are interoperabilty and simplicity. We built Squid.js to create applications with reusable components and controllers, that are neatly tucked into their own namespaces.


## Why Squid.js

Squid.js was built for creating complex web applications by breaking down applications into independent and interoperable components. As much as possible we try to keep HTML, Javascript and CSS clean. If you don't like seeing HTML inside your Javascript, or CSS inside your HTML, or Javascript inside your HTML, this is the framework for you. If you do like doing that, we wont stop you, this could still be the framework for you. 



## Getting Started

Add a reference to the Squid.js file in the header of your document. 
Please read the [Squid Documentation](https://github.com/miozzz/Squid/blob/master/Squid3.0/engine/README.md) for a complete guide on creating your first application.

```
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="UTF-8" />
        <script id="squid" src="scripts/squid.js?"></script>
    </head>
    <body>
        //html content
    </body>
</html>
```

## Application Structure

<pre class="language-plaintext" data-lang="plaintext">
ProjectName/
├── Namespace/
│   ├── components/
│   |   ├── empty/
│   ├── controllers/
│   |   ├── empty/
│   ├── images/
│   |   ├── empty/
│   └── loader.js
│   └── index.html
│   └── style.css
└── otherNamespace/
</pre>

## Use the Visual Studio Code Extension

We've built an extension for Visual Studio that will help you create your Squid.js applications.

[Visual Studio Code Extension](https://github.com/miozzz/Squid.js/blob/master/tools/VisualStudioCodeEx/)


## Built With
* Vanilla Javascript
* VSCode
* Early Morning Bike Rides

## Abstract
In the previous versions of Squid we encountered some difficulties with namespace cluttering, dirty syntax, and poorly constructed data binding. We looked to different frameworks for solutions but most of what is available did not suit the style with which we coded. We wanted to keep our HTML, Javascript and CSS as clean as possible. We didnt like cross contamination of the three. So we decided to do one last recode of the whole framework. The goal was to solve all our problems with the past versions, make it public, and continuosly update with the latest tech. 

## Other Frameworks
Squid.js is most similar to Vue.js
When we discovered Vue.js we were already done with the second recode of squid and although this may never be as popular as Vue.js, it was still nice to have something we could bend to our will. So we built the third one, inspired partly by Vue.js, and Angular.js. Although Squid is less invasive. It allows you to just use Squid when you want to. Not requiring you to build a whole application on the Squid Framework.

## Acknowledgements
* **Robbie** - for showing us Z, the first version of Squid, and letting us run wild with it. 
* **Jojo** - for pushing us to keep on top of the latest technology.
* **Luigi** - for doing some heavy lifting.
* **Contributors** - for contributing. 

