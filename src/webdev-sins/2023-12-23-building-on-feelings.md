---
title: Building your site on feelings
abstract: |
  If you don't make your decisions based on data and reevaluate them every so often, you might want to reconsider.
date: 2023-12-23
---

Do you make your decisions based on facts when creating websites? Probably most would answer "yes" to this. I believe, that facts and feelings exist on a spectrum and you should strive for the fact side of this spectrum when making decisions.

## The facts & feelings spectrum

We are only human and we all have our own set of knowledge and experiences. This means that we all have a different set of "facts" we base our decisions on. But what if I told you that your facts are shifting towards feelings?

Over time your brain might misremember some things or things just become false. The web is a fast moving platform and e.g. only some years ago you shouldn't use JS to render your content, because search engines didn't execute JS and therefore wouldn't index that content. This is no longer true (for the big search engines). So while [you still shouldn't render your (static) content on the client](/webdev-sins/2022-01-26-render-static-content-on-the-client/), and search engines still index your page slower when JS is required, it's no longer a show stopper. This is a hard example of how a fact can become a feeling, but there are also more subtle things. E.g. like "more users use our page on desktop" or "we can't use feature X, because our user's browsers don't support it". There might be no clear right or wrong to decide here, but a spectrum of correctness. Hence the "facts & feelings spectrum".

## Transform your feelings into facts

:::reader-thought
How can my feelings turn into facts again?
:::

:::writer-thought
Data!
Data provide you a factual baseline to make decisions.
:::

:::reader-thought
But I don't have any data - what should I do?
:::

:::writer-thought
Start gathering it _right now_. You need to gather your first dataset before making any changes, so you actually know if you're changes have any impact at all.
:::

### Gathering data

So now that we know we need data, we need to some important points on gathering data:

#### Privacy

As a responsible developer on the web and also for a better UX, you want to avoid issues with privacy which force you to e.g. create cookie banners (yes, you can create professional websites without them, look at [GitHub](https://github.com)). You can still track some things like page view counts and so on. You can also do a little more when you _don't_ move your users data to 3rd party providers like Google Analytics. Always ask yourself whether or not you actually need some kind of data to make a decision, or if you can ignore it to improve your user's privacy.

#### Collection duration

Your data should be gathered over a time that is long enough to avoid having a shift based on the time. E.g. if your page is normally used more on weekends, it's not enough to compare data from friday to sunday with some from tuesday to wednesday. The same way you shouldn't compare data around black friday with some from a more "normal" time. Also you should try that the gap between data you compare is as small as possible and I also try to have the duration between datasets I compare to not be longer than the dataset itself. So if you look a tracking of two different weeks, they shouldn't be more than a week apart.

#### Test in isolation

Try to test one change at a time (at least one change per aspect). There are ways to test multiple things at a time, but when you're reading this post, you probably want to go with one of the simpler approaches at first, since they don't require a degree in statistics to make use of the results.
So if you want to test wether it's better to make a button green or blue, try only that aspect. Don't also change the wording of the button or stuff like that. That way you can compare the data directly.

#### A/B testing

[A/B testing](https://en.wikipedia.org/wiki/A/B_testing) is a common way to to test two things in parallel to see which performs better. This allows you to collect data during the same time, but requires some effort to set up. To achieve this, you could e.g. send all users whose IP ends in an even digit to one deployment and the odd digits to the other. This creates a basically random, but predictable distribution.

### Using your data

Now that you have some real world metrics, take some time to make use of them. Analyze which metrics actually show differences and whether or not they are significant and hint in the same direction. The stronger your metrics strain away from randomness, the more you can push your feelings back to facts.

## Make your facts stay facts

:::sidenote
I don't like the [PRG pattern](https://de.wikipedia.org/wiki/Post/Redirect/Get) to stop crawlers from following links. It makes pages unnecessary slow to load and also there are better ways for signalling crawlers you don't want "page juice" to flow to those links.
:::

To avoid your facts to drift back into feelings, make sure to reevaluate your assumptions every now and then. If you e.g. have a page with client side rendering that could also use server side rendering with client hydration, enable/disable this feature e.g. once a year and see if it has an impact on your users behavior or your search rankings. If you think Google will derank some of your content pages, because you just link to some unimportant internal pages from every page without a `rel="nofollow"`, test that. Especially if you use the [PRG pattern](https://de.wikipedia.org/wiki/Post/Redirect/Get) you might leave UX on the line for something that makes no difference at all.

## TLDR:

Make your decisions based on recent, relevant and significant data. For this you need to put some efforts into collecting them, but it will avoid some useless efforts, especially in the magic soup called "[SEO](https://en.wikipedia.org/wiki/Search_engine_optimization)".