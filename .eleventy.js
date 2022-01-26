const yaml = require("js-yaml");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const rollupper = require("./lib/rollupper");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes = []) {
  let metadata = await Image(src, {
    widths: [128, 256, 512, 1024],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "_site/img/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

async function generateFavicon(src) {
  let metadata = await Image(src, {
    widths: [64, 128, 180, 256, 512, 1024, 2048],
    formats: ["svg", "png"],
    outputDir: "_site/img/",
  });

  return `
    <link rel="icon" href="${metadata.svg[0].url}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="${
      metadata.png.find((png) => png.width == 180).url
    }">
  `;
}

function tagCategory(tag) {
  if (tag.includes(":")) {
    return tag.split(":")[0];
  }
}

function tagValue(tag) {
  if (!tag.includes(":")) return tag;
  return tag.split(":").slice(1);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(syntaxHighlight, { alwaysWrapLineHighlights: true });
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  eleventyConfig.addAsyncShortcode("image", imageShortcode);
  eleventyConfig.addAsyncShortcode("favicon", generateFavicon);
  // eleventyConfig.addShortcode("tax", taxOfPage);
  // eleventyConfig.addFilter("taxOfPage", taxOfPage);
  eleventyConfig.addFilter("tagCategory", tagCategory);
  eleventyConfig.addFilter("tagValue", tagValue);
  eleventyConfig.addFilter("niceDate", (date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()}. ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
  });
  eleventyConfig.addPlugin(rollupper, {
    rollup: {
      output: {
        format: "es",
        dir: "_site/js",
      },
    },
  });

  eleventyConfig.addWatchTarget("src/css");
  eleventyConfig.addWatchTarget("css");
  eleventyConfig.addPassthroughCopy("assets/img");

  eleventyConfig.addCollection("blogposts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/blog/*.md");
  });
  eleventyConfig.addCollection("sins", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/webdev-sins/*.md");
  });
  // Return your Object options:
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
    },
  };
};
