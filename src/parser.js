// @flow
import fs from "fs";
import path from "path";
import EventEmitter from "events";
import mixin from "merge-descriptors";
import cheerio from "cheerio";
import resources from "./resources";

/**
 * @requires  mixin
 * @requires  cheerio
 */
export default class Parser extends EventEmitter {
  // Absolute pth to the main file
  main: string;
  // Absolute path to the main directory
  base: string;
  // Project configuration
  config: Object;
  // Whether we are already parsing
  started: boolean = false;
  // Provides support for async/await syntax
  promise: Promise<*>;
  resolve: Function = () => true;
  reject: Function = () => false;

  /**
   * @param   {string}  file
   * @param   {Object}  options
   * @param   {Array}   options.resources
   * @param   {string}  options.cwd
   */
  constructor(file: string, options: Object): void {
    super();

    this.config = {
      resources: Object.values(resources),
      cwd: process.cwd(),
      ...options
    };

    this.main = path.resolve(this.config.cwd, file);
    this.base = path.parse(this.main).dir;

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  /**
   * Loads file contents from a given path. Emits an error if the file cannot be
   * found.
   *
   * @param   {string}  file
   * @return  {string}
   * @access  private
   */
  loadFileContent(file: string): string {
    if (!fs.existsSync(file)) {
      this.emit("error", `File ${file} does not exist`);
      return "";
    }

    return fs.readFileSync(file, { encoding: "utf8" });
  }

  /**
   * Parses a HTML file and returns found resources.
   *
   * @param   {string}  html
   * @return  {Array<Object>}
   * @access  private
   */
  parseFileContent(html: string): Array<Object> {
    const $ = cheerio.load(html);
    const e = [];

    for (const resource of this.config.resources) {
      $(resource.tag).each((index, element) => {
        const resElem: Object = $(element);
        const resPath: string = resElem.attr(resource.attr);

        e.push({
          type: resource.tag,
          path: path.resolve(this.base, resPath)
        });
      });
    }

    return e;
  }

  /**
   * @param   {string}  type
   * @param   {string}  source
   * @param   {Object}  raw
   * @return  {void}
   * @access  private
   */
  prepareResource(type: string, source: string, raw: Object): void {
    fs.readFile(source, "utf8", (error, data) => {
      if (error) {
        this.emit("error", error.message);
        return;
      }

      const stream: fs.ReadStream = fs.createReadStream(source, {
        encoding: "utf8"
      });

      mixin(raw, { data, self: raw });
      mixin(raw, path.parse(source));

      this.emit(type, raw, stream);
      this.emit("item", type, raw, stream);
    });
  }

  /**
   * @return  {this}
   * @access  public
   */
  search(): this {
    if (this.started) {
      return this;
    }

    this.started = true;

    const html: string = this.loadFileContent(this.main);
    const files: Array<Object> = this.parseFileContent(html);
    let count: number = files.length;

    this.on("item", () => {
      if (--count === 0) {
        this.emit("end", files);
        this.resolve(files);
        this.started = false;
      }
    });

    this.on("error", error => {
      this.reject(error);
    });

    for (let file of files) {
      this.prepareResource(file.type, file.path, file);
    }

    return this;
  }

  /**
   * @param   {Function}  callback
   * @return  {this}
   * @access  public
   */
  then(callback: Function): this {
    this.promise.then(callback);
    this.search();

    return this;
  }

  /**
   * @param   {Function}  callback
   * @return  {this}
   * @access  public
   */
  catch(callback: Function): this {
    this.promise.catch(callback);
    this.search();

    return this;
  }
}
