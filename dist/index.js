"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resources = undefined;

var _resources = require("./resources");

Object.defineProperty(exports, "Resources", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_resources).default;
  }
});

var _path = require("path");

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function getResources(file) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if ((0, _path.extname)(file) !== ".html") {
    throw new Error("You must provide a .html file, not " + (0, _path.extname)(file));
  }

  return new _parser2.default(file, options);
}

exports.default = getResources;