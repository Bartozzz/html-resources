import fs       from "fs";
import path     from "path";
import mixin    from "merge-descriptors";
import cheerio  from "cheerio";

export default {
    getContent( file ) {
        if ( ! fs.existsSync( file ) ) {
            this.emit( "error", `File ${file} does not exist` );
            return;
        }

        return fs.readFileSync( file, { encoding : "utf8" } );
    },

    getResources( html ) {
        const $     = cheerio.load( html );
        const elems = [];

        for ( let resource of this.opts.resources ) {
            $( resource.tag ).each( ( index, element ) => {
                let $resource  = $( element );
                let fileSource = $resource.attr( resource.attr );

                elems.push( {
                    type : resource.tag,
                    path : path.resolve( this.base, fileSource )
                } );
            } );
        }

        return elems;
    },

    prepareResource( type, source, raw ) {
        fs.readFile( source, "utf8", ( error, data ) => {
            if ( error ) {
                return this.emit( "error", error.message );
            }

            let stream = fs.createReadStream( source, { encoding : "utf8" } );

            mixin( raw, { data : data, self : raw } );
            mixin( raw, path.parse( source ) );

            this.emit( type, raw, stream );
            this.emit( "item", type, raw, stream );
        } );
    },

    search() {
        let html  = this.getContent( this.main );
        let links = this.getResources( html );
        let count = links.length;

        this.on( "item", () => {
            if ( --count === 0 ) this.emit( "end", links )
        } );

        for ( let link of links ) {
            this.prepareResource( link.type, link.path, link );
        }

        return this;
    }
};
