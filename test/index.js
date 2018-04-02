import path  from "path";
import chai  from "chai";
import getResources from "../src/";

describe("html-resources", function () {
  const expect = chai.expect;
  const folder = path.resolve(__dirname, "./resources/index.html");

  describe("getResources(file, options)", function () {
    it("should support Event syntax", function (done) {
      let okay = false;
      let assets = getResources(folder);

      assets.on("item", (resource) => {
        if (!okay) {
          okay = true;
          done();
        }
      });

      assets.search();
    });

    it("should support Promise syntax", function (done) {
      let assets = getResources(folder).then((resources) => {
        expect(resources.length).to.equal(5);
        done();
      });
    });

    it("should support await/async syntax", async function () {
      let resources = await getResources(folder);

      expect(resources.length).to.equal(5);
    });
  });
});
