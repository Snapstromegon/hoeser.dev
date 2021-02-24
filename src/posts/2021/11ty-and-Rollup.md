---
title: 11ty and Rollup - a take on current build pipelines
short: |
  I love rollup and I love 11ty (eleventy), but mixing the two seems to be a little hard - at least when looking at the starter projects presented on 11ty's website.
  Here's my take on it.
date: 2021-02-22
eleventyNavigation:
  key: 11ty and Rollup
  parent: Posts
keywords:
- 11ty
- eleventy
- Rollup
- JS
- Static Site Generation (SSG)
- Server Side Rendering (SSR)
---

# Preface

I started late with 11ty (eleventy)... Really late... Like a week ago.

It always intrigued me and I wanted to try it, but never found the time to do it.
I love Web Performance and if my site doesn't reach Lighthouse fireworks I'm not letting it deploy (at least for smaller projects) so Server Side Rendering (SSR) and Static Site Generation (SSG) always was something I tried to stick to.

When I finally touched 11ty for the first time (while creating this blog) it instantly hit the right buttons and I can't understand why I held back for so long.

But what is a true love without some pain points...

As I see it, 11ty is the perfect solution for doing Blogs and sites where you want the ability to give each page its own feeling if you want to.
This is really great, but as long as 11ty doesn't include an asset pipeline (I'm on 11ty 0.11 and 1.0 is not out yet) and more features from build tools and bundlers it's fairly hard to combine classic bundlers with 11ty.

# Current way of doing business

After looking at the two 11ty starter projects which include rollup (this is also true for the webpack and parcel ones I looked at) , they do one of the following solutions:

## 11ty then Rollup

They do basically this:

1. Run 11ty
2. Run rollup with a config file

