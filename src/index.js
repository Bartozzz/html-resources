// @flow
import { extname } from "path";
import Parser from "./parser";

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
function getResources(file: string, options: Object = {}): Object {
  if (extname(file) !== ".html") {
    throw new Error(`You must provide a .html file, not ${extname(file)}`);
  }

  return new Parser(file, options);
}

export default getResources;
export { default as Resources } from "./resources";
