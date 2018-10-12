<div align="center">
  <h1>html-resources</h1>

[![Greenkeeper badge](https://badges.greenkeeper.io/Bartozzz/html-resources.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/Bartozzz/html-resources.svg)](https://travis-ci.org/Bartozzz/html-resources/)
[![npm version](https://img.shields.io/npm/v/html-resources.svg)](https://www.npmjs.com/package/html-resources)
[![npm downloads](https://img.shields.io/npm/dt/html-resources.svg)](https://www.npmjs.com/package/html-resources)
<br>

`html-resources` is a Node.js module which parses `.html` files and returns resources which are included inside (such as _scripts_, _images_, _stylesheets_, _user-defined_ elements). Supports both _Event-based_ and _Promise-based_ syntax.

</div>

## Installation

```bash
$ npm install html-resources
```

## Usage

`getResources(file, options);`

```javascript
import getResources, { Resources } from "html-resources";

const parser = getResources("./path/to/file.html", {
  cwd: process.cwd(),
  resources: [Resources.Scripts, Resources.Styles, Resources.Images]
});
```

### Promise-based syntax example

```javascript
getResources("./path/to/file.html")
  .then(resources => …)
  .catch(exception => …);
```

You can also use `await`/`async` syntax:

```javascript
const resources = await getResources("./path/to/file.html")
```

### Event-based syntax example

```javascript
const parser = getResources("./path/to/file.html");

parser.on("item", (type, resource, stream) => …);
parser.on("img", (resource, stream) => …);
parser.on("link", (resource, stream) =>  …);
parser.on("script", (resource, stream) => …);
// …

parser.on("error", message => …);
parser.on("end", resources => …);
parser.start();
```

### Adding new resource definitions

You can specify which resources you want to parse in the `resources` parameter by passing an object with two properties: `tag` and `attr`. By default, it will look for:

* `Resources.Scripts` (`<script src="…"></script>`);
* `Resources.Styles` (`<link href="…" />`);
* `Resources.Images` (`<img src="…" />`);

```javascript
import getResources, {Resources} from "html-resources";

const parser = getResources("./path/to/file.html", {
  resources: [
    // <custom-tag path="path/to/file" />
    { tag: "custom-tag", attr: "path" },
    // <shadow-item custom="path/to/file" />
    { tag: "shadow-item", attr: "custom" }
  ]
});

parser.on("custom-tag", (resource, stream) => …);
parser.on("shadow-item", (resource, stream) => …);
```

### Saving resources

You can use `html-resources` to find, modify and re-save resources in a simple way.

```javascript
parser.on("script", (resource, stream) => {
  console.log("Transforming script", resource.name);

  const dist = path.resolve("path/to/output/", resource.base);
  const write = fs.createWriteStream(dist, { flags: "w" });

  // You can use browserify, babelify and use other transformations here…

  stream.pipe(write);
});
```

## Options

```javascript
const parser = getResources(file [, options]);
```

#### file

HTML file to parse.

#### options.cwd

Current working directory. All the paths will be resolved to `cwd`. By default, it's set to `process.cwd()` but in most cases you want to set it manually to `__dirname` or pass an absolute path to `file` instead.

#### options.resources

An array containing all the resources definitions `html-resources` should look for. By default, it is set to `Resources.Scripts`, `Resources.Styles`, `Resources.Images`.

## Tests

```bash
$ npm test
```
