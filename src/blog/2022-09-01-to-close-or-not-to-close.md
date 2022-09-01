---
title: To close or not to close
abstract: |
  Jake Archibald started the old discussion about wether or not to do selfclosing html tags and once again my response doesn't fit in 280 characters.
date: 2022-09-01
tags:
  - type:opinion
  - lang:html
---

:::commentBlock
This article is purely opinion based and IMO there's no "correct" opinion, just a discussion to be had.
If you think I've missed some obvious argument, feel free to ping me.
:::

## What are we talking about and why?

[Jake Archibald](https://twitter.com/jaffathecake) [tweeted about self-closing tags](https://twitter.com/jaffathecake/status/1565263210919370752) earlier today. My answer didn't fit in 280 characters, so I wrote them down here.

To put it in a nutshell, the question is wether you would rather write

```html
<input type="button" value="Click Me">
```

or

```html
<input type="button" value="Click Me" />
```

The difference is subtly, but important (or irrevelant depending on who you ask).

Both of the above are exactly the same. This is, because `<input>` is a self-closing html tag and you can leave the trailing slash out (in modern versions of html).

## I have an opinion

I think reading this:

```html
<div>
  <p>Some Text</p>
  <section>
    <p>Some more Text</p>
    <input type="button" value="Click Me" />
    <p>Even more Text</p>
  </section>
  <p>And an End</p>
</div>
```

is more clear than this:

```html
<div>
  <p>Some Text</p>
  <section>
    <p>Some more Text</p>
    <input type="button" value="Click Me">
    <p>Even more Text</p>
  </section>
  <p>And an End</p>
</div>
```

:::sidenote
I will call `<input />` the "explicit" and `<input>` the "implicit" syntax, although it's not really "explicit", since the trailing `/` doesn't have any meaning and is removed anyways.
:::

The second option _feels_ more like the element is left open. **I know that it is not left open**, but when I look at a bunch of code at a glance,
trying to find the one element which I forgot to close, I often prefer reading the "explicit" syntax.

### I'm inconsistent

At least some people would call me inconsistent, because on element attributes I have no problem with doing this

```html
<input disabled />
```

over 

```html
<input disabled="disabled" />
```

but this is, because I personally find attributes already pretty well packed inside the `<... />`.

### XML parsers...

:::sidenote
Sending `/>` and `>` over the wire takes (for all reasonable measurements) the same amount of time, because compression (and I hope you're using compression) will deal with that.
:::

HTML is not XML, but it can be and if you hold HTML to XML standards, you can parse your HTML with XML parsers if you'd ever want to. I do this fairly often in my day job, where I parse test result from some HTML report some tool created and doesn't spit out in a nicer format.
So, especially when it doesn't cost me anything, why would I make it harder for others? (By the way, if you actually want a machine compatible feed for my blog, use the [RSS Feed](/feed.xml))

## So I should always write `<input />`?

Yeah, not exactly...

I'm a strong believer in good tooling and so I think this should be left to tools.
You should write what is quickest for you. If your muscle memory says "explicit", do it "explicit", if you're new or you want to safe time, do the "implicit" way and let your formatter deal with the rest and if you're really good, you're using something like [emmet] and only write the first couple of characters and let [emmet] do some magic.

## What should I do now?

If you're using prettier (or something else that formats to the "explicit" syntax with your current settings) - nothing. Maybe you want to enable format on save, but that's up to you.

If you're currently not using a formatter, start using one. They can be a big help and you can configure them to your liking. Which brings me to my last point: Don't change existing projects/guidelines without the support of the project.
Noone likes that one guy who always commits code that doesn't follow the formatting rules. You can certainly try to convince projects of your opinion (which is easiest if it's your personal one), but don't force such a change.

[emmet]: https://emmet.io/
