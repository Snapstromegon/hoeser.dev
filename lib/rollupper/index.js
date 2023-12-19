import { resolve as _resolve, dirname, join, relative } from "path";
import { createHash } from "crypto";
import { createReadStream } from "fs";
import { rollup } from "rollup";

class Rollupper {
  inputFiles = {};
  rollupOptions = {};

  constructor(
    eleventyConfig,
    { shortcode = "rollup", rollup: rollupConfig } = {},
  ) {
    this.rollupOptions = rollupConfig;
    eleventyConfig.on("beforeBuild", () => this.beforeBuild());
    eleventyConfig.on("afterBuild", () => this.afterBuild());

    // We want to use "this" in the callback function, so we save the class instance beforehand
    const thisRollupper = this;
    eleventyConfig.addAsyncShortcode(shortcode, function(...args) {
      return thisRollupper.rollupperShortcode(this, ...args);
    });
  }

  beforeBuild() {
    this.inputFiles = {};
  }

  async rollupperShortcode(eleventyInstance, rawSrc, fileRelative = false) {
    // Resolve to the correct relative location
    const relativeSrc = fileRelative
      ? join(dirname(eleventyInstance.page.inputPath), rawSrc)
      : rawSrc;

    // resolve to absolute, since rollup uses absolute paths
    const absoluteSrc = _resolve(relativeSrc);

    // generate a unique name for the file.
    // we take the first 6 chars of the sha256 of the absolute paths.
    const fileHash = await new Promise((resolve, reject) => {
      const hash = createHash("sha256");
      const input = createReadStream(absoluteSrc);

      input.on("error", reject);

      input.on("data", chunk => {
        hash.update(chunk);
      });

      input.on("close", () => {
        resolve(hash.digest("hex"));
      });
    });
    const scriptSrc = `${fileHash.substr(0, 6)}.js`;

    // register for rollup bundling
    this.inputFiles[absoluteSrc] = scriptSrc;

    // calculate script src after bundling
    const relativePath = relative(
      eleventyInstance.page.outputPath,
      join(this.rollupOptions.output.dir, scriptSrc),
    );

    return `<script src="${relativePath}" type="module"></script>`;
  }

  async afterBuild() {
    // Return early if no JS was used, since rollup throws on empty inputs
    if (!Object.keys(this.inputFiles).length) {
      return;
    }
    const bundle = await rollup({
      input: Object.keys(this.inputFiles),
      ...this.rollupOptions,
    });
    const { inputFiles } = this;
    await bundle.write({
      entryFileNames: chunk => inputFiles[chunk.facadeModuleId],
      ...this.rollupOptions.output,
    });
    await bundle.close();
  }
}

export default (eleventyConfig, options) => new Rollupper(eleventyConfig, options);
