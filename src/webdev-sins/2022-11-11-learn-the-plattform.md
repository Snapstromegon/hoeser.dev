---
title: Learning Frameworks and not the Plattform
abstract: |
  I can't count the number of times I see devs pulling their hair out trying to solve simple problems with big libraries
  written specifically for their current framework while the plattform already contains that functionality.
  Even more so, these devs from my experience tend to struggle more when switching frameworks.
date: 2022-07-07
tags:
  - lang:JS
  - concept:Web-Plattform
  - concept:FE-Framework
---

## I know the basics of HTML and CSS, where should I go next?

Often this is answered online with _"Learn the basics of JS and then go learn &lt;insert currently popular framework here&gt;"_ and I do believe that this is a very bad take.

This idea of being able to ignore the plattform and jumping into a framework immediatly will bring you a fast start, but will also make you fail hard. There are so many things in JS that you don't need a framework or library for, because the browser already gives those to you for free and even more so, that you don't need JS for because they are already in html like the `<details>` tag.
Always keep in mind: **The code you don't ship to the client is the fastest to load and execute!**

:::sidenote
I won't link to the referenced tweets here, because I don't want to shame one person for the error of many.
:::

My trigger for writing this entry was a Signal Engineer tweeting about how bad [Lit][lit] is and I couldn't agree less. His train of tweets to me reads like it's written by someone who learned many frameworks but never tried to learn the plattform underneath. It seems like because of this he has to invest a significant amount of work to learn new frameworks (which he says, he does often) and a bad time understanding what Lit is and how it works.

## But the Plattform is hard to use!

**Yes.**

In more words: **Actually NO!**

In even more words:

The plattform provides less abstractions and your code is often more verbose, but it is really consistent and first of all compatible with everything.

## Knowledge Transfer

If you ever touched React, you either needed someone to tell you or to find out yourself, that in React it's

```jsx
<div className="some-class"></div>
```

and not

```jsx
<div class="some-class"></div>
```

:::sidenote
I find JSX sometimes kinda hard, because to me it looks like "HTML in JS" and not like "a different syntax for JS". I know how it works and why, but I think [Lit][lit]'s approach of writing actual HTML in JS is significantly easier (and also avoids transpilation).
:::

like you're used to from HTML. This has nothing to do with JSX not being able to use `class` as an attribute name ([Preact][preact-class] tends to prefer `class` over `className` in JSX) or with the fact that `class` in JS is already a reserved keyword, but with the fact that the JSX syntax is modelled after the JS API and not after HTML.

Now imagine going over to some other framework, maybe even one that uses JSX. You will have to again check wether or not it has the same JSX quirks and even putting that aside, you'll have to learn a new set of statemanagement, maybe even event system and so on. Everything you learned is framework specific (just like the components you wrote) and if you switch frameworks, you need to check wether or not your assumptions on everything still hold.

If you instead e.g. learn the plattform i18n system, you will be able to apply that knowledge in any framework or project you come across and even better, you'll know when you don't even need a framework to begin with, because the boilerplate would be bigger than your actual code. It will also make your sites faster, because again, not using React is ~40kb of JS that you don't need to download and execute.

## Knowledge Stabillity

The plattform has a really good track record of keeping stabillity and not breaking existing things. If you learn how shadow-dom works today or how you toggle a class on an element via vanilla JS, this probably won't change during your lifetime.

In frameworks it's a different thing. Every new version might break core concepts that you learned, even when you stay with the same framework. This happened to React, Angular, and more before and will probably happen again to your favorite framework.

## Coming back to Lit

I started this post with a rant about a tweet about how [Lit][lit] is a bad framework and then went on to tell you not to learn frameworks. This does fit together, because [Lit][lit] tries to stay as close to the plattform as possible while offering reasonable abstractions. If I take a look back at the tweets I ranted about, they show that the main issue of the author is not Lit, but the understanding of Shadow Dom, Custom Elements and co. which Lit builds upon. I came from the other side to this discussion. While the tweet's author probably spend a lot of time during the last years writing apps in different frameworks, I already deployed [SPAs using native web components](https://github.com/Snapstromegon/FreestyleDM2019-Website) back in 2019. Because of that I know how the underlying system works and even if I strain away from using that API, it gives me an understanding of why Lit works in certain ways in certain places.

I think it's important to have a good understanding of the fundamentals even if you're not using them on a daily basis, because they will provide you a better understanding of the things you do use yesterday, today and in the future.

[lit]: https://lit.dev
[preact-class]: https://preactjs.com/guide/v10/differences-to-react/#:~:text=provided%20for%20convenience.-,Raw%20HTML%20attribute/property%20names,-Preact%20aims%20to
