var { getResources } = require( "../dist" );
const assets         = getResources( "./test/resources/index.html" );

assets.on( "img", resource => {
    console.log( "Image", resource.name );
} );

assets.on( "link", resource => {
    console.log( "Style", resource.name );
} );

assets.on( "script", resource => {
    console.log( "Script", resource.base );
} );

assets.on( "error", message => {
    console.log( "Error", message );
} );

assets.on( "end", resources => {
    console.log( `The End. ${resources.length} resources found!` );
} );
