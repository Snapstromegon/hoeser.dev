const { bundle } = require('lightningcss');
const path = require('node:path');
const { writeFile, mkdir } = require('node:fs/promises');

/**
 *
 * @param {*} eleventyConfig
 * @param {{mapDir: string, lightningOptions: import("lightningcss").BundleOptions}} param1
 */
module.exports = (
  eleventyConfig,
  { mapDir = 'assets/css', lightningOptions = {} } = {}
) => {
  eleventyConfig.addShortcode(
    'lightningcss',
    async function (cssFile, inline = false) {
      let inputPath = path.resolve(this.page.inputPath, cssFile);
      if (path.isAbsolute(cssFile)) {
        inputPath = path.resolve(cssFile.slice(1));
      }
      const { code, map } = bundle({
        filename: inputPath,
        sourceMap: true,
        ...lightningOptions,
      });
      const mapPath = path.join("/", mapDir, `${path.basename(cssFile)}.map`);
      if (mapDir) {
        await mkdir(path.join('_site', mapDir), { recursive: true });
        await writeFile(path.resolve('_site', mapDir, `${path.basename(cssFile)}.map`), map);
      }
      return `<style>${code}/*# sourceMappingURL=${mapPath.replaceAll("\\", "/")} */</style>`;
    }
  );
};
