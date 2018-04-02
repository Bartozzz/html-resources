// @flow
import fs from "fs";
import path from "path";
import mixin from "merge-descriptors";
import cheerio from "cheerio";
import EventEmitter from "events";

export const Resources = {
  Scripts: require("./resources/scripts"),
  Styles: require("./resources/styles"),
  Images: require("./resources/images")
};

export default class Parser extends EventEmitter {
  main: string;
  base: string;
  config: Object;

  promise: Promise<*>;
  resolve: Function = () => true;
  reject: Function = () => false;

  constructor(file: string, options: Object): void {
    super();

    this.config = {
      resources: [Resources.Scripts, Resources.Styles, Resources.Images],
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

  then(callback: Function): this {
    this.promise.then(callback);
    this.search();

    return this;
  }

  catch(callback: Function): this {
    this.promise.catch(callback);
    this.search();

    return this;
  }

  loadFileContent(file: string): string {
    if (!fs.existsSync(file)) {
      this.emit("error", `File ${file} does not exist`);
      return "";
    }

    return fs.readFileSync(file, { encoding: "utf8" });
  }

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

  search(): Object {
    const html: string = this.loadFileContent(this.main);
    const files: Array<Object> = this.parseFileContent(html);
    let count: number = files.length;

    this.on("item", () => {
      if (--count === 0) {
        this.emit("end", files);
        this.resolve(files);
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
}
