"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Resources", {
  enumerable: true,
  get: function () {
    return _resources.default;
  }
});
exports.default = void 0;

var _path = require("path");

var _parser = _interopRequireDefault(require("./parser"));

var _resources = _interopRequireDefault(require("./resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function getResources(file, options = {}) {
  var _options$cwd, _options$resources, _options$autostart;

  if ((0, _path.extname)(file) !== ".html") {
    throw new TypeError(`You must provide a HTML file (got ${(0, _path.extname)(file)})`);
  }

  if (typeof options !== "object") {
    throw new TypeError(`Options must be an object (got ${typeof options})`);
  }

  return new _parser.default(file, {
    cwd: (_options$cwd = options.cwd) !== null && _options$cwd !== void 0 ? _options$cwd : process.cwd(),
    resources: (_options$resources = options.resources) !== null && _options$resources !== void 0 ? _options$resources : Object.values(_resources.default),
    autostart: (_options$autostart = options.autostart) !== null && _options$autostart !== void 0 ? _options$autostart : true
  });
}

var _default = getResources;
exports.default = _default;