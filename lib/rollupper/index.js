const rollup = require("rollup");
const path = require("path");
const crypto = require("crypto");

module.exports = (eleventyConfig, options) => {
  const rollupper = new Rollupper(eleventyConfig, options);
};

class Rollupper {
  inputFiles = {};
  rollupOptions = {};

  constructor(eleventyConfig, { shortcode = "rollup", rollup } = {}) {
    this.rollupOptions = rollup;
    eleventyConfig.on("beforeBuild", () => this.beforeBuild());
    eleventyConfig.on("afterBuild", () => this.afterBuild());
    const thisRollupper = this;
    eleventyConfig.addAsyncShortcode(shortcode, function (...args) {
      return thisRollupper.rollupperShortcode(this, ...args);
    });
  }

  beforeBuild() {
    this.inputFiles = {};
  }

  rollupperShortcode(eleventyInstance, src, fileRelative = true) {
    let inputSrc = src;
    if (fileRelative) {
      inputSrc = path.join(path.dirname(eleventyInstance.page.inputPath), src);
    }

    inputSrc = path.resolve(inputSrc);

    const fileHash = crypto.createHash("sha256");
    fileHash.update(inputSrc);
    const scriptSrc = fileHash.digest("hex").substr(0, 6) + ".js";
    this.inputFiles[inputSrc] = scriptSrc;

    const scriptPath = path.join(this.rollupOptions.output.dir, scriptSrc);
    const relativePath = path.relative(
      eleventyInstance.page.outputPath,
      scriptPath
    );

    const result = `<script src="${relativePath}" type="module"></script>`;
    return result;
  }

  async afterBuild() {
    const bundle = await rollup.rollup({
      input: Object.keys(this.inputFiles),
      ...this.rollupOptions,
    });
    const inputFiles = this.inputFiles;
    await bundle.write({
      entryFileNames: (chunk) => {
        return inputFiles[chunk.facadeModuleId];
      },
      ...this.rollupOptions.output,
    });
    await bundle.close();
  }
}
