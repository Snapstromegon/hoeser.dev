---
title: Using shiki with 11ty
abstract: |
  Shiki is a really nice syntax highlighter that I already wrote about. This is just a short post to show you how to use it with eleventy.
date: 2023-02-07
tags:
  - tool:11ty
  - tool:shiki
  - concept:SSG
  - concept:syntax-highlight
---

:::commentBlock
Since my [last post about shiki][syntax-highlighting-post] was really long and described a really deep way on how to use and modify shiki, this is the complete opposite. This shows just short and simple how to use shiki in your [eleventy (11ty)][11ty] project.
:::

## TLDR

Add this file to your project e.g. as `libs/shiki.js`:

```js
const shiki = require('shiki');

module.exports = (eleventyConfig, options) => {
  // empty call to notify 11ty that we use this feature
  // eslint-disable-next-line no-empty-function
  eleventyConfig.amendLibrary('md', () => {});

  eleventyConfig.on('eleventy.before', async () => {
    const highlighter = await shiki.getHighlighter(options);
    eleventyConfig.amendLibrary('md', (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => highlighter.codeToHtml(code, { lang }),
      })
    );
  });
};
```

And then add it as a plugin to your `eleventyConfig`:

```js
module.exports = function(eleventyConfig) {

  eleventyConfig.addPlugin(require("libs/shiki.js"), { theme: "dark-plus" }); // [sh! focus]

  // [...]
}
```

:::reader-thought
That's all? Those couple of lines to all the work?
:::

:::writer-thought
Yep, that's all.
There is no hidden magic and everything that you can pass to `shiki.getHighlighter()` you can pass as options to this plugin.
So if you're fine with the limitation that you can't add some fancy focus, highlight or diff markers, then this is already enough for you.
:::

## The not so short version

Let's start with an empty plugin:

```js
module.exports = (eleventyConfig, options) => {
};
```

`eleventyConfig` is the current eleventyConfig like it's also passed into your `.eleventy.js` (or similar) file. `options` is just the second parameter you can add to your `eleventyConfig.addPlugin(plugin, someOptions)` call. The `options` just get passed through.

Since [11ty] does not yet support [async configuration functions][eleventy-async-config], but shiki needs them, we need to do a small trick: 11ty hooks can be async. So let's piggyback off of the `eleventy.before` event.

```js
const shiki = require('shiki'); // [sh! ++]

module.exports = (eleventyConfig, options) => {
  eleventyConfig.on('eleventy.before', async () => { // [sh! ++:start]
    const highlighter = await shiki.getHighlighter(options);
  }); // [sh! ++:end]
};
```

:::sidenote
The `eleventyConfig.amendLibrary()` function is new in 11ty 2.0. You can still work around this on <2.0 by pulling the highlighter variable into an outer scope and using the `eleventyConfig.setLibrary()` function.
:::

Now we just need to replace the default syntax highlighter of our markdown library with our custom one:

```js
const shiki = require('shiki');

module.exports = (eleventyConfig, options) => {
  eleventyConfig.on('eleventy.before', async () => {
    const highlighter = await shiki.getHighlighter(options);
    eleventyConfig.amendLibrary('md', (mdLib) => // [sh! ++:start]
      mdLib.set({
        highlight: (code, lang) => highlighter.codeToHtml(code, { lang }),
      })
    ); // [sh! ++:end]
  });
};
```

This is basically done, but we need to add one empty `eleventyConfig.amendLibrary()` call, so eleventy knows that we want to change the library and actually calls our amend function:

```js
const shiki = require('shiki');

module.exports = (eleventyConfig, options) => {
  // [sh! ++:start]
  // empty call to notify 11ty that we use this feature
  // eslint-disable-next-line no-empty-function
  eleventyConfig.amendLibrary('md', () => {});
  // [sh! ++:end]
  eleventyConfig.on('eleventy.before', async () => {
    const highlighter = await shiki.getHighlighter(options);
    eleventyConfig.amendLibrary('md', (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => highlighter.codeToHtml(code, { lang }),
      })
    );
  });
};
```

If you now want to know where to look next, take a look at the [shiki project page][shiki].

[syntax-highlighting-post]: /blog/2023-02-01-syntax-highlight
[11ty]: https://11ty.dev
[eleventy-async-config]: https://github.com/11ty/eleventy/issues/614
[shiki]: https://shiki.matsu.io/
