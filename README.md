# html-resources

Parse `.html` files for custom resources. `html-resources` finds any resources loaded by a website for you and emits an event with all the data needed.

## Installation

```bash
$ npm install html-resources
```

## Usage

You can load `html-resources` like a typical node module:

```javascript
// Import stuff:
var getResources = require( "html-resources" ).getResources;
var Resources    = require( "html-resources" ).Resources;
// or...
import { getResources, Resources } from "html-resources";

// ... and let the magic happen:
const assets = getResources( "./path/to/file.html", {
    cwd       : "current/working/directory",
    resources : [
        Resources.Scripts,
        Resources.Styles,
        Resources.Images
    ]
} );
```

### Basic example

```javascript
import { getResources } from "html-resources";

const assets = getResources( "./path/to/file.html" );

assets.on( "item", ( type, resource ) => {
    console.log( `${type} found`, resource );
} );

assets.on( "link", resource => {
    console.log( "Stylesheet found", resource );
} );

assets.on( "script", resource => {
    console.log( "Script found", resource );
} );

assets.on( "img", resource => {
    console.log( "Image found", resource );
} );

assets.on( "error", message => console.log( "Error", message ) );
assets.on( "end", resources => console.log( "End" ) );
```

### Adding new resources

You can specify which resources you want to parse in the `resources` parameter by passing an object with two properties: `tag` and `attr`. By default, it will look for `Resources.Scripts`, `Resources.Styles`, `Resources.Images`.

```javascript
import { getResources, Resources } from "html-resources";

const assets = getResources( "./path/to/file.html", {
    // Search <scripts> and <custom-tag>
    resources : [
        // <script src="path/to/file"></script>
        Resources.Scripts,
        // <custom-tag path="path/to/file" />
        { tag  : "custom-tag", attr : "path" }
    ]
} );

assets.on( "custom-tag", resource => {
    console.log( resource )
} );
```

### Saving resources

You can use `html-resources` to find, modify and re-save resources in a simple way.

```javascript
import { getResources } from "html-resources";

const assets = getResources( "./path/to/file.html" );

assets.on( "script", ( resource, stream ) => {
    console.log( "Saving script", resource.name );

    const dist  = path.resolve( "path/to/output/", resource.base );
    const write = fs.createWriteStream( dist, { flags : "w" } );

    // You can use browserify, babel and other stuff here...

    stream.pipe( write );
} );
```

## Options

```javascript
const assets = getResources( "./file.html", {
    cwd       : "current/working/directory"
    resources : [ /* ... */ ]
} );
```

#### cwd

Current working directory. All the paths will be resolved to `cwd`. By default, it's set to `process.cwd()`.

#### resources

An array containing all the resources definitions `html-resources` should look for. By default, it's set to `Resources.Scripts`, `Resources.Styles`, `Resources.Images`.

## Resources definitions

You can add your own resources definitions. It's a simple object containing right now two properties. The example below will emit an event named `script` for each `<script src="..."></script>` matched.

```json
{
    "tag"  : "script",
    "attr" : "src"
}
```

Resources definitions might be more complex in next updates.

## Tests

```bash
$ node test/index.js
```
