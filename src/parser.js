// @flow

import fs from "fs";
import path from "path";
import mixin from "merge-descriptors";
import cheerio from "cheerio";

export default {
  getContent(file: string): null | string {
    if (!fs.existsSync(file)) {
      this.emit("error", `File ${file} does not exist`);
      return null;
    }

    return fs.readFileSync(file, { encoding: "utf8" });
  },

  getResources(html: string): Array<Object> {
    const $ = cheerio.load(html);
    const elems = [];

    for (const resource of this.opts.resources) {
      $(resource.tag).each((index, element) => {
        const $resource: Object = $(element);
        const fileSource: string = $resource.attr(resource.attr);

        elems.push({
          type: resource.tag,
          path: path.resolve(this.base, fileSource)
        });
      });
    }

    return elems;
  },

  prepareResource(type: string, source: string, raw: string): void {
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
  },

  search(): Object {
    const html: string = this.getContent(this.main);
    const files: Array<Object> = this.getResources(html);
    let count: number = files.length;

    this.on("item", () => {
      if (--count === 0) this.emit("end", files);
    });

    for (let file of files) {
      this.prepareResource(file.type, file.path, file);
    }

    return this;
  }
};
