import path  from "path";
import chai  from "chai";
import getResources from "../src/";

describe("html-resources", function () {
  const expect = chai.expect;
  const folder = path.resolve(__dirname, "./resources/index.html");

  describe("getResources(file)", function () {
    it("should emit events", function (done) {
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

    it("should be thenable", function (done) {
      let assets = getResources(folder).then((resources) => {
        expect(resources.length).to.equal(5);
        done();
      }).search();
    });

    it("should find resources", function (done) {
      let assets = getResources(folder);

      assets.on("end", (resources) => {
        expect(resources.length).to.equal(5);
        done();
      });

      assets.search();
    });
  });
});