This is used by [nhoizey/pack11ty](https://github.com/reeseschultz/11r).

## Rollup then 11ty

This is the same just the other way around:

1. Run 11ty
2. Run rollup with a config file

This is used by [reeseschultz/11r](https://github.com/reeseschultz/11r).

To be clear, there is nothing wrong with this in many cases and often it's probably the easiest way of doing this and also the build times are better than with my solution.

# The problem

Imagine the following:

You're writing a blog and want to include some JS tool for just one blog entry, e.g. because you're showing how an JS alert works:

```js/1-3
{% includeFile "11ty-and-Rollup/js/alertButton.js" %}
```

<button id="myAlertButton" style="padding: var(--s)" disabled>Say Hallo World!</button>

{% rollup "11ty-and-Rollup/js/alertButton.js" %}

For this to work I have two options:

- Include the file in my general bundle and probably serve it on every page load
- Reference it directly via a script tag and circumvent the bundler

Both options don't seem okay for me.

# Insert Custom Plugin

The following is more like a proof of concept than an usable solution.

What if we integrate into the 11ty build pipeline instead of running it before or after an 11ty build. That way we'd be able to include just those chunks which are actually needed and all chunks run through rollup.

## How it works

The idea is fairly simple and uses the 11ty shortcodes and build events, the rollup JS api and 11ty's plugin system.

Before we get to the magic, we expart a small registering hook for an instance of our plugin class "Rollupper" (yes, I'm always creative with my names).

```js
// [...]

module.exports = (eleventyConfig, options) => {
  new Rollupper(eleventyConfig, options);
};

class Rollupper {
  // [...]
}
```

It works by first using 11ty's _beforeBuild_ event to prepare the run (e.g. clean rests of old builds).

```js
// [...]
class Rollupper {
  inputFiles = {};
  // [...]

  constructor(eleventyConfig, { shortcode = "rollup", rollup } = {}) {
    eleventyConfig.on("beforeBuild", () => this.beforeBuild());
    // [...]
  }

  beforeBuild() {
    this.inputFiles = {};
  }

  // [...]
}
```

Then, instead of writing `<script [...]></script>`, you include a js file with a shortcode in your blogposts md (or whatever languages you're using). I chose `rollup` for this, but you can modify it.

```liquid
{% raw %}{# <script src="./this-post/js/tool.js"> #}
{% rollup "./this-post/js/tool.js" %}{% endraw %}
```

The shortcode basically resolves the relative paths to absolute ones and stores the files in a registry.

```js
const path = require("path");
const crypto = require("crypto");

// [...]

class Rollupper {
  inputFiles = {};
  rollupOptions = {};

  constructor(eleventyConfig, { shortcode = "rollup", rollup } = {}) {
    this.rollupOptions = rollup;
    // [...]

    // We want to use "this" in the callback function, so we save the class instance beforehand
    const thisRollupper = this;
    eleventyConfig.addAsyncShortcode(shortcode, function (...args) {
      return thisRollupper.rollupperShortcode(this, ...args);
    });
  }

  // [...]

  async rollupperShortcode(eleventyInstance, src, fileRelative = true) {
    // Resolve to the correct relative location
    if (fileRelative) {
      src = path.join(path.dirname(eleventyInstance.page.inputPath), src);
    }

    // resolve to absolute, since rollup uses absolute paths
    src = path.resolve(src);

    // generate a unique name for the file.
    // we take the first 6 chars of the sha256 of the absolute paths.
    const fileHash = await new Promise(function (resolve, reject) {
      const hash = crypto.createHash("sha256");
      const input = fs.createReadStream(src);

      input.on("error", reject);

      input.on("data", function (chunk) {
        hash.update(chunk);
      });

      input.on("close", function () {
        resolve(hash.digest("hex"));
      });
    });
    const scriptSrc = fileHash.substr(0, 6) + ".js";

    // register for rollup bundling
    this.inputFiles[src] = scriptSrc;

    // calculate script src after bundling
    const relativePath = path.relative(
      eleventyInstance.page.outputPath,
      path.join(this.rollupOptions.output.dir, scriptSrc)
    );

    return `<script src="${relativePath}" type="module"></script>`;
  }

  // [...]
}
```

### The rollupperShortcode method

As you can see, this function does a little more than I told you before.
Basically it resolves the barrier between Rollup and 11ty.
It has the ability to match up the build result from rollup with the imports from 11ty.

For this it has to know what the bundle result will be after rollup is done, but how do we know what the entrypoint will be called afer bundling?

Actually this is simple! We just take over how naming works (For a realy solution, you'd take a function which immitates rollups naming module and recreates the rollup naming from a parameter, but this solution was fine for me for now). In this case we replace the name with the first six chars from the sha256 of the file.
That way we solve two problems. Firstly we can accurately predict filenames and avoid clashes and secondly we resolve cache problems and can cache those files for long times without problems.

Finally we need to return the html from the shortcode. This includes our beloved ```<script>``` with the path now relative to the output file of the blogpost (we could also use absolute paths here).

After this we just need to pass everything into rollup.

This is done via the _afterBuild_ event from 11ty to trigger our rollup run.

```js
const rollup = require("rollup");

module.exports = (eleventyConfig, options) => {
  new Rollupper(eleventyConfig, options);
};

class Rollupper {
  inputFiles = {};
  rollupOptions = {};

  constructor(eleventyConfig, { shortcode = "rollup", rollup } = {}) {
    this.rollupOptions = rollup;
    eleventyConfig.on("afterBuild", () => this.afterBuild());
  }

  async afterBuild() {
    // Return early if no JS was used, since rollup throws on empty inputs
    if (!Object.keys(this.inputFiles).length) {
      return;
    }
    const bundle = await rollup.rollup({
      input: Object.keys(this.inputFiles),
      ...this.rollupOptions,
    });
    const inputFiles = this.inputFiles;
    await bundle.write({
      entryFileNames: (chunk) => {
        return inputFiles[chunk.facadeModuleId];
      },
      ...this.rollupOptions.output,
    });
    await bundle.close();
  }
}
```

Basically we pass our used JS files as entrypoints into rollup and change the entryFileNaming to use our custom naming.

To avoid calculating the hashes twice I used inputFiles as a mapping from original to hashed names.

# The Result

With this plugin loaded in my _.eleventy.js_ config via:

```js
const rollupper = require("./lib/rollupper");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(rollupper, {
    rollup: {
      output: {
        format: "es",
        dir: "_site/js",
      },
    },
  });
};
```

I can now just write the following in my templates:

`````text
You're writing a blog and want to include some JS tool for just one blog entry, e.g. because you're showing how an JS alert works:

```js/1-3
{% raw %}{% includeFile "11ty-and-Rollup/js/alertButton.js" %}{% endraw %}
```

&lt;button id="myAlertButton" disabled>Say Hallo World!&lt;/button>

{% raw %}{% rollup "11ty-and-Rollup/js/alertButton.js" %}{% endraw %}

For this to work I have two options:
`````

With this I have a working demo with JS Code which gets bundled with all dependencies and only loaded when I actually visit the page.

# Finaly Notes

Having the starter projects, which many people use as a starting point, using the bundle approach will probably encourage developers (especially newer ones) to fall into bad bundling practices with huge bundles and lots of unused code and on the other hand will enforce the argument that SSG/SSR and Client Side JS don't play together well.

It took me <60 lines of code (excluding blank lines and comments) to include a bundling solution which doesn't have those weakpoints.

I don't think my solution is perfect (like I mentioned there's room for improvement), but it's a step in the right direction.

I'm also not the perfect with rollup and 11ty and there are probably ways to make the pipeline even simpler, but before 11ty 1.0 drops I probably won't give this another take.

<details>
<summary>
If you want to use my "Plugin", click here for the complete form as it is currently used in this blog.
This might vary from the code above, because it's the current file directly inlined.
</summary>

```js
{% includeFile "../../../lib/rollupper/index.js" %}
```

</details>
