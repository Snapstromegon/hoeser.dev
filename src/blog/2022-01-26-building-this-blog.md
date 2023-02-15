---
title: Building this Blog
abstract: |
  Make it fresh, style it new and give it new content!
date: 2022-01-26
tags:
- tool:11ty
- tool:rollup
- lang:JS
- concept:SSG
---

## A webdev / webdesigner struggling with design

Starting this blog is an endeavor I started before - more than once. But every time the designer in me wasn't really happy with the design and the developer in me wasn't happen with the implementation. And the writer in me didn't want to write anything before the issues with the blog were fixed, so I was in a henn and egg problem.

Importantly I wasn't lacking ideas, but had too many to do them all and also I was really eager to try fugu related stuff, but was held back by reasonable fallbacks.

Then during the last half year I was developing some internal tooling for my employer together with some technically more experienced developers and saw some reasons to start the [WebDev-Sins](/webdev-sins) series. Together with that I had some down days in university and [11ty](https://11ty.dev) 1.0 dropped (which I'm proud to say that I was a part of), so I sat down to reimplement my blog.

## The architecture

My blog uses a [Jamstack](https://jamstack.org) architecture with [11ty](https://11ty.dev) as a SSG and [Netlify](https://netlify.com) as the hosting provider.

## Notable implementation details

Like in the previous version of my blog I again integrated rollup to optimize the JS bundles. The benefits this gives and the details you can read in my blogpost about [11ty and rollup](/blog/2021-02-28-11ty-and-Rollup).

### Themeing

As you can see, each section of this site has two theme colors that influence the appearance of the page with colorful bars, link colors and logo colors.
To achieve this, the logo is an embedded SVG with some class attached to the polygon. The fill is then set with CSS and CSS custom properties (a.k.a. CSS variables).

## Let's take a look at performance

There's not much to say, lighthouse reports straight 100s (except for PWA).

So I'm really happy to how this came out and I'm looking forward to writing some content for this.
