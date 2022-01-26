---
title: Render static content on the client
abstract: |
  It's nice to use modern web development stuff to build simple things, but don't miss out on the basics by building heavy solutions for simple problems.
date: 2022-01-26
tags:
  - tool:11ty
  - lang:HTML
  - lang:JS
  - concept:SSG
  - concept:SSR
  - concept:CSR
---

I love to read around on [r/web_design](https://www.reddit.com/r/web_design/)'s _Feedback Friday_ or [r/webdev](https://www.reddit.com/r/webdev/)'s _Showoff Saturday_ where often newcomers show their newly build projects. I love to read across them, take a peak myself and either provide responses on what one could improve or what a nice next step would be. Sometimes I even try to reimplement something myself to see if I can recreate it.

Sadly far too often I see people posting simple, content driven websites on there, which take multiple seconds to load on my desktop machine. Of course they often left behind some basic performance stuff (e.g. not compressing content or serving way too large images or even using GIFs), but one (IMHO needless) problem I see way to often is using something like React or Vue to render the whole content on the client.

## But React / Vue / ... is fast!

Yes, that's not what I'm debating. If you know what you're doing frameworks can be really fast, especially when combined with things like SSR + client side hydration. But this is not what you see on those sites. There the normal data flow is most often:

1. Download static app shell
2. Download JS Framwork
3. Download JS App with components
4. Bootup JS App
5. Display the App shell
6. Download content via fetch on some JSON or HTML
7. Render the App

As you can see, the user will see a completely blank screen until step 5 and will start to see useful content at step 7. If you're displaying highly personalized content or something that exists on the client (e.g. the notes of a ToDo app stored in iDB), then this is fine, but on a content driven side everybody sees the same page. It's like you offer a service to tell anyone who asks the 1024th prime number (which is 8161), but instead of calculating it once and then remembering it, you recalculate it every time someone asks.

## What should I do instead?

The answer is simple and contains three letters **SSG**.

SSG stands for **S**erver **S**ide **G**eneration and is related to **S**erver **S**ide **R**endering (SSR) like Wordpress does.
These two concepts render the whole content on the server and just ship the ready made HTML to the client.

Doing this leads to the following flow:

1. Download static content <- and render page while loading in a streaming way

Does this seem simpler?
This is / can be significantly faster as one of my most favorite videos by the legendary [Jake Archibald](https://jakearchibald.com/) shows: [GitHub link click vs. new tab](https://youtu.be/4zG0AZRZD6Q)

## Is this a new idea?

While SSGs like [11ty](https://11ty.dev) (which this site uses) became more popular with the rise of the [Jamstack](https://jamstack.org/) in the last years, SSR is one of the oldest concepts on the web. Probably the most known way to do SSR is PHP with [Wordpress](https://wordpress.org/) being a dominant player.
In my experience it's also way easier to get things going with an SSG if you have a content driven site. Try it, it's worth it and link me, when you show your first lighthouse fireworks (or straight 100s without PWA)!
