"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mergeDescriptors = require("merge-descriptors");

var _mergeDescriptors2 = _interopRequireDefault(_mergeDescriptors);

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    getContent: function getContent(file) {
        if (!_fs2.default.existsSync(file)) {
            this.emit("error", "File " + file + " does not exist");
            return null;
        }

        return _fs2.default.readFileSync(file, { encoding: "utf8" });
    },
    getResources: function getResources(html) {
        var _this = this;

        var $ = _cheerio2.default.load(html);
        var elems = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            var _loop = function _loop() {
                var resource = _step.value;

                $(resource.tag).each(function (index, element) {
                    var $resource = $(element);
                    var fileSource = $resource.attr(resource.attr);

                    elems.push({
                        type: resource.tag,
                        path: _path2.default.resolve(_this.base, fileSource)
                    });
                });
            };

            for (var _iterator = this.opts.resources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                _loop();
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

        return elems;
    },
    prepareResource: function prepareResource(type, source, raw) {
        var _this2 = this;

        _fs2.default.readFile(source, "utf8", function (error, data) {
            if (error) {
                _this2.emit("error", error.message);
                return;
            }

            var stream = _fs2.default.createReadStream(source, {
                encoding: "utf8"
            });

            (0, _mergeDescriptors2.default)(raw, { data: data, self: raw });
            (0, _mergeDescriptors2.default)(raw, _path2.default.parse(source));

            _this2.emit(type, raw, stream);
            _this2.emit("item", type, raw, stream);
        });
    },
    search: function search() {
        var _this3 = this;

        var html = this.getContent(this.main);
        var files = this.getResources(html);
        var count = files.length;

        this.on("item", function () {
            if (--count === 0) _this3.emit("end", files);
        });

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
};
module.exports = exports["default"];