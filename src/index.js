// @flow
import { extname } from "path";
import Parser from "./parser";

/**
 * Parses `.html` files for custom resources. Finds any resources loaded by an
 * HTML file for you and emits an event with all the data needed. Supports
 * Promises.
 *
 * @param   {string}    file
 * @param   {Object}    options
 * @param   {string}    options.cwd
 * @param   {Array}     options.resources
 *
 * @throws  {Error}
 * @return  {Object}
 */
function getResources(file: string, options: Object = {}): Object {
  if (extname(file) !== ".html") {
    throw new Error(`You must provide a .html file, not ${extname(file)}`);
  }

  return new Parser(file, options);
}

export default getResources;
export { default as Resources } from "./resources";
