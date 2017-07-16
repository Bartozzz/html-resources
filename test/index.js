const { getResources } = require( "../dist" );

const assets = getResources( "./resources/index.html", {
    cwd : __dirname
} );

assets.on( "img", resource => {
    console.log( "Image:", resource.name );
} );

assets.on( "link", resource => {
    console.log( "Style:", resource.name );
} );

assets.on( "script", resource => {
    console.log( "Script:", resource.base );
} );

assets.on( "error", message => {
    console.log( "Error", message );
} );

assets.on( "end", resources => {
    console.log( "------------------" );
    console.log( `${resources.length} resources found!` );
} );
