const yaml = require("js-yaml");
const htmlmin = require("html-minifier");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const imageShortcode = require("./lib/image");
const rollupper = require("./lib/rollupper");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(imageShortcode);
  eleventyConfig.addPlugin(rollupper, {
    rollup: {
      output: {
        format: "es",
        dir: "_site/js",
      },
    },
  });
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );
  eleventyConfig.addDataExtension("yml", (contents) => yaml.safeLoad(contents));
  // eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
  //   return !outputPath.endsWith(".html")
  //     ? content
  //     : htmlmin.minify(content, {
  //         useShortDoctype: true,
  //         removeComments: true,
  //         collapseWhitespace: true,
  //       });
  // });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
