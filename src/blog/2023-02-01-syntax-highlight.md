---
title: Improving Syntax Highlighting
abstract: |
  Adding syntax highlighting to a blog is hard, doing it in a good way is hard. I recently switched my setup away from @11ty/eleventy-plugin-syntaxhighlight to a custom solution based on Shiki.
date: 2023-02-01
tags:
  - type:update
  - lang:md
  - tool:11ty
  - tool:shiki
  - concept:SSG
  - concept:syntax-highlight
---

## The good old times

If you're a longtime reader of my block, you might've noticed that my code snippets across my blog changed a little while ago. Since I'm using eleventy (11ty) to build this blog, I've used [@11ty/eleventy-plugin-syntaxhighlight] to get syntax highlighting working.
It's a good solution and easy to set up, but it's not perfect. To "fix" this issue for me, I took a look around at possible better solutions.

To my surprise Zach Leatherman (creator of eleventy and the syntax highlighting plugin) was also [looking for other options for some time][eleventy-plugin-syntaxhighlight-new-options].
In a [seperate issue][eleventy-plugin-syntaxhighlight-torchlight] someone mentioned [Torchlight].

:::sidenote
I really like this style of leading focus to the interesting parts that [Torchlight] uses.
:::

## On the topic of Torchlight

[Torchlight] seems really great at first glance. Its features (while not really hard to come up with) are helpful and intuitive.
The aproach of using the VSCode backend is really good, as it lets me stop verifying that code actually looks correct on the site and the options of thousands of VSCode themes is also great.

It can do things like making you focus the right lines...

```js
class Person {
  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }

  get isAdult() {
    // [sh! focus:start]
    return this.#age >= 18;
  } // [sh! focus:end]

  birthday() {
    this.#age++;
  }
}
```

...highlighting...

```js
class Person {
  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }

  birthday() {
    this.#age++; // [sh! highlight]
  }
}
```

...or showing diffs...

```js
class Person {
  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }

  get isAdult() {
    return this.#age >= 21; // [sh! --]
    return this.#age >= 18; // [sh! ++]
  }
}
```

...or even combine all of that...

```js
class Person {
  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }

  get isAdult() {
    // [sh! focus:start]
    return this.#age >= 21; // [sh! --]
    return this.#age >= 18; // [sh! ++]
  }

  birthday() {
    this.#age++; // [sh! highlight]
  } // [sh! focus:end]
}
```

But it can't be all roses...

### It's an API

I'm not against SaaS solutions, but something like a syntax highlighter that has to run in my build process is not something I'd want. Not when there are solutions out there that work locally.
Just imagine being on a train or plane, trying to get some work done, but your local build won't compile, because your syntax highlighter can't get an internet connection?
Or you want to create some internal documentation with some confidential code and you can't use your normal syntax highlighter, because it uploads your code to the cloud?

So in general, I don't think an API is a good solution here.

### Pricing

In a world where even the base for your product (which is also the biggest part of it) is free and open source, offering a service that costs 14$ monthly or 140$ annually for 5000 requests per month to me is not worth it.

:::reader-thought
But there are cheaper plans!
:::

:::writer-thought
Yes, there are. 5$ a month as a sponsor or free for "non-revenue generating projects" that "link back to torchlight.dev".

First of all I like using stuff that I could also use professionally if I wanted and second, I don't like required backlinks.

This doesn't mean, that I'm not willing to spend money on good work (5$ is just the monthlöy amount I currently contribute to the eleventy project) or don't want to give projects a shoutout (you find those often on here),
:::

### API Limits

For my usecase I most often need one API call per code block and with the number of code blocks I have in this blog, I would (at my current build rates) hit the 5000 requests per month fairly soon. If I were to go with one of the non-commercial licenses, I wouldn't even know the API limit, but I guess they are lower.

Overall After a short look, I decided that this is not the way forward for me.

:::reader-thought
But the examples above look just like [Torchlight]. You said, you're not using it, so what is it?
:::

:::writer-thought
Correct, that's not Torchlight. But I made something similar, so let me explain...
:::

## Here comes Shiki

[Shiki] is a syntax highlighter build by [Pine] (who also worked on VSCode in the past).
It also uses TextMate grammars, so it tokenizes the same way and with the same language support VSCode does and it also uses VSCode themes.

If you take a look at the [Shiki GitHub repository][shiki-repo], you'll see that the project is just before 1.0 and that you can do a lot more than [the website][shiki] tells you at first.

### Getting Shiki to run in Eleventy

