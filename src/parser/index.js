// @flow
import fs from "fs";
import util from "util";
import path from "path";
import EventEmitter from "events";
import cheerio from "cheerio";
import { IConfig } from "../index";

// Utils:
const asyncReadFile = util.promisify(fs.readFile);

/**
 * Parses an `.html` file and emits events for each individual resource that is
 * included in inside (such as scripts, images, stylesheets, user-defined
 * elements).
 *
 * @class
 */
class Parser extends EventEmitter {
  fname: string;
  fpath: string;
  config: Object;

  /**
   * @param   {string}  file
   * @param   {Object}  config
   * @param   {string}  config.cwd
   * @param   {Array}   config.resources
   * @param   {boolean} config.autostart
   */
  constructor(file: string, config: IConfig) {
    super();

    this.config = config;
    this.fname = path.resolve(this.config.cwd, file);
    this.fpath = path.parse(this.fname).dir;

    if (config.autostart) {
      this.parse();
    }
  }

  /**
   * Loads and parses the given HTML file. Emits an event on each resource
   * found.
   *
   * @return  {void}
   * @access  public
   * @async
   */
  async parse() {
    try {
      const fileContent = await asyncReadFile(this.fname, "utf8");
      const fileResources = this.findResources(fileContent);
      let resourcesCount = fileResources.length;

      // Emits an "end" event when all resources have been handled.
      const handleEndEvent = () => {
        if (--resourcesCount === 0) {
          this.emit("end", fileResources);
        }
      };

      this.on("item", handleEndEvent);
      this.on("error", handleEndEvent);

      for (let resource of fileResources) {
        this.prepareResource(resource.type, resource.path, resource);
      }
    } catch (err) {
      this.emit("error", err.message);
    }
  }

  /**
   * Parses a HTML file and returns found resources.
   *
   * @param   {string}  html
   * @return  {Array<Object>}
   * @access  private
   */
  findResources(html: string): Array<Object> {
    const $ = cheerio.load(html);
    const resources = [];

    for (const resource of this.config.resources) {
      $(resource.tag).each((index, element) => {
        const resourceElem: Object = $(element);
        const resourcePath: string = resourceElem.attr(resource.attr);

        resources.push({
          type: resource.tag,
          path: path.resolve(this.fpath, resourcePath)
        });
      });
    }

    return resources;
  }

  /**
   * @param   {string}  type
   * @param   {string}  source
   * @param   {Object}  resource
   * @return  {void}
   * @access  private
   * @async
   */
  async prepareResource(type: string, source: string, resource: Object) {
    try {
      const fileContent = await asyncReadFile(source, "utf8");
      const readStream = fs.createReadStream(source, { encoding: "utf8" });

      const raw = {
        data: fileContent,
        ...path.parse(source),
        ...resource
      };

      this.emit(type, raw, readStream);
      this.emit("item", type, raw, readStream);
    } catch (err) {
      this.emit("error", err.message);
    }
  }
}

export default Parser;
