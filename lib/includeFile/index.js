const fs = require("fs");
const path = require("path");

module.exports = (eleventyConfig, { shortcode = "includeFile" } = {}) => {
  eleventyConfig.addAsyncShortcode(
    shortcode,
    function (src, fileRelative = true) {
      if (fileRelative) {
        src = path.join(path.dirname(this.page.inputPath), src);
      }
      return fs.promises.readFile(src, { encoding: "utf8" });
    }
  );
};
