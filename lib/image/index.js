const Image = require("@11ty/eleventy-img");
const path = require('path');

module.exports = (eleventyConfig, {
    widths = [500, 800, 1200, 2000, null],
    formats = ["avif", "webp", "jpeg"],
    outputDir = "./_site/img",
    shortcode = "image"
} = {}) => {
    eleventyConfig.addAsyncShortcode(shortcode, async function (src, alt = "", fileRelative = true) {
        if (fileRelative) {
            src = path.join(path.dirname(this.page.inputPath), src)
        }
        let output = await Image(src, {
            widths,
            formats,
            outputDir
        });

        let lowsrc = output.jpeg[0];
        const highsrc = output.jpeg.slice(-1)[0];

        return `<picture>
    ${Object.values(output).map(imageFormat => `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${imageFormat.map(f => f.width).join(",")}">`).join("\n")}
      <img
        src="${lowsrc.url}"
        style="aspect-ratio: ${highsrc.width}/${highsrc.height}"
        alt="${alt}"
        loading="lazy"
        decoding="async">
    </picture>`;
    });
}