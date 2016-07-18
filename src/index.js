import path             from "path";
import mixin            from "merge-descriptors";
import { EventEmitter } from "events";

import HtmlParser       from "./parser";
import Scripts          from "./resources/scripts.js";
import Styles           from "./resources/styles.js";
import Images           from "./resources/images.js";

const Resources = {
    Scripts : Scripts,
    Styles  : Styles,
    Images  : Images
};

/**
 *
 *
 * @param   {string}    file                HTML to get resources from
 * @param   {object}    options             Custom options
 * @param   {string}    options.cwd         Current working directory
 * @param   {array}     options.resources   Resources to parse the HTML file for
 * @return  {object}
 */
const getResources = ( file, options = {} ) => {
    if ( path.extname( file ) !== ".html" )
        throw new Error( `You must provide an .html file, not ${path.extname( file )}` );

    if ( ! options.resources )
        options.resources = [ Resources.Scripts, Resources.Styles, Resources.Images ];

    if ( ! options.cwd )
        options.cwd = process.cwd();

    const main = path.resolve( options.cwd, file );
    const base = path.parse( main ).dir;

    const parser = {
        file : file,
        base : base,
        main : main,
        opts : options
    };

    mixin( parser, HtmlParser, false );
    mixin( parser, EventEmitter.prototype, false );

    return parser.search();
};

export { getResources, Resources };
