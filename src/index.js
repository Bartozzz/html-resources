// @flow

import path from "path";
import mixin from "merge-descriptors";
import EventEmitter from "events";
import HtmlParser from "./parser";

/**
 * Default resources.
 *
 * @type    {object}
 */
export const Resources = {
  Scripts: require("./resources/scripts"),
  Styles: require("./resources/styles"),
  Images: require("./resources/images")
};

/**
 * Glues all components together.
 *
 * @param   {string}    file            HTML to get resources from
 * @param   {object}    opts            Custom options
 * @param   {string}    opts.cwd        Current working directory
 * @param   {array}     opts.resources  Resources to parse the HTML file for
 *
 * @return  {object}
 */
export function getResources(file: string, opts: Object = {}): Object {
  if (path.extname(file) !== ".html") {
    throw new Error(`You must provide a .html file, not ${path.extname(file)}`);
  }

  if (!opts.resources) {
    opts.resources = [Resources.Scripts, Resources.Styles, Resources.Images];
  }

  if (!opts.cwd) {
    opts.cwd = process.cwd();
  }

  const main = path.resolve(opts.cwd, file);
  const base = path.parse(main).dir;
  const parser = { file, base, main, opts };

  mixin(parser, EventEmitter.prototype, false);
  mixin(parser, HtmlParser, false);

  // $FlowFixMe
  return parser;
}