Eleventy still doesn't have support for [async configurations][eleventy-async-config]. This is bad, because shiki only offers the highlighter object behind an async function. But luckily for us, eleventy does allow passing async functions as listeners to the "eleventy.before" event, so we can exploit that like this:

```js
const markdownIt = require("markdown-it");
const shiki = require("shiki");

module.exports = (eleventyConfig) => {
  // Move highlighter to this scope, so it's available everywhere [sh! focus:start]
  let highlighter; // [sh! highlight]

  // Async setup of shiki highlighter
  eleventyConfig.on("eleventy.before", async () => {
    highlighter = await shiki.getHighlighter({ theme: "dark-plus" }); // [sh! highlight]
  });

  // build markdownIt options
  let options = {
    html: true,
    highlight: (code, lang) => highlighter.codeToHtml(code, { lang }), // [sh! highlight]
  };

  // switch to custom markdownIt
  eleventyConfig.setLibrary("md", markdownIt(options)); // [sh! focus:end]
};
```

If you're already on eleventy 2.0, you can do it even shorter and without the pulled out highlighter definition:

```js
const markdownIt = require("markdown-it");
const shiki = require("shiki");

module.exports = (eleventyConfig) => {
  eleventyConfig.on("eleventy.before", async () => {
    // [sh! focus:start]
    const highlighter = await shiki.getHighlighter({ theme: "dark-plus" });
    eleventyConfig.amendLibrary("md", (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => highlighter.codeToHtml(code, { lang }),
      })
    );
  }); // [sh! focus:end]
};
```

If you try to run the code above, you'll probably be frustrated at first, because your highlighter doesn't get called.
If you check, the event and the callback is fired, but the library is never amended. This is, because eleventy monitors which libraries are amended at all before the "eleventy.before" event is called. To our luck it still works if we amend the library during the "eleventy.before" event, so we can do the following:

```js
const markdownIt = require("markdown-it");
const shiki = require("shiki");

module.exports = (eleventyConfig) => {
  eleventyConfig.on("eleventy.before", async () => {
    // [sh! focus:start]
    const highlighter = await shiki.getHighlighter({ theme: "dark-plus" });
    eleventyConfig.amendLibrary("md", (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => highlighter.codeToHtml(code, { lang }),
      })
    );
  });
  // [sh! add:start]
  // This is a hack to let eleventy know that we touch that library
  eleventyConfig.amendLibrary("md", () => {}); // [sh! focus:end add:end]
};
```

Now everything works like expected and we can remove [@11ty/eleventy-plugin-syntaxhighlight] if we used it before.

## Building Torchlight features

And now the interesting part: How do we get [Shiki] to be like [Torchlight]?

Let's start with the endresult from above:

````md{!sh!}
...or even combine all of that...

```js
class Person {
  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }

  get isAdult() { // [sh! focus:start]
    return this.#age >= 21; // [sh! --]
    return this.#age >= 18; // [sh! ++]
  }

  birthday() {
    this.#age++; // [sh! highlight]
  } // [sh! focus:end]
}
```

But it can't be all roses...
````

As you can see, there are some comments in my code, which are not in the original.
Maybe you already have a guess how this works, but just to give you another hint, here is the generated HTML (shortened):

```html
<pre class="shiki " style="background-color: #1E1E1E">
  <div class="language-id">js</div>
  <code>
    <span class="line"><span style="color: #569CD6">class</span><!-- [...] --></span>
    <span class="line"><span style="color: #D4D4D4">  </span><!-- [...] --></span>
    <span class="line"><span style="color: #D4D4D4">    </span><!-- [...] --></span>
    <span class="line"><span style="color: #D4D4D4">    </span><!-- [...] --></span>
    <span class="line"><span style="color: #D4D4D4">  }</span></span>
    <span class="line"></span>
    <span class="line sh--focus"><span style="color: #D4D4D4">  </span><!-- [...] --></span>
    <span class="line sh--remove sh--focus"><span style="color: #D4D4D4">    </span><!-- [...] --></span>
    <span class="line sh--add sh--focus"><span style="color: #D4D4D4">    </span><!-- [...] --></span>
    <span class="line sh--focus"><span style="color: #D4D4D4">  }</span></span>
    <span class="line sh--focus"></span>
    <span class="line sh--focus"><span style="color: #D4D4D4">  </span><!-- [...] --></span>
    <span class="line sh--highlight sh--focus"><span style="color: #D4D4D4">    </span><!-- [...] --></span>
    <span class="line sh--focus"><span style="color: #D4D4D4">  } </span></span>
    <span class="line"><span style="color: #D4D4D4">}</span></span>
    <span class="line"></span>
  </code>
</pre>
```

