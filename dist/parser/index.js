"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _path = _interopRequireDefault(require("path"));

var _events = _interopRequireDefault(require("events"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _index = require("../index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Utils:
const asyncReadFile = _util.default.promisify(_fs.default.readFile);
/**
 * Parses an `.html` file and emits events for each individual resource that is
 * included in inside (such as scripts, images, stylesheets, user-defined
 * elements).
 *
 * @class
 */


class Parser extends _events.default {
  /**
   * @param   {string}  file
   * @param   {Object}  config
   * @param   {string}  config.cwd
   * @param   {Array}   config.resources
   * @param   {boolean} config.autostart
   */
  constructor(file, config) {
    super();

    _defineProperty(this, "fname", void 0);

    _defineProperty(this, "fpath", void 0);

    _defineProperty(this, "config", void 0);

    this.config = config;
    this.fname = _path.default.resolve(this.config.cwd, file);
    this.fpath = _path.default.parse(this.fname).dir;

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
      let resourcesCount = fileResources.length; // Emits an "end" event when all resources have been handled.

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


  findResources(html) {
    const $ = _cheerio.default.load(html);

    const resources = [];

    for (const resource of this.config.resources) {
      $(resource.tag).each((index, element) => {
        const resourceElem = $(element);
        const resourcePath = resourceElem.attr(resource.attr);
        resources.push({
          type: resource.tag,
          path: _path.default.resolve(this.fpath, resourcePath)
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


  async prepareResource(type, source, resource) {
    try {
      const fileContent = await asyncReadFile(source, "utf8");

      const readStream = _fs.default.createReadStream(source, {
        encoding: "utf8"
      });

      const raw = _objectSpread({
        data: fileContent
      }, _path.default.parse(source), resource);

      this.emit(type, raw, readStream);
      this.emit("item", type, raw, readStream);
    } catch (err) {
      this.emit("error", err.message);
    }
  }

}

var _default = Parser;
exports.default = _default;
module.exports = exports.default;