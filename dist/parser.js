"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _values = require("babel-runtime/core-js/object/values");

var _values2 = _interopRequireDefault(_values);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _mergeDescriptors = require("merge-descriptors");

var _mergeDescriptors2 = _interopRequireDefault(_mergeDescriptors);

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

var _resources = require("./resources");

var _resources2 = _interopRequireDefault(_resources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parses HTML files and extracts custom resources such as scripts, stylesheets,
 * images and user-defined elements. Supports both Event-based and Promise-based
 * syntax.
 *
 * @requires  merge-descriptors
 * @requires  cheerio
 * @class
 */
var Parser = function (_EventEmitter) {
  (0, _inherits3.default)(Parser, _EventEmitter);

  /**
   * @param   {string}  file
   * @param   {Object}  options
   * @param   {Array}   options.resources
   * @param   {string}  options.cwd
   */

  // Whether we are already parsing

  // Absolute path to the main directory
  function Parser(file, options) {
    (0, _classCallCheck3.default)(this, Parser);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Parser.__proto__ || (0, _getPrototypeOf2.default)(Parser)).call(this));

    _this.started = false;

    _this.resolve = function () {
      return true;
    };

    _this.reject = function () {
      return false;
    };

    _this.config = (0, _extends3.default)({
      resources: (0, _values2.default)(_resources2.default),
      cwd: process.cwd()
    }, options);

    _this.main = _path2.default.resolve(_this.config.cwd, file);
    _this.base = _path2.default.parse(_this.main).dir;

    _this.promise = new _promise2.default(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
    return _this;
  }

  /**
   * Loads file contents from a given path. Emits an error if the file cannot be
   * found.
   *
   * @param   {string}  file
   * @return  {string}
   * @access  private
   */

  // Provides support for async/await syntax

  // Project configuration

  // Absolute path to the main file


  (0, _createClass3.default)(Parser, [{
    key: "loadFileContent",
    value: function loadFileContent(file) {
      if (!_fs2.default.existsSync(file)) {
        this.emit("error", "File " + file + " does not exist");
        return "";
      }

      return _fs2.default.readFileSync(file, { encoding: "utf8" });
    }

    /**
     * Parses a HTML file and returns found resources.
     *
     * @param   {string}  html
     * @return  {Array<Object>}
     * @access  private
     */

  }, {
    key: "parseFileContent",
    value: function parseFileContent(html) {
      var _this2 = this;

      var $ = _cheerio2.default.load(html);
      var e = [];

      var _loop = function _loop(resource) {
        $(resource.tag).each(function (index, element) {
          var resElem = $(element);
          var resPath = resElem.attr(resource.attr);

          e.push({
            type: resource.tag,
            path: _path2.default.resolve(_this2.base, resPath)
          });
        });
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.config.resources), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var resource = _step.value;

          _loop(resource);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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

  }, {
    key: "prepareResource",
    value: function prepareResource(type, source, raw) {
      var _this3 = this;

      _fs2.default.readFile(source, "utf8", function (error, data) {
        if (error) {
          _this3.emit("error", error.message);
          return;
        }

        var stream = _fs2.default.createReadStream(source, {
          encoding: "utf8"
        });

        (0, _mergeDescriptors2.default)(raw, { data: data, self: raw });
        (0, _mergeDescriptors2.default)(raw, _path2.default.parse(source));

        _this3.emit(type, raw, stream);
        _this3.emit("item", type, raw, stream);
      });
    }

    /**
     * Loads and parses the given HTML file. Emits an event on each resource
     * found.
     *
     * @return  {this}
     * @access  public
     */

  }, {
    key: "search",
    value: function search() {
      var _this4 = this;

      if (this.started) {
        return this;
      }

      this.started = true;

      var html = this.loadFileContent(this.main);
      var files = this.parseFileContent(html);
      var count = files.length;

      this.on("item", function () {
        if (--count === 0) {
          _this4.emit("end", files);
          _this4.resolve(files);
          _this4.started = false;
        }
      });

      this.on("error", function (error) {
        _this4.reject(error);
      });

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(files), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var file = _step2.value;

          this.prepareResource(file.type, file.path, file);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return this;
    }

    /**
     * @param   {Function}  callback
     * @return  {this}
     * @access  public
     */

  }, {
    key: "then",
    value: function then(callback) {
      this.promise.then(callback);
      this.search();

      return this;
    }

    /**
     * @param   {Function}  callback
     * @return  {this}
     * @access  public
     */

  }, {
    key: "catch",
    value: function _catch(callback) {
      this.promise.catch(callback);
      this.search();

      return this;
    }
  }]);
  return Parser;
}(_events2.default);

exports.default = Parser;
module.exports = exports.default;