const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const rollupper = require("./lib/rollupper");
const Image = require("@11ty/eleventy-img");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

async function imageShortcode(src, alt, sizes) {
  const default_sizes = [256, 512, 1024, 2048];
  let metadata = await Image(src, {
    widths: default_sizes,
    formats: ["avif", "webp", "jpeg"],
    outputDir: "_site/img/"
  });

  let imageAttributes = {
    alt,
    sizes: sizes || default_sizes.map(x => x+"w"),
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = (eleventyConfig) => {
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strict_filters: true,
  });
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(syntaxHighlight, { alwaysWrapLineHighlights: true });
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    return !outputPath.endsWith(".html")
      ? content
      : htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
        });
  });
  eleventyConfig.addAsyncShortcode("image", imageShortcode);
  eleventyConfig.addPlugin(rollupper, {
    rollup: {
      output: {
        format: "es",
        dir: "_site/js",
      },
    },
  });

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
