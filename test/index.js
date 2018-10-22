import path from "path";
import chai from "chai";
import getResources from "../src/";

describe("html-resources", () => {
  const expect = chai.expect;
  const folder = path.resolve(__dirname, "./resources/index.html");

  describe("getResources(file, options)", () => {
    it("should automatically start to parse", done => {
      let assets = getResources(folder);

      assets.on("end", resources => {
        done();
      });
    });

    it("should wait before parsing", done => {
      let okay = false;
      let assets = getResources(folder, {
        autostart: false
      });

      assets.on("end", resources => {
        done();
      });

      assets.parse();
    });
  });
});
