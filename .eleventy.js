const yaml = require("js-yaml");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");
const typescript = require("@rollup/plugin-typescript");
const { default: resolve } = require("@rollup/plugin-node-resolve");
const markdownIt = require("markdown-it");
const markdownItEmoji = require("markdown-it-emoji");
const markdownItContainer = require("markdown-it-container");
const rollupPlugin = require("eleventy-plugin-rollup");
const shiki = require("shiki");

function generateImages(src) {
  return Image(src, {
    widths: [256, 512, 1024, null],
    formats: [
      "avif",
      "webp",
      src.toLowerCase().endsWith(".png") ? "png" : "jpeg",
    ],
    outputDir: "_site/img/",
  });
}

async function imageShortcode(src, alt, sizes = []) {
  let metadata = await generateImages(src);

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
  return await Image(src, {
    widths: [64, 128, 180, 256, 512, 1024, 2048, null],
    formats: ["svg", "png", "webp", "avif"],
    outputDir: "_site/img/",
  });
}

async function generateFaviconHTML(src) {
  const metadata = await generateFavicon(src);
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
  /**
   * @type {shiki.Highlighter}
   */
  let highlighter = undefined;

  eleventyConfig.on("eleventy.before", async () => {
    if (!highlighter) {
      highlighter = await shiki.getHighlighter({
        theme: "dark-plus",
      });
    }
  });

  let options = {
    html: true,
    breaks: true,
    linkify: true,
    highlight: (code, lang) => {
      const tokens = highlighter.codeToThemedTokens(code, lang);

      const lineCommands = new Map();

      for (let i = 0; i < tokens.length; i++) {
        const line = tokens[i];
        for (const token of line) {
          const tokenIsComment = (token.explanation || []).some((explanation) =>
            explanation.scopes.some((scope) =>
              scope.scopeName.startsWith("comment.")
            )
          );
          if (tokenIsComment) {
            const commentContent = token.content;
            const commandExtractor = /\[sh!(?<commands>[^\]]*)\]/g;
            const match = commandExtractor.exec(commentContent);
            const commands = match?.groups?.commands.trim().split(/\s/);
            if (commands) {
              lineCommands.set(i + 1, commands);
              line.splice(line.findIndex((t) => t === token), 1);
            }
          }
        }
      }

      const lineOptions = [...lineCommands.entries()].map(([key, value]) => ({
        line: key,
        classes: value.map((className) => `sh--${className}`),
      }));

      return shiki.renderToHtml(tokens, {
        themeName: "dark-plus",
        bg: highlighter.getBackgroundColor(),
        fg: highlighter.getForegroundColor(),
        lineOptions,
      });
    },
  };

  eleventyConfig.setLibrary(
    "md",
    markdownIt(options)
      .use(markdownItEmoji)
      .use(markdownItContainer, "sidenote")
      .use(markdownItContainer, "commentBlock")
  );

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  eleventyConfig.addShortcode("currentTime", () => Date.now() + "");
  eleventyConfig.addAsyncShortcode("image", imageShortcode);
  eleventyConfig.addAsyncShortcode("favicon", generateFaviconHTML);
  eleventyConfig.addFilter("logging", (input, label, passthrough) => {
    console.log(`logging-${label}:`, input);
    if (passthrough) return input;
  });
  eleventyConfig.addFilter("encodeURIComponent", encodeURIComponent);
  eleventyConfig.addNunjucksAsyncFilter("faviconData", (src, callback) =>
    generateFavicon(src).then((data) => callback(null, data))
  );
  eleventyConfig.addNunjucksAsyncFilter("imageData", (src, callback) =>
    generateImages(src).then((data) => callback(null, data))
  );
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
  eleventyConfig.addPlugin(rollupPlugin, {
    rollupOptions: {
      output: {
        format: "es",
        dir: "_site/js",
        sourcemap: process.env.NETLIFY !== "true",
      },
      plugins: [typescript(), resolve()],
    },
  });

  eleventyConfig.addWatchTarget("src/css");
  eleventyConfig.addWatchTarget("assets/js/");
  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPassthroughCopy("assets/video");
  eleventyConfig.addPassthroughCopy("assets/fonts");

  eleventyConfig.addCollection("blogposts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/blog/*.md");
  });
  eleventyConfig.addCollection("sins", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/webdev-sins/*.md");
  });
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob([
      "src/blog/*.md",
      "src/webdev-sins/*.md",
    ]);
  });
  // Return your Object options:
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
    },
  };
};
