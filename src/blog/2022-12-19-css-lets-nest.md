---
title: CSS Nesting Syntax Discussion
abstract: |
  Currently the CSS Working Group is discussing how native CSS Nesting will work and
  there are multiple options for a Nesting Syntax. I will take a look at these and provide my opinion.
date: 2022-10-20
tags:
  - lang:CSS
---

:::commentBlock
Just like in my preveous post about [Apple and the web platform][post-everything-is-chrome] I will be naming individuals and reference things the wrote, tweeted and tooted, but no matter how I talk about them here it doesn't necessarily reflect my general opinion of those individuals.

Here I'm exclusively discussing the matter of the article and even if I make some harsh comments against developers from Google or Apple, it is only in the context of this article.
:::

## How we've got here

Among my peers I'm fairly well known for loving the modern web platform and avoiding extras like unnecessary libraries and tools as much as possible. This allows me to stay up to date with the platform and build fast things atop it like [small apps][post-nativewapp] or [this blog][post-building-this-blog].

For this reason I've been waiting for native CSS nesting for years and [actively requested this feature][tweet-asking-for-nesting]. Now its being standardized and I couldn't be happier about it.

Sadly there's still a discussion about the syntax and Chrome and Webkit both hosted a vote on the syntax now. I have some opinions on this which I want to write down, so this is it I guess...

## Options, too many options

Let's start with listing the options. Here I will include the [first vote by Chrome][chrome-options] and the [second one by webkit][webkit-options].

:::commentBlock
Someone on either the WebKit or Chrome team messed up the ordering. So what is Option 1 in the Chrome vote is called Option 3 in the WebKit one. Maybe there were even official numbers for them somewhere which I don't know of.
I don't want to call a right or wrong here, so I will be prefixing the options always with either a "C" for Chrome numbering or "W" for WebKit numbering. I know this is stupid, but having to guess which one I mean is even more stupid.
:::

### Option C1 / W3 "@nest"

This option is called "@nest" by the Chrome article, because it's a syntax fairly close to things like [SASS] but uses a `@nest` syntax extension for problematic cases. This looks like this as an example:

```css
.foo {
  color: red;
  .bar {
    color: blue;
  }
  & p {
    color: yellow;
  }
  @nest .parent & {
    color: blue;
  }
}
```

### Option C2 "@nest restricted"

This is basically the same as C1/W3, but instead of having the `@nest` syntax mostly optional, it's required everywhere:

```css
.foo {
  color: red;
  @nest .bar {
    color: blue;
  }
  @nest & p {
    color: yellow;
  }
  @nest .parent & {
    color: blue;
  }
}
```

### Option C3 "brackets"

This syntax option avoids `@nest` all together and instead collects all nested rules in an extra code block:

```css
.foo {
  color: red;
  {
    .bar {
      color: blue;
    }
    & p {
      color: yellow;
    }
    .parent & {
      color: blue;
    }
  }
}
```

### Option W4 "two blocks"

This one adds an optional second block for each selector that contains the nested rules.
This is basically Option "C3" but with the nested rules after and not inside the parent rule block.

```css
.foo {
  color: red;
} {
  .bar {
    color: blue;
  }
  & p {
    color: yellow;
  }
  .parent & {
    color: blue;
  }
}
```

### Option W5 "@layer like"

This option uses `@nest` like the first two discussed options, but changes it usage to say that a selector block contains only nested elements similar to how a `@layer` block works. This way you can't set rules directly in the selector block.

```css
@layer .foo {
  & {
    color: red;
  }
  .bar {
    color: blue;
  }
  & p {
    color: yellow;
  }
  .parent & {
    color: blue;
  }
}
```

## Why even do this

There are some problems with just taking SASS syntax, which all these proposals try to solve.
Let's take the following example:

```css
/** not proposal syntax **/
.foo {
  some-thing: value;
  some-thing {}
}
```

Do you spot the issue? `some-thing` is an attribute in one case and a selector in the other. For a CSS parser it's hard to know which one is which and where to make the correct cutoff. It makes parsing CSS significantly harder, requires the parser knowing more context and is also more error prone if something goes wrong.

For this reason all proposals aim to solve this issue.

## The remaining options

After the first vote by Chrome, option C1/W3 won with a significant lead. So now only C1/W3, W4 and W5 are left for discussion. So let's go over these in more details and let me explain what I like and dislike about them.

:::sidenote
By the way, I do not like that the WebKit post ordered the options as W5, W4, W3 in their example and not (like I would've expected) W3, W4, W5.
:::

### W4 "two blocks"

Let's start in the middle.
This one is the weakest option in my opinion as it dilludes which selector belongs to a block of code.
Right now each selector or thing like `@layer` has exactly on code block attached to it.
This option would add a (to me magical) second block to each selector.

```css
.foo {
  some: rules;
}

/* Here be space */

{
  .nested {

  }
}
```

Also if I only want to create a nested rule, I still have to carry around the first selector like this:

```css
.foo {} {
  .nested {
    some: rule;
  }
}
```

And now my biggest problem: New developers.

WebKit is correctly arguing against option C1/W3, that the lenient syntax of optionally an `@nest` except for when it's actually required (when the selector does not start with a sepcial character) is probably confusing to beginners. But this syntax to me seems even more so.

From my experience teaching beginners, I would expect the following to be asked a lot if this proposal passes:

```css
.foo {
  /* Why can't I put nested rules here? */
} {
  /* And why can't I put normal rules here? */
}

.bar {}

/* And why does everything break if I write something unrelated here? */

{
  some: rule;
}
```

Both other options avoid this issue.

### Option W5 "@layer like"

At first glance I was appaled by this option because `@layer` still feels unfamiliar (and I didn't remember it at first) and I really don't like the unlabeled code block in the "alternative syntax":

```css
.foo {
  article {
    color: green;
  }

  /* What is this thing, why has it no name? */
  {
    some: rule;
  }

  p {
    color: blue;
  }
}
```

I still personally do not like the alternative syntax, but looking at `@layer` again, it at least seems reasonable to me.
There's also the syntax option of doing just nested selectors in the `@nest` block and pulling `&` selector blocks out of the `@nest` block.

### Option C1 / W3 "@nest"

Despite [WebKit promoting against this option][tweet-webkit-against-option3], this is still my favorite.
It's concise without significant boilerplate and feels familiar to many existing devs. It also has no unlabeled blocks and keeps everything belonging to one selector together in one block.

The only downside is the required `@nest` when a subselector starts with an alphanumeric character, but this is a tradeoff I'm actually willing to take.

## Wrapping up

This discussion has no right or wrong answers. It's important that the community agrees to an answer and even though there seems to be some internal arguing over how to go forward, I think getting CSS nesting ready is really important for the modern web.

If I had to choose myself, I would probably rank all five options the following (from 1. most liked to 5. least liked):

1. C1/W3 "@nest"
2. C2 "@nest restricted"
3. W5 "@layer like"
4. C3 "brackets"
5. W4 "two blocks"

[post-everything-is-chrome]: ./2022-02-07-everything-is-chrome
[tweet-webkit-against-option3]: https://twitter.com/webkit/status/1604860870416293888
[post-nativewapp]: ./2022-10-20-nativewapp
[post-building-this-blog]: ./2022-01-26-building-this-blog
[tweet-asking-for-nesting]: https://twitter.com/Snapstromegon/status/1532343442252210179
[chrome-options]: https://developer.chrome.com/blog/help-css-nesting/
[webkit-options]: https://webkit.org/blog/13607/help-choose-from-options-for-css-nesting-syntax/
[SASS]: https://sass-lang.com/
