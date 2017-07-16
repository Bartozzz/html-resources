# html-resources

Parse `.html` files for custom resources. `html-resources` finds any resources loaded by a website for you and emits an event with all the data needed.

## Installation

```bash
$ npm install html-resources
```

## Usage

`getResources( file, options);`

```javascript
// Import stuff:
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

const assets = getResources( "./path/to/file.html", {
    cwd : __dirname
} );

assets.on( "item", ( type, resource, stream ) => {
    console.log( `${type} found`, resource );
} );

assets.on( "link", ( resource, stream ) => {
    console.log( "Stylesheet found", resource );
} );

assets.on( "script", ( resource, stream ) => {
    console.log( "Script found", resource );
} );

assets.on( "img", ( resource, stream ) => {
    console.log( "Image found", resource );
} );

assets.on( "error", message => console.log( "Error", message ) );
assets.on( "end", resources => console.log( `Found ${resources.length} resources` ) );
```

### Adding new resources definitions

You can specify which resources you want to parse in the `resources` parameter by passing an object with two properties: `tag` and `attr`. By default, it will look for `Resources.Scripts` (<script src="…"></script>), `Resources.Styles` (<link href="…" />), `Resources.Images` (<img src="…" />).

```javascript
import { getResources, Resources } from "html-resources";

const assets = getResources( "./path/to/file.html", {
    // Search <scripts> and <custom-tag>
    resources : [
        // <img />, <link />, <script />
        ...Resources,

        // <custom-tag path="path/to/file" />
        { tag : "custom-tag", attr : "path" },

        // <shadow-item custom="path/to/file" />
        { tag : "shadow-item", attr : "custom" }
    ]
} );

assets.on( "custom-tag", ( resource, stream ) => {
    console.log( resource )
} );

assets.on( "shadow-item", ( resource, stream ) => {
    console.log( resource )
} );
```

### Saving resources

You can use `html-resources` to find, modify and re-save resources in a simple way.

```javascript
import { getResources } from "html-resources";

const assets = getResources( "./path/to/file.html", {
    cwd : __dirname
} );

assets.on( "script", ( resource, stream ) => {
    console.log( "Saving script", resource.name );

    const dist  = path.resolve( "path/to/output/", resource.base );
    const write = fs.createWriteStream( dist, { flags : "w" } );

    // You can use browserify, babelify and use other transformations here…

    stream.pipe( write );
} );
```

## Resources definitions

You can add your own resources definitions. It's a simple object containing right now two properties. The example below will emit an event named `script` for each `<script src="..."></script>` matched.

```json
{
    "tag"  : "script",
    "attr" : "src"
}
```

## Options

```javascript
const assets = getResources( file [, options] );
```

#### file

File to parse.

#### options.cwd

Current working directory. All the paths will be resolved to `cwd`. By default, it's set to `process.cwd()` but in most cases you want to set it manually to `__dirname`.

#### options.resources

An array containing all the resources definitions `html-resources` should look for. By default, it's set to `Resources.Scripts`, `Resources.Styles`, `Resources.Images`.

## Tests

```bash
$ node test/index.js
```
