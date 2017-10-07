"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Resources = undefined;
exports.getResources = getResources;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mergeDescriptors = require("merge-descriptors");

var _mergeDescriptors2 = _interopRequireDefault(_mergeDescriptors);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default resources.
 *
 * @type    {object}
 */
var Resources = exports.Resources = {
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
function getResources(file) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (_path2.default.extname(file) !== ".html") {
        throw new Error("You must provide an .html file, not " + _path2.default.extname(file));
    }

    if (!opts.resources) {
        opts.resources = [Resources.Scripts, Resources.Styles, Resources.Images];
    }

    if (!opts.cwd) {
        opts.cwd = process.cwd();
    }

    var main = _path2.default.resolve(opts.cwd, file);
    var base = _path2.default.parse(main).dir;
    var parser = { file: file, base: base, main: main, opts: opts };

    (0, _mergeDescriptors2.default)(parser, _events2.default.prototype, false);
    (0, _mergeDescriptors2.default)(parser, _parser2.default, false);

    // $FlowFixMe
    return parser.search();
}