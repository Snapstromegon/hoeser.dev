---
title: Don't use vw for font sizes
abstract: |
  Doing screen relative font sizes is a great idea, but vw is not the right way to go
date: 2022-02-07
tags:
  - lang:CSS
---

Two facts upfront:

1. Most developers and designers work on 16:9 or 16:10 screens
2. There are screens out there with 21:9 or even 32:9

Many designers and clients want their design to always look the same, no matter the screen size. Also responsive and especially fluent design became really popular during the last decade.

Adding to that, most developers nowadays know that px are not in any shape or form related to device pixels, so they start to fall out of favor. They get replaced by newer shiny units like vw or vh which are percentages of the viewport size.

These new sizes have many benefits, especially for layouts and screen related stuff, but they also have some downsides. The biggest one is, that they don't scale with page zoom!

## Demo

Test it here! The following text has a font-size of 3vw.

<p style="background: #8888;font-size: 2vw;padding: 1rem;">Text with vw font-size</p>

Try zooming in and out and you'll see that while everything else changes, the text in the grey box won't scale at all.
**This is a huge accessibillity issue!**

## Even more issues

If you set your font-size or layout via vw or vh, the page will probably break on screen aspect ratios you didn't expect or test for. Also many people use their browser not in fullscreen mode, but e.g. as a panel to the side.

Today I came across a site that used vw to define the size of its navbar - the result was, that the navbar took about a quarter of the screen on my monitor, while in 16:9 mode, it was just a normal navbar.

## The solution

The solution has three parts:

### 1. Testing, testing, testing

Always test your designs and pages on screen sizes you don't normally use. All browsers have devtools that allow you to simulate any aspect ratio and screen you want - use them!

### 2. Don't use vh/vw for fonts

Use em and rem - those are perfectly fine and scale everywhere. Add benefit: if your user has special settings for font scaling, they still apply!

### 3. For fluid fonts, use clamp

The [CSS clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()) function allows you to clamp a value between a minimum and maximum.

If you want fluid font-sizes, use it e.g. like this:

```css
p {
  font-size: clamp(1rem, 3vw, 2rem);
}
```

Try it with the element below, it has exactly these stylings:

<p style="background: #8888;font-size:clamp(1rem, 3vw, 2rem);padding: 1rem;">Text with vw font-size</p>