Each line of code is transformed into on `<span/>` with the class "line" and optionally some modifier classes.
Now that you've seen how the end product works, we'll start with a first "simple" step.

### Inject classes and monipulate tokens

To modify the output, we need to adapt our eleventy integration for [Shiki] from above as follows:

```js
const markdownIt = require("markdown-it");
const shiki = require("shiki");

module.exports = (eleventyConfig) => {
  eleventyConfig.on("eleventy.before", async () => {
    const highlighter = await shiki.getHighlighter({ theme: "dark-plus" });
    eleventyConfig.amendLibrary("md", (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => highlighter.codeToHtml(code, { lang }), // [sh! --]
        highlight: (code, lang) => highlight(code, lang, highlighter), // [sh! ++]
      })
    );
  });

  // This is a hack to let eleventy know that we touch that library
  eleventyConfig.amendLibrary("md", () => {});
};
// [sh! ++:start]
const highlight = (code, lang, highlighter) => {
  const tokenized = highlighter.codeToThemedTokens(code, lang); // [sh! highlight]

  // Here be magic
  const lineOptions = [];

  const theme = highlighter.getTheme();
  return shiki.renderToHtml(tokenized, {
    lineOptions,
    bg: theme.bg,
    fg: theme.fg,
    langId: lang,
  });
}; // [sh! ++:end]
```

In the following we will take a closer look at the `tokenized` variable and how `lineOptions` helps us do the magic.

:::sidenote
In my implementation I call these `[sh! ...]` blocks "markers" which contain itself "commands". Further down I'll also introduce "lineSpec"s, but ignore that for now.
:::

### Single line commands

With single line commands are commands meant, that only affect the line they are written on. This is the most simple way of doing things, but has the downside of requireing a command on every line.

```js{!sh!}
const isParent = (person) => {
  return person.children.length > 0; // [sh! highlight]
};
```

#### Tokens

After tokenization, this becomes the following hard to read array of array of tokens.
To make it at least somewhat readable I focused just the lines that are relevant to us.

```json
[ // [sh! focus]
  [
    // [...] line of tokens
  ],
  [ // [sh! focus]
    {
      "content": "  ",
      "explanation": [
        {
          "content": "  ",
          "scopes": [
            { "scopeName": "source.js" },
            { "scopeName": "meta.var.expr.js" },
            { "scopeName": "meta.arrow.js" },
            { "scopeName": "meta.block.js" }
          ]
        }
      ]
    },
    {
      "content": "return",
      "explanation": [
        {
          "content": "return",
          "scopes": [
            { "scopeName": "source.js" },
            { "scopeName": "meta.var.expr.js" },
            { "scopeName": "meta.arrow.js" },
            { "scopeName": "meta.block.js" },
            { "scopeName": "keyword.control.flow.js" }
          ]
        }
      ]
    },
    // [...]
    { // [sh! focus:start]
      "content": "// [sh! highlight]",
      "explanation": [ // [sh! focus:end]
        {
          "content": "//",
          "scopes": [
            { "scopeName": "source.js" },
            { "scopeName": "meta.var.expr.js" },
            { "scopeName": "meta.arrow.js" },
            { "scopeName": "meta.block.js" },
            { "scopeName": "comment.line.double-slash.js" },
            { "scopeName": "punctuation.definition.comment.js" }
          ]
        },
        { // [sh! focus:start]
          "content": " [sh! highlight]",
          "scopes": [ // [sh! focus:end]
            { "scopeName": "source.js" },
            { "scopeName": "meta.var.expr.js" },
            { "scopeName": "meta.arrow.js" },
            { "scopeName": "meta.block.js" },
            { "scopeName": "comment.line.double-slash.js" } // [sh! focus:start]
          ]
        }
      ]
    }
  ], // [sh! focus:end]
  [
    // [...] line of tokens
  ],
  []
] // [sh! focus]
```

Be aware that in this case the "//" has its own "explanation", but in other languages like Rust it's in just one or in the case of CSS in three. Because of that we can't rely on the existence of a simple content explaination that includes just the marker and command - believe me, I'd love it to be that way.

So now we know as humans where to look, let's make the computer do stuff!

#### Is a token a comment

First off we determine wether or not a token is a command:

```js
const isTokenComment = (token) =>
  (token.explanation || []).some((explanation) =>
    explanation.scopes.some((scope) => scope.scopeName.startsWith("comment."))
  );
```

