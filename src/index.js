// @flow
import { extname } from "path";
import Parser from "./parser";
import Resources from "./resources";

export interface IConfig {
  // Current working directory:
  cwd: string;

  // Array fo resources to parse:
  resources: $Values<typeof Resources>;

  // Whether to automatically start parsing resources or not:
  autostart: boolean;
}

/**
 * Creates a configured parser instance.
 *
 * @param   {string}      file
 * @param   {Object?}     options
 * @param   {string}      options.cwd
 * @param   {Array}       options.resources
 *
 * @throws  {TypeError}   When provided wrong file type
 * @throws  {TypeError}   When provided wrong options
 * @return  {Parser}      Configured Parser instance
 */
function getResources(file: string, options?: $Shape<IConfig> = {}) {
  if (extname(file) !== ".html") {
    throw new TypeError(`You must provide a HTML file (got ${extname(file)})`);
  }

  if (typeof options !== "object") {
    throw new TypeError(`Options must be an object (got ${typeof options})`);
  }

  return new Parser(file, {
    cwd: options.cwd ?? process.cwd(),
    resources: options.resources ?? Object.values(Resources),
    autostart: options.autostart ?? true
  });
}

export default getResources;
export { Resources };
