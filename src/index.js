// @flow
import path, { extname } from "path";
import mixin from "merge-descriptors";
import EventEmitter from "events";
import HtmlParser from "./parser";

export const Resources = {
  Scripts: require("./resources/scripts"),
  Styles: require("./resources/styles"),
  Images: require("./resources/images")
};

/**
 * Glues all components together.
 *
 * @param   {string}    file              HTML to get resources from
 * @param   {object}    options           Custom options
 * @param   {string}    options.cwd       Current working directory
 * @param   {array}     options.resources Resources to parse the HTML file for
 *
 * @return  {object}
 */
export function getResources(file: string, options: Object = {}): Object {
  if (extname(file) !== ".html") {
    throw new Error(`You must provide a .html file, not ${extname(file)}`);
  }

  const opts = {
    resources: [Resources.Scripts, Resources.Styles, Resources.Images],
    cwd: process.cwd(),
    ...options
  };

  const main = path.resolve(opts.cwd, file);
  const base = path.parse(main).dir;
  const parser = { file, base, main, opts };

  // Glues all the components together:
  mixin(parser, HtmlParser, false);
  mixin(parser, EventEmitter.prototype, false);

  // $FlowFixMe
  return parser;
}