This checks wether any scope of any explanation starts with the string "comment.", which means that this token is a comment.

#### Extract a command from a comment

Based on this info we can find all commands in a line by simple taking each comment token (which are easy to get with a filter) and making a simple regular expression match on it.

```js
const extractLineShikierCommands = (line) => {
  const shikierCommandsExtractor = /\[sh!(?<commands>[^\]]*)\]/g;
  const commands = [];
  for (const token of line.filter(isTokenComment)) {
    const match = shikierCommandsExtractor.exec(token.content);
    if (match) {
      commands.push(...match?.groups?.commands.trim().split(/\s/));
    }
  }
  return commands;
};
```

:::commentBlock
Since regular expressions are a little hard to understand, I'll explain it in more details:

```
/                 # start of regular expression
  \[sh!           # the text "[sh!" with "[" escaped
    (?<commands>  # start of capture group with name "commands"
      [           # start of character set
        ^\]       # Any character that is not the literal "]"
      ]*          # end of character set + "*" for "take any number of these characters"
    )             # end of capture group
  \]              # a literal "]"
/g                # end of regular expression and "global" modifier
```

To put it in words, it would be

```
"[sh!" + <any text that is not "]" saved as "commands"> + "]"
```

I hope this helps a little with understanding this expression.
:::

For now let's just assume that a comment is either a "real" comment we want to keep, or a marker comment.
To make the marker comment not appear in the final output, we'll just delete it from the tokens:

```js
const extractLineShikierCommands = (line) => {
  const shikierCommandsExtractor = /\[sh!(?<commands>[^\]]*)\]/g;
  const commands = [];
  for (const token of line.filter(isTokenComment)) {
    const match = shikierCommandsExtractor.exec(token.content);
    if (match) {
      commands.push(...match?.groups?.commands.trim().split(/\s/));
      line.splice( // [sh! add:3]
        line.findIndex((t) => t === token),
        1
      );
    }
  }
  return commands;
};
```

#### Get all commands for a codeblock

This allows us to extract all commands from all lines with a simple for loop:

```js

const highlight = (code, lang, highlighter) => {
  const tokenized = highlighter.codeToThemedTokens(code, lang);

  const linesWithCommands = new Map(); // [sh! focus:start]
  tokenized.forEach((line, lineIndex) => {
    const commands = extractLineShikierCommands(line, options);
    if (commands.length > 0) {
      linesWithCommands.set(lineIndex + 1, commands);
    }
  }); // [sh! focus:end]


  const lineOptions = [];

  const theme = highlighter.getTheme();
  return shiki.renderToHtml(tokenized, {
    lineOptions,
    bg: theme.bg,
    fg: theme.fg,
    langId: lang,
  });
};
```

#### Apply commands as classes

To add commands to a line, we (for now) just pass the command as a class to the line in the form `sh--{command}`.

```js
const lineOptions = [...linesWithCommands.entries()].map(
  ([lineNumber, commands]) => ({
    line: lineNumber,
    classes: commands.map((command) => `sh--${command}`),
  })
);
```

#### Add command aliases

[Torchlight] allows you to use shorter aliases for some common commands like `++` instead of `add` or `--` instead of `remove`. I like this feature, so let's build it too:

```js
const lineOptions = [...linesWithCommands.entries()].map(
  ([lineNumber, commands]) => ({
    line: lineNumber,
    classes: commands.map((command) => `sh--${resolveCommandShortcuts(command)}`), // [sh! focus]
  })
);

const resolveCommandShortcuts = (command) => { // [sh! focus:start]
  return (
    {
      "++": "add",
      "--": "remove",
      "~~": "highlight",
      "**": "focus",
    }[command] || command
  );
};
```

#### Make it with Style

Did I mention that our finished solution won't use JS? No? Okay, maybe you already expected this, because it's my blog here and I love to do stuff purely in HTML+CSS or because you have JS disabled and the examples worked.


[@11ty/eleventy-plugin-syntaxhighlight]: https://www.npmjs.com/package/@11ty/eleventy-plugin-syntaxhighlight
[eleventy-plugin-syntaxhighlight-new-options]: https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/32
[eleventy-plugin-syntaxhighlight-torchlight]: https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/74
[torchlight]: https://torchlight.dev/
[shiki]: https://shiki.matsu.io/
[pine]: https://blog.matsu.io/about
[shiki-repo]: https://github.com/shikijs/shiki
[eleventy-async-config]: https://github.com/11ty/eleventy/issues/614
