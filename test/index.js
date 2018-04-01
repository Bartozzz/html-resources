import chai  from "chai";
import {getResources} from "../src/";

describe("html-resources", function () {
  const expect = chai.expect;

  describe("getResources(file)", function () {
    it("should find resources", function (done) {
      let assets = getResources("./resources/index.html", { cwd: __dirname });
      let count = 0;

      assets.on("img", (resource) => {
        count++;
      });

      assets.on("link", (resource) => {
        count++;
      });

      assets.on("script", (resource) => {
        count++;
      });

      assets.on("end", (resources) => {
        expect(count).to.equal(5);
        done();
      });

      assets.search();
    });
  });
});
