const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");

const eleventy = require("@11ty/eleventy");

async function imageShortcode(src, alt="") {
  let metadata = await Image(src, {
    widths: [500, 800, 1200, 2000, null],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "./_site/img"
  });

  let lowsrc = metadata.jpeg[0];
  const highsrc = metadata.jpeg.slice(-1)[0];

  return `<picture>
  ${Object.values(metadata).map(imageFormat => `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${imageFormat.map(f => f.width).join(",")}">`).join("\n")}
    <img
      src="${lowsrc.url}"
      style="aspect-ratio: ${highsrc.width}/${highsrc.height}"
      alt="${alt}"
      loading="lazy"
      decoding="async">
  </picture>`;
}

module.exports = eleventyConfig => {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addDataExtension("yaml", contents => yaml.safeLoad(contents));
  eleventyConfig.addDataExtension("yml", contents => yaml.safeLoad(contents));
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  }
}