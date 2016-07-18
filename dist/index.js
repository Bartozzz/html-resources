"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Resources = exports.getResources = undefined;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mergeDescriptors = require("merge-descriptors");

var _mergeDescriptors2 = _interopRequireDefault(_mergeDescriptors);

var _events = require("events");

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

var _scripts = require("./resources/scripts.js");

var _scripts2 = _interopRequireDefault(_scripts);

var _styles = require("./resources/styles.js");

var _styles2 = _interopRequireDefault(_styles);

var _images = require("./resources/images.js");

var _images2 = _interopRequireDefault(_images);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Resources = {
    Scripts: _scripts2.default,
    Styles: _styles2.default,
    Images: _images2.default
};

/**
 *
 *
 * @param   {string}    file                HTML to get resources from
 * @param   {object}    options             Custom options
 * @param   {string}    options.cwd         Current working directory
 * @param   {array}     options.resources   Resources to parse the HTML file for
 * @return  {object}
 */
var getResources = function getResources(file) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (_path2.default.extname(file) !== ".html") throw new Error("You must provide an .html file, not " + _path2.default.extname(file));

    if (!options.resources) options.resources = [Resources.Scripts, Resources.Styles, Resources.Images];

    if (!options.cwd) options.cwd = process.cwd();

    var main = _path2.default.resolve(options.cwd, file);
    var base = _path2.default.parse(main).dir;

    var parser = {
        file: file,
        base: base,
        main: main,
        opts: options
    };

    (0, _mergeDescriptors2.default)(parser, _parser2.default, false);
    (0, _mergeDescriptors2.default)(parser, _events.EventEmitter.prototype, false);

    return parser.search();
};

exports.getResources = getResources;
exports.Resources = Resources;