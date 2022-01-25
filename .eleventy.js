const yaml = require("js-yaml");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const rollupper = require("./lib/rollupper");

// function taxOfPage(page, prefix) {
//   if (!prefix) return page.data.tags;
//   const prefixParts = prefix.split(":");
//   return page.data.tags
//     .map((entry) => {
//       const entryParts = entry.split(":");
//       for (const prefixPart of prefixParts) {
//         if (entryParts.shift() != prefixPart) {
//           return undefined;
//         }
//       }
//       return entryParts.join(":");
//     })
//     .filter((x) => x);
// }

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
  // eleventyConfig.addShortcode("tax", taxOfPage);
  // eleventyConfig.addFilter("taxOfPage", taxOfPage);
  eleventyConfig.addFilter("tagCategory", tagCategory);
  eleventyConfig.addFilter("tagValue", tagValue);
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

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/blog/*.md");
  });
  // Return your Object options:
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
    },
  };
};
