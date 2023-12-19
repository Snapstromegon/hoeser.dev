import { basename, isAbsolute, join, resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { bundle } from "lightningcss";

/**
 *
 * @param {*} eleventyConfig
 * @param {{mapDir: string, lightningOptions: import("lightningcss").BundleOptions}} param1
 */
export default (
  eleventyConfig,
  { mapDir = "assets/css", lightningOptions = {} } = {}
) => {
  eleventyConfig.addShortcode(
    "lightningcss",
    async function(cssFile) {
      let inputPath = resolve(this.page.inputPath, cssFile);
      if (isAbsolute(cssFile)) {
        inputPath = resolve(cssFile.slice(1));
      }
      const { code, map } = bundle({
        filename: inputPath,
        sourceMap: true,
        ...lightningOptions,
      });
      const mapPath = join("/", mapDir, `${basename(cssFile)}.map`);
      if (mapDir) {
        await mkdir(join("_site", mapDir), { recursive: true });
        await writeFile(resolve("_site", mapDir, `${basename(cssFile)}.map`), map);
      }
      return `<style>${code}/*# sourceMappingURL=${mapPath.replaceAll("\\", "/")} */</style>`;
    }
  );
};
